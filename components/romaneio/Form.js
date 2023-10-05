import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../ui/Button";
import FormInputs from "./FormInputs";

import { useState } from "react";
import { Colors } from "../../constants/styles";

import { useForm, Controler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
	placa: yup
		.string()
		.required("Informe a placa")
		.min(7, "placa contem 7 digitos"),
	motorista: yup.string().required("Digite o nome do Motorista")
});

const FormScreen = () => {
	const navigation = useNavigation();
	const [isLogin, setIsLogin] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({
		resolver: yupResolver(schema)
	});

	const submitHandler = (data) => {
		console.log("salvar valores");
		console.log(data);
	};

	const cancelHandler = () => {
		console.log("limpar o formulário");
		navigation.navigate("Welcome");
	};
	return (
		<View style={styles.mainContainer}>
			<View style={styles.formContainer}>
				<FormInputs
					errors={errors}
					control={control}
					isLogin={isLogin}
					onSubmit={submitHandler}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					onPress={handleSubmit(submitHandler)}
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
