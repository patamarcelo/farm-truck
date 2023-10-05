import { useState } from "react";
import { Alert, StyleSheet, View, Text, Image } from "react-native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";

function AuthContent({ isLogin, onAuthenticate }) {
	const navigation = useNavigation();
	const [credentialsInvalid, setCredentialsInvalid] = useState({
		email: false,
		password: false,
		confirmEmail: false,
		confirmPassword: false
	});

	function switchAuthModeHandler() {
		if (isLogin) {
			navigation.navigate("NewPassword");
		} else {
			navigation.navigate("Login");
		}
	}

	function submitHandler(credentials) {
		let { email, confirmEmail, password, confirmPassword } = credentials;

		email = email.trim();
		password = password.trim();

		const emailIsValid = email.includes("@");
		const passwordIsValid = password.length > 6;
		const emailsAreEqual = email === confirmEmail;
		const passwordsAreEqual = password === confirmPassword;
		if (isLogin) {
			if (!emailIsValid || !passwordIsValid) {
				Alert.alert(
					"Dados Inválidos",
					"Por favor conferir os dados inseridos."
				);
				setCredentialsInvalid({
					email: !emailIsValid,
					confirmEmail: !emailIsValid || !emailsAreEqual,
					password: !passwordIsValid,
					confirmPassword: !passwordIsValid || !passwordsAreEqual
				});
				return;
			}
		}

		if (!isLogin) {
			if (!emailIsValid) {
				Alert.alert(
					"E-mail Inválido",
					"Por favor conferir o e-mail Inserido."
				);
				setCredentialsInvalid({
					email: !emailIsValid,
					confirmEmail: true,
					password: true,
					confirmPassword: true
				});
				return;
			}
		}
		onAuthenticate({ email, password });
	}

	return (
		<>
			<View style={styles.mainContainer}>
				<View style={styles.authContent}>
					<AuthForm
						isLogin={isLogin}
						onSubmit={submitHandler}
						credentialsInvalid={credentialsInvalid}
					/>
					<View style={styles.buttons}>
						<FlatButton onPress={switchAuthModeHandler}>
							{isLogin ? "Esqueci minha senha" : "Tela de Login"}
						</FlatButton>
					</View>
				</View>
			</View>
			<View style={styles.titleContainer}>
				<Image
					source={require("../../assets/diamond.png")}
					style={styles.image}
				/>
			</View>
		</>
	);
}

export default AuthContent;

const styles = StyleSheet.create({
	title: {
		fontSize: 38,
		color: "whitesmoke",
		fontStyle: "italic",
		fontWeight: "bold"
	},
	titleContainer: {
		marginTop: -80,
		marginBottom: 30,
		justifyContent: "center",
		alignItems: "center"
	},
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%"
	},
	authContent: {
		// marginTop: 64,
		width: "100%",
		// flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
		padding: 16,
		borderRadius: 8,
		// backgroundColor: Colors.primary800,
		elevation: 2,
		shadowColor: "black",
		shadowOffset: { width: 5, height: 10 },
		shadowOpacity: 0.35,
		shadowRadius: 4
	},
	buttons: {
		marginTop: 8
	},
	image: {
		width: 60,
		height: 60
	}
});
