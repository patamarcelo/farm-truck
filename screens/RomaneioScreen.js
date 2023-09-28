import { StyleSheet, Text, View, Button } from "react-native";
import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useLayoutEffect, useContext } from "react";

import { AuthContext } from "../store/auth-context";

const RomaneioScreen = () => {
	const context = useContext(AuthContext);
	return (
		<View style={styles.mainContainer}>
			<Text style={styles.text}>Romaneio Screen</Text>
			<Button title="Lougout" onPress={context.logout} />
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
		backgroundColor: Colors.primary500
	}
});
