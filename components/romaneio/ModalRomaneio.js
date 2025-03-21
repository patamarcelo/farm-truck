import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
	romaneiosFarmSelector,
	romaneioSelector
} from "../../store/redux/selector";
import { useLayoutEffect, useState, useEffect } from "react";

import { Colors } from "../../constants/styles";

import { Dimensions } from "react-native";

import { ICON_URL, findImg } from "../../utils/imageUrl";
import { formatDateFirebase, formatDate } from "../../utils/formatDate";

import { useIsFocused } from "@react-navigation/native";

const width = Dimensions.get("window").width; //full width

const ModalRomaneioScreen = ({ navigation }) => {
	const route = useRoute();
	const id = route.params.data;
	const filtId = route.params.filtId;

	console.log(id);

	const { name } = navigation.getState()?.routes[1];
	const isFocused = useIsFocused();

	let data = [];
	if (filtId.length > 5) {
		data = useSelector(romaneiosFarmSelector);
	} else {
		data = useSelector(romaneioSelector);
	}

	const [dataShow, setDataShow] = useState("");
	const [NumberRomaneio, setNumberRomaneio] = useState();
	const [prodType, setProdType] = useState(null);

	useLayoutEffect(() => {
		const compData = data.filter((dataFind) => dataFind.idApp === id)[0];
		setDataShow(compData);
		const getProduct = compData?.parcelasObjFiltered?.map((data) => ({cultura: data?.cultura, mercadoria: data?.variedade }))[0]
		setProdType(getProduct)
		// console.log("compData: ", compData.appDate);
	}, [isFocused]);

	const labelParcelas = (data) => {
		return data?.parcelasObjFiltered.map((data) => data.parcela)?.length > 1 ? "Parcelas:" : "Parcela:";
	};

	const statusColor = (status) => {
		if (status) {
			return "green";
		}
		return "red";
	};

	useEffect(() => {
		const newNumber = dataShow?.relatorioColheita
			? dataShow?.relatorioColheita
			: dataShow?.idApp;
		setNumberRomaneio(newNumber);
	}, [dataShow]);

	return (
		<>
			{dataShow ? (
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.mainContainer}>
						<View style={styles.headerContainer}>
							<Text style={styles.headerTitle}>
								DETALHES DO ROMANEIO
							</Text>
						</View>
						{/* <ScrollView
					gap={20}
					> */}
						<View
							style={[
								styles.dataContainerNumber,
								{
									backgroundColor: statusColor(dataShow.id),
									opacity: 1
								}
							]}
						>
							<Text style={[styles.titleDocNumber, { color: "white" }]}>
							Nº {NumberRomaneio}
							</Text>
						</View>
						<View style={styles.dataContainer}>
							<Text style={styles.titleDoc}>Data: </Text>
							<Text style={styles.resultDoc}>
								{dataShow.id
									? formatDateFirebase(dataShow)
									: new Date(dataShow.appDate)
											.toLocaleString("pt-BR")
											.replace(",", " -")}
							</Text>
						</View>
						<View style={styles.dataContainer}>
							<Text style={styles.titleDoc}>Placa:</Text>
							<Text style={styles.resultDoc}>
								{dataShow.placa.slice(0, 3)}-
								{dataShow.placa.slice(3, 12)}
							</Text>
						</View>
						<View style={styles.dataContainer}>
							<Text style={styles.titleDoc}>Motorista: </Text>
							<Text style={styles.resultDoc}>
								{dataShow.motorista.length > 20 ? dataShow.motorista.substring(0,20) + "..." : dataShow.motorista}
							</Text>
						</View>

						<View style={styles.dataContainer}>
							<Text style={styles.titleDoc}>Projeto:</Text>
							<Text style={styles.resultDoc}>
								{dataShow.fazendaOrigem
									.replace("Projeto", "")
									.trim()}
							</Text>
						</View>
						<View style={styles.dataContainer}>
							<Text style={styles.titleDoc}>Cultura: </Text>
							<View
								style={{
									alignItems: "center",
									flexDirection: "row"
								}}
							>
								<Text>{prodType?.cultura}</Text>
								<View style={styles.shadowContainer}>
								<Image
									source={findImg(ICON_URL, prodType?.cultura)}
									style={{
										width: 25,
										height: 25,
										marginLeft: 10
									}}
								/>
								</View>
							</View>
						</View>
						<View style={styles.dataContainer}>
							<Text style={styles.titleDoc}>Variedade:</Text>
							<Text style={styles.resultDoc}>
								{prodType?.mercadoria?.trim()}
							</Text>
						</View>

						<View style={styles.dataContainer}>
							<Text style={styles.titleDoc}>
								{labelParcelas(dataShow)}
							</Text>
							<Text style={styles.resultDoc}>
								{dataShow?.parcelasObjFiltered.map((data) => data.parcela)?.join("-").trim()}
							</Text>
						</View>
						<View style={styles.dataContainer}>
							<Text style={styles.titleDoc}>
								Ticket:
							</Text>
							<Text style={styles.resultDoc}>
								{dataShow?.ticket ? dataShow?.ticket : Number(dataShow?.codTicketPro.replace(/^0+/, '')) }
							</Text>
						</View>

						{dataShow.id && (
							<>
								<View style={styles.dataContainer}>
									<Text style={styles.titleDoc}>
										Peso Bruto:
									</Text>
									<Text style={styles.resultDoc}>
										{dataShow.pesoBruto &&
											parseInt(
												dataShow.pesoBruto
											).toLocaleString("pt-br", {
												minimumFractionDigits: 0,
												maximumFractionDigits: 0
											})}
									</Text>
								</View>
								<View style={styles.dataContainer}>
									<Text style={styles.titleDoc}>
										Peso Tara:
									</Text>
									<Text style={styles.resultDoc}>
										{dataShow.tara &&
											parseInt(
												dataShow.tara
											).toLocaleString("pt-br", {
												minimumFractionDigits: 0,
												maximumFractionDigits: 0
											})}
									</Text>
								</View>

								<View style={styles.dataContainer}>
									<Text style={styles.titleDoc}>
										Peso Líquido:
									</Text>
									<Text style={styles.resultDoc}>
										{dataShow.liquido &&
											parseInt(
												dataShow.liquido
											).toLocaleString("pt-br", {
												minimumFractionDigits: 0,
												maximumFractionDigits: 0
											})}
									</Text>
								</View>
								<View style={styles.dataContainer}>
									<Text style={styles.titleDoc}>
										Obs.:
									</Text>
									<Text style={styles.resultDocObs}>
										{dataShow?.observacoes}
									</Text>
								</View>
							</>
						)}
						{/* </ScrollView> */}
						<View
							style={{
								width: "100%",
								alignItems: "center"
								// marginTop: 40
							}}
						>
							<Text style={styles.headerRomaneio}>
								{dataShow.id ? dataShow.id : dataShow.idApp}
							</Text>
						</View>
						<View style={styles.imgContainer}>
						<View style={styles.shadowContainer}>
							<Image
								source={require("../../assets/diamond.png")}
								style={styles.image}
							/>
							</View>
						</View>
					</View>
				</ScrollView>
			) : (
				<></>
			)}
		</>
	);
};

