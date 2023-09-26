import { StyleSheet, Text, View } from "react-native";

function UserScreen() {
	return (
		<View style={styles.rootContainer}>
			<Text style={styles.title}>UserScreen</Text>
		</View>
	);
}

export default UserScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 32
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8
	}
});
