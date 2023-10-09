import { Pressable, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

import { Dimensions } from "react-native";
import { Divider } from "react-native-elements";

import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get("window").width; //full width

const CardRomaneio = (props) => {
	const { data, styleContainer } = props;
	const navigation = useNavigation();
	// console.log(data);

	const handleDataTruck = () => {
		navigation.navigate("ModalRomaneio", { data: data });
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
					<MaterialCommunityIcons
						name="dump-truck"
						size={42}
						color={Colors.yellow[600]}
					/>
					<Text style={styles.textNumber}>
						Nº {data.relatorioColheita}
					</Text>
				</View>
				<View style={styles.mainContainerData}>
					<View>
						<Text>{data.projeto}</Text>
					</View>
					<View style={styles.dataContainer}>
						<View style={styles.dataIntraContainer}>
							<Text>{data.motorista}</Text>
							<Text>
								{data.placa.slice(0, 3)}-
								{data.placa.slice(3, 12)}
							</Text>
						</View>
						<View style={styles.dataIntraContainer}>
							<Text>{data.parcelasNovas.join(" - ")}</Text>
							<Text>{data.mercadoria}</Text>
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
	dataIntraContainer: {
		gap: 10
	},
	mainContainerData: {
		flex: 2,
		justifyContent: "space-around",
		alignItems: "center"
	},
	truckContainer: {
		flex: 1
	},
	dataContainer: {
		flex: 3,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%"
	},
	rootContainer: {
		paddingVertical: 5,
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
