import { FlatList, StyleSheet, Text, View, SafeAreaView } from "react-native";

import CardRomaneio from "../components/romaneio/CardTruck";
import { Colors } from "../constants/styles";
import { useSelector, useDispatch } from "react-redux";
import { romaneioSelector } from "../store/redux/selector";

import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const width = Dimensions.get("window").width; //full width

function WelcomeScreen() {
	const data = useSelector(romaneioSelector);
	console.log(data);
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();

	const renderRomaneioList = (itemData) => {
		return <CardRomaneio data={itemData.item} />;
	};

	return (
		<View style={styles.rootContainer}>
			<View style={styles.resumoContainer}>
				<Text style={styles.resumoTitle}>RESUMO CONTAINER</Text>
			</View>
			<SafeAreaView style={styles.roundList}>
				<View style={styles.listContainer}>
					<FlatList
						data={data}
						keyExtractor={(item) => item.id}
						renderItem={renderRomaneioList}
						ItemSeparatorComponent={() => (
							<View style={{ height: 13 }} />
						)}
					/>
				</View>
			</SafeAreaView>
		</View>
	);
}

export default WelcomeScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	resumoContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "whitesmoke",
		width: width - 20,
		margin: 10,
		borderRadius: 12,

		elevation: 4,

		shadowColor: "black",
		shadowOpacity: 0.5,
		shadowOffset: { width: 2, height: 2 },
		shadowRadius: 4
	},
	resumoTitle: {
		// color: "whitesmoke",
		fontWeight: "bold",
		fontSize: 18
	},
	roundList: {
		flex: 2,
		backgroundColor: Colors.primary500
	},
	listContainer: {
		overflow: "hidden",
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		backgroundColor: "#03396B"
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8
	}
});
