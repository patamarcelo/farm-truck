import { StyleSheet, View, Text } from "react-native";

const CreditCardComponent = () => {
	return (
		<View style={styles.mainContainer}>
			<Text style={styles.text}>CREDIT CARD COMPONENT</Text>
		</View>
	);
};

export default CreditCardComponent;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	text: { color: "whitesmoke" }
});
