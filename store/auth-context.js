import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
	token: "",
	isAuth: false,
	authenticate: () => {},
	logout: () => {},
	routeName: ""
});

const AuthContextprovider = ({ children }) => {
	const [authToken, setAuthToken] = useState();
	const [routeName, setRouteName] = useState();

	const authenticate = (token) => {
		AsyncStorage.setItem("token", token);
		setAuthToken(token);
	};

	const logout = () => {
		setAuthToken(null);
		AsyncStorage.removeItem("token");
	};

	const defineRouteName = (routeName) => {
		setRouteName(routeName);
	};

	const value = {
		token: authToken,
		isAuth: !!authToken,
		authenticate: authenticate,
		logout: logout,
		defineRouteName: defineRouteName,
		routeName: routeName
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
export default AuthContextprovider;
