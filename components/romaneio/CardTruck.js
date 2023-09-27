import { Pressable, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

import { Dimensions } from "react-native";
import { Divider } from "react-native-elements";

const width = Dimensions.get("window").width; //full width

const CardRomaneio = (props) => {
	const { data } = props;
	console.log(data);

	return (
		<>
			<Pressable
				style={({ pressed }) => [
					styles.rootContainer,
					pressed && styles.pressed
				]}
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
		marginVertical: 4,
		paddingHorizontal: 15,
		backgroundColor: Colors.background,

		// borderWidth: 1,
		borderColor: "black",

		shadowColor: "grey",
		shadowOpacity: 0.75,
		shadowOffset: { width: 3, height: 3 },
		shadowRadius: 2,
		borderRadius: 4
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
