import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../store/firebase";
import nodeServer from "../../utils/axios/axios";
import {
	setUser,
	setUserAttr,
	setProjetos,
} from "../../store/redux/romaneios";

const normalizeProjetos = (value) => {
	if (!value) return [];

	if (Array.isArray(value)) {
		return value.filter(Boolean);
	}

	if (typeof value === "string") {
		return value
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return [];
};

const parseReloadCustomAttributes = (firebaseUser) => {
	try {
		const rawAttrs = firebaseUser?.reloadUserInfo?.customAttributes;

		if (!rawAttrs) return {};

		return JSON.parse(rawAttrs);
	} catch (error) {
		console.log("Erro ao ler reloadUserInfo.customAttributes:", error);
		return {};
	}
};

const getUsersCheckUrl = () => {
	const baseURL = nodeServer?.defaults?.baseURL || "";

	return baseURL.replace(/\/romaneios\/?$/, "/users/check-user");
};

export const refreshUserData = async (dispatch) => {
	const firebaseUser = auth.currentUser;

	if (!firebaseUser) {
		console.log("refreshUserData abortado: sem usuário Firebase");
		return null;
	}

	await firebaseUser.reload();

	const freshToken = await firebaseUser.getIdToken(true);
	const tokenResult = await firebaseUser.getIdTokenResult(true);

	const uid = firebaseUser.uid;
	const email = firebaseUser.email;

	const claims = tokenResult?.claims || {};
	const reloadAttrs = parseReloadCustomAttributes(firebaseUser);

	let backendUser = null;

	try {
		const usersCheckUrl = getUsersCheckUrl();

		console.log("Validando usuário em:", usersCheckUrl);

		const response = await nodeServer.post(usersCheckUrl, {
			uid,
		});

		backendUser = response?.data?.user || null;
	} catch (error) {
		console.log(
			"refreshUserData: erro ao validar usuário no backend:",
			error?.response?.status,
			error?.response?.data || error?.message
		);
	}

	const backendCustomClaims = backendUser?.customClaims || {};

	const customAttrs = {
		...claims,
		...reloadAttrs,
		...backendCustomClaims,
	};

	const projetos = normalizeProjetos(
		customAttrs?.projetosLiberados ||
		customAttrs?.projetos ||
		customAttrs?.fazendas
	);

	const normalizedUser = {
		uid,
		email,
		displayName: firebaseUser.displayName || backendUser?.displayName || null,
		photoURL: firebaseUser.photoURL || backendUser?.photoURL || null,
		emailVerified: firebaseUser.emailVerified,
		disabled: backendUser?.disabled || false,
	};

	dispatch(setUser(normalizedUser));
	dispatch(setUserAttr(customAttrs));

	if (projetos.length > 0) {
		dispatch(setProjetos(projetos));
	} else {
		console.log("refreshUserData: nenhum projeto encontrado", {
			claims,
			reloadAttrs,
			backendCustomClaims,
		});
	}

	await AsyncStorage.multiSet([
		["token", freshToken],
		["user", JSON.stringify(normalizedUser)],
		["userCustomAttr", JSON.stringify(customAttrs)],
		["projetosCadastrados", JSON.stringify(projetos)],
	]);

	console.log("Usuário/projetos atualizados:", {
		uid,
		email,
		projetosLength: projetos.length,
		projetos,
	});

	return {
		user: normalizedUser,
		userCustomAttr: customAttrs,
		projetos,
		token: freshToken,
	};
};