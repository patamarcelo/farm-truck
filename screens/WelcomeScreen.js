import { FlatList, StyleSheet, Text, View } from "react-native";

import CardRomaneio from "../components/romaneio/CardTruck";
import { ScrollView } from "react-native-gesture-handler";
import data from "../utils/dummy-data";
import { Colors } from "../constants/styles";
import { Divider } from "react-native-elements";

function WelcomeScreen() {
	const renderRomaneioList = (itemData) => {
		return <CardRomaneio data={itemData.item} />;
	};

	return (
		<View style={styles.rootContainer}>
			<View style={styles.resumoContainer}>
				<Text>RESUMO CONTAINER</Text>
			</View>
			<View style={styles.listContainer}>
				<FlatList
					data={data}
					keyExtractor={(item) => item.id}
					renderItem={renderRomaneioList}
				/>
				{/* <Text style={styles.title}>Welcome!</Text>
			<Text>You authenticated successfully!</Text> */}
			</View>
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
	resumoContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	listContainer: {
		flex: 3
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8
	}
});
