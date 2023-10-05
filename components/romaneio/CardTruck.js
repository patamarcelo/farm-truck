import { Pressable, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

import { Dimensions } from "react-native";
import { Divider } from "react-native-elements";

import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get("window").width; //full width

const CardRomaneio = (props) => {
	const { data } = props;
	const navigation = useNavigation();
	console.log(data);

	const handleDataTruck = () => {
		navigation.navigate("ModalRomaneio", { data: data });
	};

	return (
		<>
			<Pressable
				style={({ pressed }) => [
					styles.rootContainer,
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
					<Text style={styles.textNumber}>Nº 12</Text>
				</View>
				<View style={styles.dataContainer}>
					<Text>DATA TRUCK</Text>
					<Text>DATA TRUCK</Text>
				</View>
			</Pressable>
			{/* <Divider style={{ backgroundColor: "blue" }} /> */}
		</>
	);
};

export default CardRomaneio;

const styles = StyleSheet.create({
	truckContainer: {
		flex: 1
	},
	dataContainer: {
		flex: 3,
		flexDirection: "row",
		justifyContent: "space-between"
	},
	rootContainer: {
		flexDirection: "row",
		width: width,
		height: 90,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		backgroundColor: "white",

		// borderWidth: 1,

		shadowColor: "black",
		shadowOpacity: 0.75,
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
