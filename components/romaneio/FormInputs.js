import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../ui/Button";
import Input from "../Auth/Input";

function FormInputs({ isLogin, onSubmit, credentialsInvalid }) {
	const [enteredEmail, setEnteredEmail] = useState("");
	const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
	const [enteredPassword, setEnteredPassword] = useState("");
	const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

	const {
		email: emailIsInvalid,
		confirmEmail: emailsDontMatch,
		password: passwordIsInvalid,
		confirmPassword: passwordsDontMatch
	} = credentialsInvalid;

	function updateInputValueHandler(inputType, enteredValue) {
		switch (inputType) {
			case "email":
				setEnteredEmail(enteredValue);
				break;
			case "confirmEmail":
				setEnteredConfirmEmail(enteredValue);
				break;
			case "password":
				setEnteredPassword(enteredValue);
				break;
			case "confirmPassword":
				setEnteredConfirmPassword(enteredValue);
				break;
		}
	}

	function submitHandler() {
		onSubmit({
			email: enteredEmail,
			confirmEmail: enteredConfirmEmail,
			password: enteredPassword,
			confirmPassword: enteredConfirmPassword
		});
	}

	return (
		<View style={styles.form}>
			<Input
				label="Placa"
				onUpdateValue={updateInputValueHandler.bind(this, "email")}
				value={enteredEmail}
				keyboardType="email-address"
				isInvalid={emailIsInvalid}
				inputStyles={styles.inputStyles}
			/>

			<Input
				label="Motorista"
				onUpdateValue={updateInputValueHandler.bind(this, "password")}
				// secure
				value={enteredPassword}
				isInvalid={passwordIsInvalid}
				inputStyles={styles.inputStyles}
			/>
		</View>
	);
}

export default FormInputs;

const styles = StyleSheet.create({
	inputStyles: {
		backgroundColor: "white"
	},
	buttons: {
		marginTop: 12
	}
});
