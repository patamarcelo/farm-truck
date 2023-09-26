import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { loginUser } from "../utils/auth";
import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";

function LoginScreen() {
	const [isLoading, setIsLoading] = useState(false);
	const navigation = useNavigation();

	const context = useContext(AuthContext);

	const loginUserhandler = async ({ email, password }) => {
		setIsLoading(true);
		try {
			const token = await loginUser(email, password);
			context.authenticate(token);
		} catch (error) {
			console.log("erro ao logar usuário", error);
			Alert.alert("Authentication Failed!!", "Try again later!!");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <LoadingOverlay message={"loging you in...."} />;
	}
	return <AuthContent isLogin onAuthenticate={loginUserhandler} />;
}

export default LoginScreen;
