import { FlatList, StyleSheet, Text, View } from "react-native";

import CardRomaneio from "../components/romaneio/CardTruck";
import { ScrollView } from "react-native-gesture-handler";
import data from "../utils/dummy-data";
import { Colors } from "../constants/styles";

function WelcomeScreen() {
	const renderRomaneioList = (itemData) => {
		return <CardRomaneio data={itemData.item} />;
	};

	return (
		<View style={styles.rootContainer}>
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={renderRomaneioList}
			/>
			{/* <Text style={styles.title}>Welcome!</Text>
			<Text>You authenticated successfully!</Text> */}
		</View>
	);
}

export default WelcomeScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 32,
		backgroundColor: "whitesmoke"
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8
	}
});
