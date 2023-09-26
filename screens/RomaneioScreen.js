import { StyleSheet, Text, View } from "react-native";
import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useLayoutEffect } from "react";

const RomaneioScreen = () => {
	return (
		<View style={styles.mainContainer}>
			<Text style={styles.text}>Romaneio Screen</Text>
		</View>
	);
};

export default RomaneioScreen;

const styles = StyleSheet.create({
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "whitesmoke"
	},
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		gap: 20,
		backgroundColor: Colors.primary[500]
	}
});
