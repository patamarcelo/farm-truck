import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../ui/Button";
import FormInputs from "./FormInputs";

import { useState } from "react";
import { Colors } from "../../constants/styles";

const FormScreen = () => {
	const navigation = useNavigation();
	const [isLogin, setIsLogin] = useState(false);
	const [credentialsInvalid, setCredentialsInvalid] = useState({
		email: false,
		password: false,
		confirmEmail: false,
		confirmPassword: false
	});

	const submitHandler = () => {
		console.log("salvar valores");
	};

	const cancelHandler = () => {
		console.log("limpar o formulário");
		navigation.navigate("Welcome");
	};
	return (
		<View style={styles.mainContainer}>
			<View style={styles.formContainer}>
				<FormInputs
					isLogin={isLogin}
					credentialsInvalid={credentialsInvalid}
					onSubmit={submitHandler}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					onPress={submitHandler}
					btnStyles={styles.btnbtnStylesRegister}
				>
					Registrar
				</Button>
				<Button
					onPress={cancelHandler}
					btnStyles={styles.btnbtnStylesCancel}
				>
					Cancelar
				</Button>
			</View>
		</View>
	);
};

export default FormScreen;

const styles = StyleSheet.create({
	formContainer: {
		width: "90%"
	},
	btnbtnStylesRegister: {
		backgroundColor: "green"
	},
	btnbtnStylesCancel: {
		backgroundColor: "grey"
	},
	buttonContainer: {
		width: "90%",
		margin: 20,
		gap: 20,
		marginBottom: 70
	},
	mainContainer: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center"
	},
	text: {
		color: "white"
	}
});
