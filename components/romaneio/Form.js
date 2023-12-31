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

import { INITIAL } from "../../store/initialForm";

import { useDispatch, useSelector } from "react-redux";
import { addRomaneio } from "../../store/redux/romaneios";
import { romaneioSelector } from "../../store/redux/selector";

import LoadingOverlay from "../../components/ui/LoadingOverlay";

import { saveDataOnFirebaseAndUpdate } from "../../store/firebase/index";

import { useIsFocused } from "@react-navigation/native";

const schema = yup.object({
	placa: yup
		.string()
		.required("Informe a placa")
		.min(7, "placa contem 7 digitos")
		.max(7),
	motorista: yup.string().required("Digite o nome do Motorista"),
	fazendaOrigem: yup.string().required("Selecione uma fazenda"),
	parcelasNovas: yup.array().min(1, "Selecione pelo menos 1 parcela")
});

const FormScreen = ({ navigation }) => {
	const romaneioData = useSelector(romaneioSelector);
	const dispatch = useDispatch();
	const height = useHeaderHeight();
	// const navigation = useNavigation();
	const navigationContext = useContext(NavigationContext);
	const [isLoading, setIsLoading] = useState(false);

	const [isLogin, setIsLogin] = useState(false);
	const [parcelasSelected, setParcelasSelected] = useState([]);
	const [selectedFarm, setSelectedFarm] = useState(null);
	const [selectedDest, setSelectedDest] = useState(null);
	const isFocused = useIsFocused();

	useEffect(() => {
		console.log(selectedFarm);
		if (isFocused) {
			setSelectedFarm(null);
		}
	}, [isFocused]);
	console.log(isFocused);

	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		reset,
		resetField,
		clearErrors,
		formState: { errors }
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			placa: "",
			motorista: "",
			fazendaOrigem: "Selecione uma fazenda",
			parcelasNovas: [],
			cultura: "",
			mercadoria: "",
			observacoes: ""
		}
	});

	const submitHandler = async (data) => {
		const numbers = romaneioData.map((data) => data.relatorioColheita);
		const romNum = Math.max.apply(Math, numbers);
		console.log("salvar valores");
		const newData = {
			...INITIAL,
			...data,
			//dummy data below
			idApp: Date.now(),
			appDate: new Date(),
			createdAt: new Date(),
			entrada: new Date()
			// relatorioColheita: numbers.length > 0 ? romNum + 1 : 1
		};
		console.log(newData);
		setIsLoading(true);
		//salve local
		try {
			try {
				dispatch(addRomaneio(newData));
			} catch (err) {
				console.log("problema em salvar o arquivo local", err);
			}
			// save on DB
			// saveDataOnFirebaseAndUpdate(newData);
		} catch (err) {
			console.log("erro submit global", err);
		} finally {
			setTimeout(() => {
				setIsLoading(false);
				reset();
				navigation.navigate("Welcome");
			}, 500);
		}
	};

	const cancelHandler = () => {
		// console.log("limpar o formulário");
		navigation.navigate("Welcome");
		clearErrors();
	};

	const handlerChange = (e, name) => {
		// console.log("ouvindo a mudança", e, name);
		if (name === "placa") {
			console.log(name, e);
		}
		if (name === "parcelasNovas") {
			if (e.length === 0) {
				setValue("cultura", "");
				setValue("mercadoria", "");
			}
		}
		if (name === "fazenda") {
			// console.log("fazenda", e);
			console.log("mudança de fazernda");
			resetField("parcelasNovas");
			setSelectedFarm(e);
		}
	};

	const refreshHandler = () => {
		reset();
		clearErrors();
		console.log("refresh ");
	};

	if (isLoading) {
		return <LoadingOverlay message={"Salvando..."} />;
	}

	return (
		// <KeyboardAvoidingView
		// 	style={{ flex: 1 }}
		// 	behavior={Platform.OS === "ios" ? "padding" : null}
		// 	enabled
		// 	keyboardVerticalOffset={height}
		// 	// keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}
		// >
		// 	<ScrollView>
		<KeyboardAwareScrollView style={styles.mainRootContainer}>
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
						setSelectedFarm={setSelectedFarm}
						selectedDest={selectedDest}
						setSelectedDest={setSelectedDest}
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
		gap: 10
	},
	mainContainer: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		height: "100%"
	},
	text: {
		color: "white"
	},
	mainRootContainer: {
		flex: 1,
		backgroundColor: Colors.primary500
	}
});
