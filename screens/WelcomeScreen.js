import { FlatList, StyleSheet, Text, View, SafeAreaView } from "react-native";

import CardRomaneio from "../components/romaneio/CardTruck";
import { Colors } from "../constants/styles";
import { useSelector, useDispatch } from "react-redux";
import { romaneioSelector } from "../store/redux/selector";

import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import ResumoContainer from "../components/romaneio/ResumoContainer";

import { useEffect, useState } from "react";
import {
	getAllDocsFirebase,
	getAndGenerateIdFirebase,
	saveDataOnFirebaseAndUpdate
} from "../store/firebase/index";
import { addRomaneio, removeFromCargas } from "../store/redux/romaneios";
import { useLayoutEffect } from "react";

import { ActivityIndicator, RefreshControl } from "react-native";

import {
	ALERT_TYPE,
	Dialog,
	AlertNotificationRoot,
	Toast
} from "react-native-alert-notification";

import NetInfo from "@react-native-community/netinfo";

const width = Dimensions.get("window").width; //full width

const Title = ({ text }) => {
	return (
		<View style={{ paddingTop: 40 }}>
			<Text style={{ color: "whitesmoke", fontWeight: "bold" }}>
				{text}
			</Text>
		</View>
	);
};

const TrySom = ({ email }) => {
	return (
		<View style={{ width: "100%" }}>
			<Text
				style={{
					color: "whitesmoke",
					textAlign: "center",
					fontSize: 12,
					marginTop: 20
				}}
			>
				<Text style={{ fontWeight: "bold" }}>
					Romaneio Sincronizado com sucesso!
				</Text>
			</Text>
			<Text
				style={{
					color: "whitesmoke",
					textAlign: "center",
					marginBottom: 20,
					fontSize: 12,
					marginTop: 20
				}}
			>
				{/* Comprovante enviado por email para:{" "} */}
				<Text style={{ fontWeight: "bold" }}>{email}</Text>
			</Text>
			<Text
				style={{
					color: Colors.gold[200],
					textAlign: "center",
					fontSize: 8
				}}
			>
				{/* Caso o cliente não receba o comprovante, falar com
				financeiro@pitayajoias.com.br */}
			</Text>
		</View>
	);
};

function WelcomeScreen() {
	const data = useSelector(romaneioSelector);
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();
	const dispatch = useDispatch();
	const [refreshing, setRefreshing] = useState(false);
	const [lastDoc, setLastDoc] = useState(null);

	const getDocs = async () => {
		const dataFirebase = await getAndGenerateIdFirebase();
		const lastNumber = dataFirebase.relatorioColheita;
		return lastNumber ? lastNumber : 1;
	};

	useEffect(() => {
		const getDocs = async () => {
			const dataFirebase = await getAndGenerateIdFirebase();
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

	const handleRefresh = async () => {
		const dataToAdd = data[data.length - 1];
		const idToFind = dataToAdd.idApp;
		setRefreshing(true);
		try {
			const isConnected = NetInfo.fetch().then((state) => {
				console.log("está conectado :", state.isConnected);
				return state.isConnected;
			});
			console.log("isConected ;", isConnected);
			if (isConnected) {
				const dataToSave = {
					...dataToAdd,
					appDate: new Date(dataToAdd.appDate),
					createdAt: new Date(dataToAdd.createdAt),
					entrada: new Date(dataToAdd.entrada)
				};
				const response = await saveDataOnFirebaseAndUpdate(dataToSave);
				console.log("Response: ", response);
				if (response) {
					dispatch(removeFromCargas(idToFind));
					const last = await getDocs();
					// console.log("last", last);
					Dialog.show({
						type: ALERT_TYPE.SUCCESS,
						title: <Title text={"Feito!!"} />,
						textBody: <TrySom />,
						button: "Finalizar"
						// onPressButton: () => {
						// 	navigation.navigate("PagamentosTab");
						// }
					});
				}
			} else {
				setRefreshing(false);
			}
		} catch (err) {
			console.log("erro ao pegar os romaneios", err);
		} finally {
			setRefreshing(false);
		}
	};

	return (
		<AlertNotificationRoot>
			<View style={styles.rootContainer}>
				<View style={styles.resumoContainer}>
					<ResumoContainer />
				</View>
				<SafeAreaView style={styles.roundList}>
					<View style={styles.listContainer}>
						{/* {refreshing ? <ActivityIndicator /> : null} */}
						{data && data.length > 0 && (
							<FlatList
								data={data}
								keyExtractor={(item) => item.idApp}
								renderItem={renderRomaneioList}
								ItemSeparatorComponent={() => (
									<View style={{ height: 13 }} />
								)}
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={handleRefresh}
										colors={["#9Bd35A", "#689F38"]}
										tintColor={"whitesmoke"}
									/>
								}
							/>
						)}

						{data && data.length === 0 && (
							<View style={styles.adviseContainer}>
								<Text style={styles.adviseContainerTitle}>
									Sem Romaneio Pendente!
								</Text>
							</View>
						)}
					</View>
				</SafeAreaView>
			</View>
		</AlertNotificationRoot>
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
		flex: 3,
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
