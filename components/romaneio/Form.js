import { View, Text, StyleSheet } from "react-native";

const FormScreen = () => {
	return (
		<View style={styles.mainContainer}>
			<Text style={styles.text}>FORM</Text>
		</View>
	);
};

export default FormScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	text: {
		color: "white"
	}
});
