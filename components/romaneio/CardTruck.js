import { Pressable, View, Text, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";
import { useEffect, useState } from "react";

import { Dimensions } from "react-native";
import { Divider } from "react-native-elements";

import { useNavigation } from "@react-navigation/native";

import { ICON_URL, findImg } from "../../utils/imageUrl";
import { formatDate, formatDateFirebase } from "../../utils/formatDate";
import { useRoute } from "@react-navigation/native";

import moment from "moment";

const width = Dimensions.get("window").width; //full width

const dictRoute = {
	Romaneios: "modalRomaneios",
	Welcome: "ModalRomaneio"
};

const CardRomaneio = (props) => {
	const { data, styleContainer } = props;
	const [dataArr, setDataArr] = useState([]);

	useEffect(() => {
		if (data.length > 0) {
			const format = data.map((data) => {
				let createdAtForm;
				if (typeof data.createdAt === "object") {
					createdAtForm = new Date();
				} else {
					createdAtForm = new Date(data.createdAt);
				}
				const sortDate =
					typeof data.appDate === "object"
						? new Date(
								data.appDate.seconds * 1000 +
									data.appDate.nanoseconds / 1000000
						  )
						: new Date(data.appDate);
				return { ...data, sortDate, createdAtForm };
			});
			setDataArr(format);
		}
	}, []);
	const navigation = useNavigation();
	const route = useRoute();

	const handleDataTruck = () => {
		const name = route.name;
		const routeName = "ModalRomaneio";
		navigation.navigate(`${routeName}`, {
			data: data.idApp,
			filtId: data.id
		});
	};

	const labelParcelas = (data) => {
		return data.parcelasNovas?.length > 1 ? "Parcelas" : "Parcela";
	};

	const timeS =
		dataArr?.createdAtForm &&
		dataArr?.createdAtForm.toLocaleString("pt-BR").split(",")[0];
	const seconds =
		dataArr?.createdAtForm &&
		dataArr?.createdAtForm
			.toLocaleString("pt-BR")
			.split(",")[1]
			.trim()
			.slice(0, 5);

	return (
		<>
			<Pressable
				style={({ pressed }) => [
					styles.rootContainer,
					styleContainer,
					pressed && styles.pressed
				]}
				onPress={handleDataTruck}
			>
				<View style={styles.truckContainer}>
					<View
						style={{
							justifyContent: "center",
							alignItems: "flex-start",
							paddingLeft: 20
						}}
					>
						<MaterialCommunityIcons
							name="dump-truck"
							size={42}
							color={
								data.id
									? Colors.success[500]
									: Colors.yellow[700]
							}
						/>
						<Text style={styles.textNumber}>
							Nº{" "}
							{data?.relatorioColheita
								? data?.relatorioColheita
								: "-"}
						</Text>
					</View>
					<View
						style={{
							justifyContent: "center",
							alignItems: "flex-start",
							paddingLeft: 30
						}}
					>
						{typeof data?.appDate === "object" &&
						data?.id.length > 0 ? (
							<Text style={styles.textData}>
								{moment(
									new Date(
										data.appDate.seconds * 1000 +
											data.appDate.nanoseconds / 1000000
									)
								).format("DD/MM/YYYY - HH:mm")}
							</Text>
						) : (
							<Text style={styles.textData}>
								{formatDate(data.appDate)}
							</Text>
						)}
					</View>
				</View>
				<View style={styles.mainContainerData}>
					<View style={styles.dataContainer}>
						<View style={styles.dataIntraContainer}>
							<View style={styles.containerDataInfo}>
								<Text
									style={styles.titleInput}
									// numberOfLines={1}
								>
									Motorista:{" "}
								</Text>
								<Text
									style={styles.labelInput}
									numberOfLines={1}
								>
									{data.motorista}
								</Text>
							</View>
							<View style={styles.containerDataInfo}>
								<Text style={styles.titleInput}>Placa: </Text>

								<Text style={styles.labelInput}>
									{data.placa.slice(0, 3)}-
									{data.placa.slice(3, 12)}
								</Text>
							</View>
							<View style={styles.containerDataInfo}>
								<Text style={styles.titleInput}>
									{labelParcelas(data)}:{" "}
								</Text>
								<Text>{data.parcelasNovas?.join(" - ")}</Text>
							</View>
							<View style={styles.containerDataInfo}>
								<Text
									style={{ fontWeight: "bold" }}
									numberOfLines={1}
								>
									{data.fazendaOrigem.replace("Projeto", "")}
								</Text>
							</View>
						</View>
						<View style={styles.conatiner2}>
							<View style={styles.containerDataInfo2}>
								<Image
									source={findImg(ICON_URL, data.cultura)}
									style={{ width: 25, height: 25 }}
								/>
								<View style={{ alignItems: "flex-end" }}>
									<Text style={styles.titleInput}>
										Variedade:
									</Text>
									<Text>{data.mercadoria}</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</Pressable>
			{/* <Divider style={{ backgroundColor: "blue" }} /> */}
		</>
	);
};

export default CardRomaneio;

const styles = StyleSheet.create({
	textData: {
		fontSize: 10,
		marginLeft: -8,
		color: "grey",
		fontWeight: "bold"
	},
	conatiner2: {
		alignSelf: "flex-end",
		paddingRight: 10
	},
	containerDataInfo2: {
		flexDirection: "column",
		alignItems: "flex-end",
		justifyContent: "space-around",
		flex: 0.8
	},
	containerDataInfo: {
		flexDirection: "row"
	},
	titleInput: {
		fontWeight: "bold",
		padding: 0
	},
	labelInput: {},
	dataIntraContainer: {
		// alignItems: "center",
		justifyContent: "space-around",
		// backgroundColor: "red",
		height: "100%",
		flexWrap: "nowrap",
		width: "50%"
	},
	mainContainerData: {
		flex: 3,
		justifyContent: "space-around",
		alignItems: "center",
		width: width
		// backgroundColor: "red"
	},
	truckContainer: {
		flex: 1,
		marginLeft: -10,
		paddingRight: 20,
		height: "100%",
		justifyContent: "space-around"
	},
	dataContainer: {
		flex: 3,
		// backgroundColor: "red",
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%"
	},
	rootContainer: {
		// paddingVertical: 5,
		flexDirection: "row",
		// width: width,
		width: "100%",
		height: 105,
		justifyContent: "space-between",
		alignItems: "center",
		// paddingHorizontal: 15,
		backgroundColor: "white",

		// borderWidth: 1,

		shadowColor: "black",
		shadowOpacity: 1,
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,

		elevation: 6
		// borderTopLeftRadius: 12,
		// borderTopRightRadius: 12,
	},
	pressed: {
		opacity: 0.5
	},
	textNumber: {
		fontSize: 10,
		marginLeft: 8,
		color: "grey"
	}
});