export default ModalRomaneioScreen;

const styles = StyleSheet.create({
	shadowContainer: {
        shadowColor: "#000",  // Shadow color
        shadowOffset: { width: 3, height: 5 },  // Offset for drop shadow effect
        shadowOpacity: 0.4,  // Opacity of shadow
        shadowRadius: 4,  // Spread of shadow
        elevation: 6,  // Required for Android
    },
	image: {
		width: 40,
		height: 40,
		 resizeMode: 'contain'
	},
	headerRomaneio: {
		fontStyle: "italic",
		color: "grey",
		fontWeight: "bold"
	},
	headerContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 5
	},
	grid: {
		width: width / 2,
		flex: 1
	},
	headerTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "white",
		marginBottom: 10
	},
	resultDoc: {
		textAlign: "left",
		// backgroundColor: "red",
		width: width / 2
		// paddingLeft: 5
	},
	resultDocObs: {
		textAlign: "left",
		// backgroundColor: "red",
		width: width / 2,
		paddingRight: 20
	},
	titleDoc: {
		textAlign: "right",
		fontWeight: "bold",
		width: width / 2,
		paddingRight: 10
		// backgroundColor: "green"
	},
	titleDocNumber: {
		textAlign: "center",
		fontWeight: "bold",
		width: width,
		// backgroundColor: "green"
	},
	dataContainerNumber: {
		flexDirection: "row",
		alignItems: "center",
		// gap: 12,
		backgroundColor: "whitesmoke",
		width: width,
		paddingVertical: 10,
		paddingHorizontal: 8
	},
	dataContainer: {
		flexDirection: "row",
		alignItems: "center",
		// gap: 12,
		backgroundColor: "whitesmoke",
		width: width,
		paddingVertical: 9,
		paddingHorizontal: 8
	},
	mainContainer: {
		flex: 1,
		top: Platform.OS === "ios" && 20,
		gap: 10,
		paddingBottom: 20,
		// justifyContent: "center",
		alignItems: "center"
	},
	text: {
		color: "white"
	}
});
