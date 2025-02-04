import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../ui/Button";
import Input from "./Input";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
	const [enteredEmail, setEnteredEmail] = useState("");
	const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
	const [enteredPassword, setEnteredPassword] = useState("");
	const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

	const [showPassword, setshowPassword] = useState(true);

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

	const handlerPassword = () => {
		setshowPassword(!showPassword);
	};

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
			<View>
				{!isLogin ? (
					<Input
						label="Email"
						onUpdateValue={updateInputValueHandler.bind(
							this,
							"email"
						)}
						value={enteredEmail}
						keyboardType="email-address"
						isInvalid={emailIsInvalid}
					/>
				) : (
					<>
						<Input
							label="Email"
							onUpdateValue={updateInputValueHandler.bind(
								this,
								"email"
							)}
							value={enteredEmail}
							keyboardType="email-address"
							isInvalid={emailIsInvalid}
						/>

						<Input
							label="Senha"
							onUpdateValue={updateInputValueHandler.bind(
								this,
								"password"
							)}
							secure={showPassword}
							value={enteredPassword}
							isInvalid={passwordIsInvalid}
							hasIcon={true}
							setshowPassword={handlerPassword}
							showPassword={showPassword}
						/>
					</>
				)}

				<View style={styles.buttons}>
					<Button onPress={submitHandler} btnStyles={styles.btnStyle}>
						{isLogin ? "Entrar" : "Redefinir Senha"}
					</Button>
				</View>
			</View>
		</View>
	);
}

export default AuthForm;

const styles = StyleSheet.create({
	buttons: {
		marginTop: 12,
	},
	btnStyle: {
		backgroundColor: "green",
		marginTop: 20,
		paddingVertical: 12
	}
});
