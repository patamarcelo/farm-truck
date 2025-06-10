import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { newPassword } from "../utils/auth";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import { useNavigation } from "@react-navigation/native";
import { triggerResetEmail } from "../store/firebase";

function NewPassword() {
	const [isAuth, setIsAuth] = useState(false);
	const context = useContext(AuthContext);

	const navigation = useNavigation();

	const signupHandler = async ({ email, password }) => {
		setIsAuth(true);
		try {
			// const status = await newPassword(email);
			const status = await triggerResetEmail(email);

			Alert.alert(
				"Senha resetada!!",
				`Um e-mail foi enviado para ${email} com as intstruções para redefinição da Senha!!`
			);
			navigation.navigate("Login");
		} catch (err) {
			console.log("erro ao criar email ,", err);
			Alert.alert(
				"Erro ao resetar!!",
				`Confira se o email ${email} está correto e tente novamente!!`
			);
		} finally {
			setIsAuth(false);
		}
	};

	if (isAuth) {
		return (
			<LoadingOverlay
				message={"Trabalhando na sua solicitação..."}
				style={styles.textColor}
			/>
		);
	}

	return <AuthContent onAuthenticate={signupHandler} />;
}

export default NewPassword;

const styles = StyleSheet.create({
	textColor: {
		color: "white"
	}
});
