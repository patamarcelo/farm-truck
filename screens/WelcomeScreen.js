import { FlatList, StyleSheet, Text, View, SafeAreaView } from "react-native";

import CardRomaneio from "../components/romaneio/CardTruck";
import { Colors } from "../constants/styles";
import { useSelector, useDispatch } from "react-redux";
import { romaneioSelector } from "../store/redux/selector";

import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import ResumoContainer from "../components/romaneio/ResumoContainer";

import { useEffect } from "react";
import {
	getAllDocsFirebase,
	getAndGenerateIdFirebase
} from "../store/firebase/index";
import { addRomaneio } from "../store/redux/romaneios";
import { useLayoutEffect } from "react";

const width = Dimensions.get("window").width; //full width

function WelcomeScreen() {
	const data = useSelector(romaneioSelector);
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();
	const dispatch = useDispatch();

	useEffect(() => {
		const getDocs = async () => {
			const data = await getAndGenerateIdFirebase();
			return data;
		};
		getDocs();
	}, []);

	// useLayoutEffect(() => {
	// 	const getDocs = async () => {
	// 		const response = await getAllDocsFirebase("Projeto Capivara");
	// 		console.log("data", response);
	// 		response.map((dataF) => {
	// 			dispatch(addRomaneio(dataF));
	// 		});
	// 		isFirstTime = true;
	// 	};
	// 	getDocs();
	// }, []);

	const renderRomaneioList = (itemData) => {
		return <CardRomaneio data={itemData.item} />;
	};

	return (
		<View style={styles.rootContainer}>
			<View style={styles.resumoContainer}>
				<ResumoContainer />
			</View>
			<SafeAreaView style={styles.roundList}>
				<View style={styles.listContainer}>
					{data && data.length > 0 && (
						<FlatList
							data={data}
							keyExtractor={(item) => item.id}
							renderItem={renderRomaneioList}
							ItemSeparatorComponent={() => (
								<View style={{ height: 13 }} />
							)}
						/>
					)}

					{data && data.length === 0 && (
						<View style={styles.adviseContainer}>
							<Text style={styles.adviseContainerTitle}>
								Sem Romaneio em Transito!!
							</Text>
						</View>
					)}
				</View>
			</SafeAreaView>
		</View>
	);
}

export default WelcomeScreen;

const styles = StyleSheet.create({
	adviseContainerTitle: {
		color: "whitesmoke",
		fontSize: 24,
		flex: 1,
		textAlign: "center"
	},
	adviseContainer: {
		flex: 1,
		width: width,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
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
	roundList: {
		flex: 2,
		// width: "100%",
		backgroundColor: Colors.primary500
	},
	listContainer: {
		overflow: "hidden",
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		backgroundColor: Colors.primary[600]
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8
	}
});
