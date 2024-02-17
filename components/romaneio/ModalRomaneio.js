import { View, Text, StyleSheet, Image } from "react-native";
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

	const { name } = navigation.getState()?.routes[0];
	const isFocused = useIsFocused();

	let data = [];
	if (name === "Romaneios") {
		data = useSelector(romaneiosFarmSelector);
	}
	if (name === "Welcome") {
		data = useSelector(romaneioSelector);
	}

	const [dataShow, setDataShow] = useState("");
	const [NumberRomaneio, setNumberRomaneio] = useState();

	useLayoutEffect(() => {
		const compData = data.filter((dataFind) => dataFind.idApp === id)[0];
		setDataShow(compData);
		console.log("compData: ", compData.appDate);
	}, [isFocused]);

	const labelParcelas = (data) => {
		return data.parcelasNovas?.length > 1 ? "Parcelas:" : "Parcela:";
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
				<View style={styles.mainContainer}>
					<View style={styles.headerContainer}>
						<Text style={styles.headerTitle}>
							DETALHE DO ROMANEIO
						</Text>
						<Text style={styles.headerRomaneio}>
							Nº {NumberRomaneio}
						</Text>
					</View>
					<View
						style={[
							styles.dataContainer,
							{
								backgroundColor: statusColor(dataShow.id),
								opacity: 1
							}
						]}
					>
						<Text style={[styles.titleDoc, { color: "white" }]}>
							Status:{" "}
						</Text>
						<Text style={[styles.resultDoc, { color: "white" }]}>
							{dataShow.id ? "Sincronizado" : "Pendente"}
						</Text>
					</View>
					<View style={styles.dataContainer}>
						<Text style={styles.titleDoc}>Data: </Text>
						<Text style={styles.resultDoc}>
							{dataShow.id
								? formatDateFirebase(dataShow)
								: dataShow.appDate
										.toLocaleString()
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
							{dataShow.motorista}
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
							<Text>{dataShow.cultura}</Text>
							<Image
								source={findImg(ICON_URL, dataShow.cultura)}
								style={{
									width: 25,
									height: 25,
									marginLeft: 10
								}}
							/>
						</View>
					</View>
					<View style={styles.dataContainer}>
						<Text style={styles.titleDoc}>Variedade:</Text>
						<Text style={styles.resultDoc}>
							{dataShow.mercadoria.trim()}
						</Text>
					</View>

					<View style={styles.dataContainer}>
						<Text style={styles.titleDoc}>
							{labelParcelas(dataShow)}
						</Text>
						<Text style={styles.resultDoc}>
							{dataShow.parcelasNovas?.join("-").trim()}
						</Text>
					</View>
					{dataShow.id && (
						<>
							<View style={styles.dataContainer}>
								<Text style={styles.titleDoc}>Peso Bruto:</Text>
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
								<Text style={styles.titleDoc}>Peso Tara:</Text>
								<Text style={styles.resultDoc}>
									{dataShow.tara &&
										parseInt(dataShow.tara).toLocaleString(
											"pt-br",
											{
												minimumFractionDigits: 0,
												maximumFractionDigits: 0
											}
										)}
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
						</>
					)}
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
						<Image
							source={require("../../assets/diamond.png")}
							style={styles.image}
						/>
					</View>
				</View>
			) : (
				<></>
			)}
		</>
	);
};

export default ModalRomaneioScreen;

const styles = StyleSheet.create({
	image: {
		width: 40,
		height: 40
	},
	headerRomaneio: {
		fontStyle: "italic",
		color: "grey",
		fontWeight: "bold"
	},
	headerContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10
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
	titleDoc: {
		textAlign: "right",
		fontWeight: "bold",
		width: width / 2,
		paddingRight: 10
		// backgroundColor: "green"
	},
	dataContainer: {
		flexDirection: "row",
		alignItems: "center",
		// gap: 12,
		backgroundColor: "whitesmoke",
		width: width,
		paddingVertical: 10,
		paddingHorizontal: 8
	},

	mainContainer: {
		flex: 1,
		top: 20,
		gap: 15,
		// justifyContent: "center",
		alignItems: "center"
	},
	text: {
		color: "white"
	}
});
