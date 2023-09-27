import { Pressable, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

import { Dimensions } from "react-native";
const width = Dimensions.get("window").width; //full width

const CardRomaneio = (props) => {
	const { data } = props;
	console.log(data);

	return (
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
			</View>
			<View style={styles.dataContainer}>
				<Text>DATA TRUCK</Text>
				<Text>DATA TRUCK</Text>
				<Text>DATA TRUCK</Text>
				<Text>DATA TRUCK</Text>
			</View>
		</Pressable>
	);
};

export default CardRomaneio;

const styles = StyleSheet.create({
	truckContainer: {
		flex: 1
	},
	dataContainer: {
		flex: 3,
		flexDirection: "row"
	},
	rootContainer: {
		flexDirection: "row",
		width: width - 15,
		height: 70,
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 8,
		paddingHorizontal: 8,
		backgroundColor: Colors.background,

		borderWidth: 1,
		borderColor: "black",

		shadowColor: "grey",
		shadowOpacity: 0.75,
		shadowOffset: { width: 3, height: 3 },
		shadowRadius: 4,
		borderRadius: 8
	},
	pressed: {
		opacity: 0.5
	}
});
