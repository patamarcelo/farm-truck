import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const ModalRomaneioScreen = () => {
	const route = useRoute();
	const data = route.params.data;
	console.log(data);
	return (
		<View style={styles.mainContainer}>
			<Text style={styles.text}>MODAL ROMANEIO</Text>
		</View>
	);
};

export default ModalRomaneioScreen;

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
