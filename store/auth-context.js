import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
	token: "",
	isAuth: false,
	authenticate: () => {},
	logout: () => {}
});

const AuthContextprovider = ({ children }) => {
	const [authToken, setAuthToken] = useState();

	const authenticate = (token) => {
		AsyncStorage.setItem("token", token);
		setAuthToken(token);
	};

	const logout = () => {
		setAuthToken(null);
		AsyncStorage.removeItem("token");
	};

	const value = {
		token: authToken,
		isAuth: !!authToken,
		authenticate: authenticate,
		logout: logout
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
export default AuthContextprovider;
