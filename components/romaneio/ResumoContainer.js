import { View, Text, StyleSheet } from "react-native";

const ResumoContainer = () => {
	return (
		<View>
			<Text style={styles.resumoTitle}>RESUMO CONTAINER</Text>
		</View>
	);
};

export default ResumoContainer;

const styles = StyleSheet.create({
	resumoTitle: {
		// color: "whitesmoke",
		fontWeight: "bold",
		fontSize: 14
	}
});
