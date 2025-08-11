import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	KeyboardAvoidingView,
	Pressable,
	Platform,
	StatusBar
} from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";



import Button from "../ui/Button";
import FormInputs from "./FormInputs";

import {
	useRef,
	useState,
	useLayoutEffect,
	useContext,
	useEffect
} from "react";
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

import * as Location from "expo-location";

import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import BottomSheetSelect from "./BottomSheetSelect";

import QrBottomSheet from "./QrBottom";
import QrCamera from "./QrCamera";

import * as Haptics from 'expo-haptics';

const schema = yup.object({
	placa: yup
		.string()
		.required("Informe a placa")
		.min(7, "placa contem 7 digitos")
		.max(7),
	motorista: yup.string().required("Digite o nome do Motorista"),
	// fazendaOrigem: yup.string().required("Selecione uma fazenda"),
});

const FormScreen = ({ navigation, route }) => {
	const romaneioData = useSelector(romaneioSelector);
	const dispatch = useDispatch();
	const height = useHeaderHeight();
	// const navigation = useNavigation();
	const navigationContext = useContext(NavigationContext);
	const [isLoading, setIsLoading] = useState(false);

	const [isLogin, setIsLogin] = useState(false);
	const [parcelasSelected, setParcelasSelected] = useState([]);
	const [selectedFarm, setSelectedFarm] = useState(null);
	const [selectedDest, setSelectedDest] = useState("Selecione o Destino");
	const [filteredFarms, setFilteredFarms] = useState([]);
	const isFocused = useIsFocused();


	const [parcelasSelectedObject, setParcelasSelectedObject] = useState([]);

	const [checkIfCaixasSeted, setCheckIfCaixasSeted] = useState(false);

	const [cameFromGoBack, setCameFromGoBack] = useState(true);


	useEffect(() => {
		const sizeArr = parcelasSelectedObject?.length
		if (sizeArr > 1) {
			setCheckIfCaixasSeted(true)
			const getNoneorZero = (parcelas) => parcelas.caixas === undefined || parcelas.caixas === 0
			const caixaNumbers = parcelasSelectedObject.some(getNoneorZero)
			console.log('get caixas zero :, ', caixaNumbers)
			if (!caixaNumbers) {
				setCheckIfCaixasSeted(false)
			}
		} else {
			setCheckIfCaixasSeted(false)
		}
	}, [parcelasSelectedObject]);

	const [location, setLocation] = useState(null);

	const [obsCheckIcon, setObsCheckIcon] = useState("");

	const [openCamera, setOpenCamera] = useState(false);

	const [qrValues, setQrValues] = useState({});

	// useEffect(() => {
	// 	if (isFocused) {
	// 		setSelectedFarm(null);
	// 		reset();
	// 		clearErrors();
	// 	}
	// }, [isFocused]);

	// useEffect(() => {
	// 	// Check the parameter passed via navigation
	// 	const fromGoBack = route.params?.fromGoBack || false;
	// 	console.log('fromGoBack: ,,,,', fromGoBack)
	// 	if (isFocused) {
	// 		if (!fromGoBack) {
	// 			// Trigger logic only when not coming from goBack
	// 			setSelectedFarm(null);
	// 			reset();
	// 			clearErrors();
	// 		}
	// 	}
	// }, [isFocused]);


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
			cultura: "",
			mercadoria: "",
			observacoes: "",
			fazendaDestino: ""
		}
	});

	console.log('errors::::', errors);
	const submitHandler = async (data) => {
		const numbers = romaneioData.map((data) => data.relatorioColheita);
		const romNum = Math.max.apply(Math, numbers);
		console.log("salvar valores");
		const newData = {
			...INITIAL,
			...data,
			coords: location,
			//dummy data below
			idApp: Date.now(),
			appDate: new Date(),
			createdAt: new Date(),
			entrada: new Date(),
			parcelasObjFiltered: parcelasSelectedObject,
			relatorioColheita: numbers.length > 0 ? romNum + 1 : 1
		};
		// console.log(newData);
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
				navigation.navigate("NewAuthStack");
			}, 500);
		}
	};

	const cancelHandler = () => {
		// console.log("limpar o formulário");
		// navigation.navigate("Welcome");
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		navigation.goBack(null);
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
		if (name === "fazendaDestino") {
			getValues();
			console.log("definido o valor aqui", e, name);
			setValue("fazendaDestino", e);
		}
	};

	useEffect(() => {
		if (qrValues) {
			const newStr = qrValues.toString().split("|");
			const newObj = {};
			newStr.forEach((str, index) => {
				if (index % 2 === 0) {
					newObj[str] = newStr[index + 1];
				}
			});
			console.log("objFromQRCODE: ", newObj);
			setValue("motorista", newObj?.motorista ? newObj?.motorista : "");
			setValue("placa", newObj?.placa ? newObj?.placa : "");
			setValue(
				"codTicketPro",
				newObj?.cod_ticket ? newObj?.cod_ticket : ""
			);
			setValue("filialPro", newObj?.filial ? newObj?.filial : "");
		}
	}, [qrValues]);

	const refreshHandler = () => {
		setParcelasSelectedObject([]);
		setObsCheckIcon("");
		setSelectedFarm(null);
		reset();
		clearErrors();
		console.log("refresh ");
	};

	useEffect(() => {
		setValue("fazendaDestino", "Selecione o Destino");
		setSelectedDest("Selecione o Destino")
		if (selectedFarm) {
			console.log('alterou a fazenda')
			setParcelasSelectedObject([]);
		}
	}, [selectedFarm]);

	const handleModal = () => {
		console.log("open");
		sheetRef.current?.open();
	};

	const handleCloseModal = () => {
		console.log("open");
		sheetRef.current?.close();
	};

	const sheetRef = useRef();

	// QR CODE
	const handleModalQr = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		console.log("open");
		sheetRefQr.current?.open();
	};

	const handleCloseModalQr = () => {
		console.log("open");
		sheetRefQr.current?.close();
	};
	const sheetRefQr = useRef();

	useEffect(() => {
		handleModalQr();
	}, []);

	// const handleOpenCamera = ()=>{
	// 	navigation.navigate('ScanScreen')
	// }

	const handleOpenCamera = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		console.log('Close Camera')
		setOpenCamera(!openCamera);
	};

	// No FormScreen
	useEffect(() => {
		if (!openCamera && qrValues && Object.keys(qrValues).length > 0) {
			setTimeout(() => {
				sheetRef.current?.open();
			}, 200); // espera o BottomSheet montar
		}
	}, [openCamera, qrValues]);

	if (isLoading) {
		return <LoadingOverlay message={"Salvando..."} />;
	}

	if (openCamera) {
		return (
			<QrCamera
				closeCamera={handleOpenCamera}
				setQrValues={setQrValues}
			/>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.mainContainer}>
				<ScrollView
					style={styles.formContainer}
					contentContainerStyle={styles.formContainerContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.headerFormTitle}>
						<Text style={styles.headerFormTitleText}>
							Nova Carga
						</Text>
					</View>

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
						handleModal={handleModal}
						setFilteredFarms={setFilteredFarms}
						filteredFarms={filteredFarms}
						setParcelasSelectedObject={setParcelasSelectedObject}
						parcelasSelectedObject={parcelasSelectedObject}
						obsCheckIcon={obsCheckIcon}
						setObsCheckIcon={setObsCheckIcon}
						navigation={navigation}
						route={route}
						openCamera={openCamera}
					/>
				</ScrollView>
				<View style={styles.buttonContainer}>
					<Button
						disabled={
							Object.keys(errors).length > 0 ||
							selectedDest === "Selecione o Destino" ||
							checkIfCaixasSeted === true ||
							parcelasSelectedObject.length === 0
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
							btnStyles={[
								styles.btnbtnStylesClean,
								{ backgroundColor: Colors.gold[600] }
							]}
							textStyles={[
								styles.textBtnCancelStyle,
								{ color: "whitesmoke" }
							]}
						>
							Limpar
						</Button>
					</View>
				</View>
			</View>
			<BottomSheet ref={sheetRef} style={styles.bottomSheetStl}>
				<SafeAreaView>
					<ScrollView
						showsVerticalScrollIndicator={false}
						style={{
							marginBottom: 50
						}}
					>
						{filteredFarms.map((farm, i) => {
							return (
								<BottomSheetSelect
									key={i}
									setSelectedFarm={setSelectedFarm}
									navigation={navigation}
									onClose={handleCloseModal}
									name={farm.label.replace("Projeto", "")}
									label={farm.label}
								/>
							);
						})}
					</ScrollView>
				</SafeAreaView>
			</BottomSheet>
			<BottomSheet
				ref={sheetRefQr}
				style={styles.bottomSheetStlQr}
				height={250}
			>
				<QrBottomSheet
					onClose={handleCloseModalQr}
					goToCamera={handleOpenCamera}
				/>
			</BottomSheet>
		</SafeAreaView>
	);
};

export default FormScreen;

const styles = StyleSheet.create({
	headerFormTitle: {
		padding: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	headerFormTitleText: {
		color: "rgba(255,255,255,0.6)",
		fontSize: 20,
		fontWeight: "bold"
	},
	bottomSheetStlQr: {
		backgroundColor: Colors.primary[901],
		paddingHorizontal: 20,
		alignItems: "center"
	},
	bottomSheetStl: {
		backgroundColor: Colors.primary[901],
		paddingHorizontal: 20
	},
	cancelContainer: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	formContainer: {
		flex: 1,
		width: "90%",
		marginBottom: 20
	},
	btnbtnStylesRegister: {
		backgroundColor: Colors.success[400],
		height: 40
	},
	btnbtnStylesCancel: {
		backgroundColor: "grey",
		width: "48%",
		height: 40
	},
	btnbtnStylesClean: {
		backgroundColor: Colors.yellow[300],
		width: "48%",
		opacity: 0.9,
		height: 40
	},
	textBtnCancelStyle: {
		color: "grey"
	},
	buttonContainer: {
		width: "90%",
		gap: 10,
		marginBottom: 30
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
		backgroundColor: Colors.primary500,
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
	}
});
