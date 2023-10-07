import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";

import { KeyboardAvoidingView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Button from "../ui/Button";
import FormInputs from "./FormInputs";

import { useState, useLayoutEffect, useContext, useEffect } from "react";
import { Colors } from "../../constants/styles";

import { useForm, Controler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import IconButton from "../ui/IconButton";
import { NavigationContext } from "@react-navigation/native";

const schema = yup.object({
	placa: yup
		.string()
		.required("Informe a placa")
		.min(7, "placa contem 7 digitos")
		.max(7),
	motorista: yup.string().required("Digite o nome do Motorista"),
	fazenda: yup.string().required("Selecione uma fazenda"),
	parcelas: yup.array().min(1, "Selecione pelo menos 1 parcela")
});

const FormScreen = ({ navigation }) => {
	const height = useHeaderHeight();
	// const navigation = useNavigation();
	const navigationContext = useContext(NavigationContext);

	const [isLogin, setIsLogin] = useState(false);
	const [parcelasSelected, setParcelasSelected] = useState([]);
	const [selectedFarm, setSelectedFarm] = useState(null);

	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		reset,
		resetField,
		formState: { errors }
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			placa: "",
			fazenda: "Selecione uma fazenda"
		}
	});

	const submitHandler = (data) => {
		console.log("salvar valores");
		console.log(data);
		reset();
	};

	const cancelHandler = () => {
		// console.log("limpar o formulário");
		navigation.navigate("Welcome");
	};

	const handlerChange = (e, name) => {
		// console.log("ouvindo a mudança", e, name);
		if (name === "placa") {
			console.log(name, e);
		}
		if (name === "parcelas") {
			if (e.length === 0) {
				setValue("cultura", "");
				setValue("variedade", "");
			}
		}
		if (name === "fazenda") {
			// console.log("fazenda", e);
			console.log("mudança de fazernda");
			resetField("parcelas");
			setSelectedFarm(e);
		}
	};

	const refreshHandler = () => {
		reset();
		console.log("refresh ");
	};

	return (
		// <KeyboardAvoidingView
		// 	style={{ flex: 1 }}
		// 	behavior={Platform.OS === "ios" ? "padding" : null}
		// 	enabled
		// 	keyboardVerticalOffset={height}
		// 	// keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}
		// >
		// 	<ScrollView>
		<KeyboardAwareScrollView>
			<View style={styles.mainContainer}>
				<View style={styles.formContainer}>
					<FormInputs
						errors={errors}
						control={control}
						isLogin={isLogin}
						onSubmit={submitHandler}
						getValues={getValues}
						handlerChange={handlerChange}
						selectedFarm={selectedFarm}
						setValue={setValue}
					/>
				</View>
				<View style={styles.buttonContainer}>
					<Button
						disabled={
							Object.keys(errors).length === 0 ? false : true
						}
						onPress={handleSubmit(submitHandler)}
						btnStyles={styles.btnbtnStylesRegister}
					>
						Registrar
					</Button>
					<View style={styles.cancelContainer}>
						<Button
							onPress={cancelHandler}
							btnStyles={styles.btnbtnStylesCancel}
						>
							Cancelar
						</Button>
						<Button
							onPress={refreshHandler}
							btnStyles={styles.btnbtnStylesClean}
							textStyles={styles.textBtnCancelStyle}
						>
							Limpar
						</Button>
					</View>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default FormScreen;

const styles = StyleSheet.create({
	cancelContainer: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	formContainer: {
		width: "90%"
	},
	btnbtnStylesRegister: {
		backgroundColor: "green"
	},
	btnbtnStylesCancel: {
		backgroundColor: "grey",
		width: "48%"
	},
	btnbtnStylesClean: {
		backgroundColor: Colors.yellow[300],
		width: "48%",
		opacity: 0.6
	},
	textBtnCancelStyle: {
		color: "grey"
	},
	buttonContainer: {
		width: "90%",
		margin: 20,
		gap: 10,
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
