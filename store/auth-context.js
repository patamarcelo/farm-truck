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
				if (storedToken) setAuthToken(storedToken);
			} catch (e) {
				// opcional: console.warn("restoreToken error", e);
			} finally {
				if (mounted) setIsBootstrapping(false);
			}
		};

		restoreToken();

		return () => {
			mounted = false;
		};
	}, []);

	const authenticate = useCallback(async (token) => {
		setAuthToken(token);
		try {
			await AsyncStorage.setItem("token", token);
		} catch (e) {
			// opcional: console.warn("setItem token error", e);
		}
	}, []);

	const logout = useCallback(async () => {
		setAuthToken(null);
		dispatch(resetState());
		try {
			await AsyncStorage.removeItem("token");
		} catch (e) {
			// opcional: console.warn("removeItem token error", e);
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
