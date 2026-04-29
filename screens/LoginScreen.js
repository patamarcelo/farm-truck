import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { authUser } from "../store/firebase";

import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";
import { setUser, setProjetos, setUserAttr } from "../store/redux/romaneios";
import { useDispatch } from "react-redux";

import { refreshUserData } from "../store/firebase/syncUserData";

function LoginScreen() {
	const [isLoading, setIsLoading] = useState(false);
	const context = useContext(AuthContext);
	const dispatch = useDispatch();

	const loginUserhandler = async ({ email, password }) => {
		setIsLoading(true);

		try {
			const credential = await authUser(email, password);
			const firebaseUser = credential.user;
			const token = await firebaseUser.getIdToken(true);

			// fallback antigo via customAttributes
			try {
				dispatch(setUser(firebaseUser));

				const rawAttrs = firebaseUser?.reloadUserInfo?.customAttributes;

				if (rawAttrs) {
					const attrs = JSON.parse(rawAttrs);

					dispatch(setUserAttr(attrs));

					if (attrs?.projetosLiberados) {
						dispatch(setProjetos(attrs.projetosLiberados));
					}
				}
			} catch (attrsError) {
				console.log("Erro ao ler customAttributes no login:", attrsError);
			}

			await context.authenticate(token, {
				refreshUserData: () => refreshUserData(dispatch),
			});
		} catch (error) {
			console.log("erro ao logar usuário", error);

			Alert.alert(
				"Erro ao Fazer Login!!",
				`Tente novamente mais tarde!! ${error?.message || error}`
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <LoadingOverlay message={"Conectando você..."} />;
	}

	return <AuthContent isLogin onAuthenticate={loginUserhandler} />;
}

export default LoginScreen;