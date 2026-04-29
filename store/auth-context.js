import { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { resetState } from "./redux/romaneios";

export const AuthContext = createContext({
	token: null,
	isAuth: false,
	isBootstrapping: true,
	authenticate: async () => { },
	logout: async () => { },
	defineRouteName: () => { },
	routeName: "",
});

const AuthContextprovider = ({ children }) => {
	const [authToken, setAuthToken] = useState(null);
	const [routeName, setRouteName] = useState("");
	const [isBootstrapping, setIsBootstrapping] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		let mounted = true;

		const restoreToken = async () => {
			try {
				const storedToken = await AsyncStorage.getItem("token");

				if (!mounted) return;

				if (storedToken) {
					setAuthToken(storedToken);
				}
			} catch (e) {
				console.log("restoreToken error", e);
			} finally {
				if (mounted) {
					setIsBootstrapping(false);
				}
			}
		};

		restoreToken();

		return () => {
			mounted = false;
		};
	}, []);

	const authenticate = useCallback(async (token, options = {}) => {
		try {
			await AsyncStorage.setItem("token", token);

			if (options.refreshUserData) {
				try {
					await options.refreshUserData();
				} catch (refreshError) {
					console.log("refreshUserData falhou, mas login será mantido:", refreshError);
				}
			}

			setAuthToken(token);
		} catch (e) {
			console.log("authenticate error:", e);
			throw e;
		}
	}, []);

	const logout = useCallback(async () => {
		setAuthToken(null);
		dispatch(resetState());

		try {
			await AsyncStorage.removeItem("token");
			await AsyncStorage.removeItem("user");
			await AsyncStorage.removeItem("userCustomAttr");
			await AsyncStorage.removeItem("projetosCadastrados");
		} catch (e) {
			console.log("logout storage error:", e);
		}
	}, [dispatch]);

	const defineRouteName = useCallback((name) => {
		setRouteName(name);
	}, []);

	const value = {
		token: authToken,
		isAuth: !!authToken,
		isBootstrapping,
		authenticate,
		logout,
		defineRouteName,
		routeName,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextprovider;