import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

function UserScreen({ navigation }) {
	const isFocused = useIsFocused();

	useEffect(() => {
		navigation.navigate("addForm");
	}, [isFocused]);

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
