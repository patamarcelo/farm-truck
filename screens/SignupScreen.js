import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { createUser } from "../utils/auth";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";

function SignupScreen() {
	const [isAuth, setIsAuth] = useState(false);

	const context = useContext(AuthContext);

	const signupHandler = async ({ email, password }) => {
		setIsAuth(true);
		try {
			const token = await createUser(email, password);
			context.authenticate(token);
		} catch (err) {
			console.log("erro ao criar email ,", err);
			Alert.alert(
				"erro ao criar!!",
				"erro ao criar usuário, tente novamente deppos"
			);
		} finally {
			setIsAuth(false);
		}
	};

	if (isAuth) {
		return <LoadingOverlay message={"creating user"} />;
	}

	return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
