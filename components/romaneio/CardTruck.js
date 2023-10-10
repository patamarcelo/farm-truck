import { Pressable, View, Text, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

import { Dimensions } from "react-native";
import { Divider } from "react-native-elements";

import { useNavigation } from "@react-navigation/native";

import { ICON_URL } from "../../utils/imageUrl";

const width = Dimensions.get("window").width; //full width

const CardRomaneio = (props) => {
	const { data, styleContainer } = props;
	const navigation = useNavigation();
	// console.log(data);
	const handleDataTruck = () => {
		navigation.navigate("ModalRomaneio", { data: data });
	};

	const labelParcelas = (data) => {
		return data.parcelasNovas.length > 1 ? "Parcelas" : "Parcela";
	};

	const findImg = (data, icon) => {
		const newData = data.filter((data) => data.title === icon);
		return newData[0].uri;
	};

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
					<View>
						<MaterialCommunityIcons
							name="dump-truck"
							size={42}
							color={Colors.yellow[600]}
						/>
						<Text style={styles.textNumber}>
							Nº {data.relatorioColheita}
						</Text>
					</View>
					<View>
						<Text style={styles.textData}>12/02/2023</Text>
					</View>
				</View>
				<View style={styles.mainContainerData}>
					<View style={styles.dataContainer}>
						<View style={styles.dataIntraContainer}>
							<View style={styles.containerDataInfo}>
								<Text style={styles.titleInput}>
									Motorista:{" "}
								</Text>
								<Text style={styles.labelInput}>
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
									{labelParcelas(data)} :{" "}
								</Text>
								<Text>{data.parcelasNovas.join(" - ")}</Text>
							</View>
							<View style={styles.containerDataInfo}>
								<Text style={{ fontWeight: "bold" }}>
									{data.projeto}
								</Text>
							</View>
						</View>
						<View style={styles.conatiner2}>
							<View style={styles.containerDataInfo2}>
								<Image
									source={findImg(ICON_URL, data.cultura)}
								/>
								<View>
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
		color: "grey"
	},
	conatiner2: {
		alignSelf: "flex-end"
	},
	containerDataInfo2: {
		flexDirection: "column",
		alignItems: "center",
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
		height: "100%"
	},
	mainContainerData: {
		flex: 3,
		justifyContent: "space-around",
		alignItems: "center"
	},
	truckContainer: {
		flex: 1,
		height: "100%",
		justifyContent: "space-around"
	},
	dataContainer: {
		flex: 3,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%"
	},
	rootContainer: {
		// paddingVertical: 5,
		flexDirection: "row",
		width: width,
		height: 105,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
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
