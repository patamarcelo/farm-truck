import {
	FlatList,
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	Alert,
	Appearance,
	Platform,
	StatusBar,
	Pressable
} from "react-native";

import CardRomaneio from "../components/romaneio/CardTruck";
import { Colors } from "../constants/styles";
import { useSelector, useDispatch } from "react-redux";
import {
	romaneioSelector,
	projetosSelector,
	userSelector
} from "../store/redux/selector";

import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import ResumoContainer from "../components/romaneio/ResumoContainer";

import {
	useEffect,
	useState,
	useLayoutEffect,
	useContext,
	Suspense
} from "react";
import { AuthContext } from "../store/auth-context";
import {
	getAllDocsFirebase,
	getAndGenerateIdFirebase,
	saveDataOnFirebaseAndUpdate,
	checkUserActive
} from "../store/firebase/index";
import { addRomaneio, removeFromCargas } from "../store/redux/romaneios";

import { ActivityIndicator, RefreshControl } from "react-native";

import {
	ALERT_TYPE,
	Dialog,
	AlertNotificationRoot,
	Toast
} from "react-native-alert-notification";

import { useNetInfo } from "@react-native-community/netinfo";

import IconButton from "../components/ui/IconButton";

// import Swipeout from "react-native-swipeout";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import nodeServer from "../utils/axios/axios";

import { useAutoSyncColheita } from "../utils/features/useAutoSyncCOlheita";

const width = Dimensions.get("window").width; //full width
const colorScheme = Appearance.getColorScheme();
// const colorText = colorScheme === "dark" ? "whitesmoke" : "black";

const Title = ({ text }) => {
	return (
		<View style={{ paddingTop: 40 }}>
			<Text style={{ fontWeight: "bold", color: "grey" }}>{text}</Text>
		</View>
	);
};

const TrySom = ({ placa, motorista }) => {
	return (
		<View style={{ width: "100%" }}>
			<Text
				style={{
					color: "black",
					textAlign: "center",
					fontSize: 12,
					marginTop: 20
				}}
			>
				<Text style={{ fontWeight: "bold", color: "grey" }}>
					Romaneio Sincronizado com sucesso!
				</Text>
			</Text>
			<View
				style={{
					width: "100%",
					justifyContent: "space-evenly",
					flexDirection: "column",
					alignItems: "center",
					marginTop: 40
				}}
			>
				<Text style={{ fontWeight: "bold", color: "grey" }}>
					{placa}
				</Text>
				<Text style={{ fontWeight: "bold", color: "grey" }}>
					{motorista}
				</Text>
			</View>
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

const handlerUploadProtheus = async (dataToAdd) => {
	try {
		const response = await nodeServer
			.post("upload-romaneio/", {
				id: dataToAdd
			})
			.catch((err) => console.log(err));
		return response;
	} catch (err) {
		console.log("Erro ao consumir a API", err);
	}
};

function WelcomeScreen() {
	useAutoSyncColheita();  // 🔥 isso aqui é o "backdoor"

	const data = useSelector(romaneioSelector);
	const projetosData = useSelector(projetosSelector);
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();
	const dispatch = useDispatch();
	const [refreshing, setRefreshing] = useState(false);
	const [lastDoc, setLastDoc] = useState(null);

	const [preventSroll, setPreventSroll] = useState(true);

	const [isDisabled, setIsDisabled] = useState(false);

	const [isOpendSwipe, setisOpendSwipe] = useState(false);

	const netInfo = useNetInfo();

	const user = useSelector(userSelector);
	console.log("user:::", user.uid);
	console.log(checkUserActive(user.uid));

	const context = useContext(AuthContext);

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

	useEffect(() => {
		navigation.setOptions({
			tabBarStyle: {
				backgroundColor: Colors.primary500,
				borderTopColor: "transparent",
			},
			headerShadowVisible: false,

			// 🔴 Tira qualquer blur de glass/light
			headerTransparent: false,
			headerBlurEffect: undefined,
			headerStyle: {
				backgroundColor: Colors.primary500,
			},

			// 👉 Não queremos título no centro
			// headerTitle: '',

			// 👉 Título (Olá + Romaneios) vai no headerLeft, mas sem botão
			headerTitle: () => (
				<View
					style={{
						flexDirection: "column",
						backgroundColor: Colors.primary500
					}}
				>
					<Text
						style={{
							fontSize: 12,
							color: "rgba(245,245,245,0.7)",
							marginBottom: -2,
						}}
					>
						Olá, {user?.displayName || "Usuário sem Nome"}
					</Text>

					<Text
						style={{
							fontWeight: "700",
							fontSize: 24,
							color: "#FFFFFF",
						}}
					>
						Romaneios
					</Text>
				</View>
			),

			// garante alinhamento realmente à esquerda
			headerLeftContainerStyle: {
				paddingLeft: 16,
			},

			headerRight: () => (
				<IconButton
					icon="menu"
					color={"white"}
					size={24}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
			headerRightContainerStyle: {
				paddingRight: 16,
			},
		});
	}, [user, navigation]);


	const renderRomaneioList = (itemData) => {
		const renderRightActions = () => (
			<Pressable
				disabled={isDisabled}
				onPress={() => handleRefresh(itemData.item.idApp)}
				style={{ width: 80, backgroundColor: isDisabled ? "rgba(237,231,225)" : "rgba(017,201,17, 1)", justifyContent: 'center', alignItems: 'center' }}
			>
				{refreshing ? <ActivityIndicator color="white" /> : <FontAwesome name="send" color={"white"} size={20} />}
			</Pressable>
		);

		const renderLeftActions = () => (
			<Pressable
				onPress={() => {
					dispatch(removeFromCargas(itemData.item.idApp));
					Alert.alert(
						"Romaneio Excluído",
						`${itemData.item.placa} - ${itemData.item.motorista} deletado com sucesso!!`
					)
				}}
				style={{ width: 80, backgroundColor: Colors.danger[600], justifyContent: 'center', alignItems: 'center' }}
			>
				<Ionicons
					name="trash-sharp"
					color={"white"}
					size={20}
				/>
			</Pressable>
		)

		const handleOpenSwipe = async () => {
			setPreventSroll(false);
			const isConected = netInfo.isConnected.toString();
			if (isConected === "true") {
				setIsDisabled(false);
			} else {
				setIsDisabled(true);
			}
		};
		return (
			<GestureHandlerRootView>
				<Swipeable
					renderRightActions={renderRightActions}
					renderLeftActions={renderLeftActions}
					onSwipeableOpen={() => setisOpendSwipe(false)}
					onSwipeableClose={() => setisOpendSwipe(true)}

				>
					<CardRomaneio data={itemData.item} isOpendSwipe={!isOpendSwipe} />
				</Swipeable>
			</GestureHandlerRootView>
		);
	};

	const handleRefresh = async (idToFind) => {
		const dataToAdd = data.find((data) => data.idApp === idToFind);
		setRefreshing(true);
		try {
			const isConnected = netInfo.isConnected.toString();
			if (isConnected === "true") {
				const dataToSave = {
					...dataToAdd,
					appDate: new Date(dataToAdd.appDate),
					createdAt: new Date(dataToAdd.createdAt),
					entrada: new Date(dataToAdd.entrada),
					userDataApp: user.email,
					userCreateDoc: user?.displayName,
					uploadedToProtheus: false,
					syncDate: new Date()
				};
				const response = await saveDataOnFirebaseAndUpdate(dataToSave);
				const codTicketPro = dataToAdd?.codTicketPro ? dataToAdd.codTicketPro.replace(/^0+/, '') : '';

				if (response === 'DUPLICATE') {
					Alert.alert('Ticket já Cadastrado', `O Ticket ${codTicketPro} da Filial ${dataToAdd?.filialPro} já foi cadastrado!!`)
					return
				}

				const responseProtheus = handlerUploadProtheus(response);
				console.log("Response: ", response);
				console.log("ResponseProtheus: ", responseProtheus);
				if (response) {
					dispatch(removeFromCargas(idToFind));
					Dialog.show({
						type: ALERT_TYPE.SUCCESS,
						title: <Title text={"Feito!!"} />,
						textBody: (
							<TrySom
								placa={`${dataToAdd.placa.slice(
									0,
									3
								)}-${dataToAdd.placa.slice(3, 12)}`}
								motorista={dataToAdd.motorista}
							/>
						),
						button: "Finalizar"
					});
					setRefreshing(false);
				} else {
					Alert.alert("Ocorreu um erro na hora de salvar", "Tente novamente mais tarde....")
				}
			} else {
				console.log("is not conected!!");
				setRefreshing(false);
				Alert.alert(
					"Sem Conexão...",
					"Parece que está sem conexão com a internet , tente novamente mais tarde..."
				);
			}
		} catch (err) {
			console.log("erro ao pegar os romaneios", err);
			Alert.alert("Erro ao Salvar o Romaneio", `${err}`);
		} finally {
			setRefreshing(false);
		}
	};

	const handleRefreshScroll = async () => {
		const dataToAdd = data[0];
		const idToFind = dataToAdd.idApp;
		setRefreshing(true);
		try {
			const isConnected = netInfo.isConnected.toString();
			if (isConnected === "true") {
				const dataToSave = {
					...dataToAdd,
					appDate: new Date(dataToAdd.appDate),
					createdAt: new Date(dataToAdd.createdAt),
					entrada: new Date(dataToAdd.entrada),
					userDataApp: user.email,
					syncDate: new Date()
				};
				const response = await saveDataOnFirebaseAndUpdate(dataToSave);
				const responseProtheus = handlerUploadProtheus(response);
				console.log("Response: ", response);
				console.log("ResponseProtheus: ", responseProtheus);
				if (response) {
					dispatch(removeFromCargas(idToFind));
					const last = await getDocs();
					// console.log("last", last);
					Dialog.show({
						type: ALERT_TYPE.SUCCESS,
						title: <Title text={"Feito!!"} />,
						textBody: (
							<TrySom
								placa={`${dataToAdd.placa.slice(
									0,
									3
								)}-${dataToAdd.placa.slice(3, 12)}`}
								motorista={dataToAdd.motorista}
							/>
						),
						button: "Finalizar"
						// onPressButton: () => {
						// 	navigation.navigate("PagamentosTab");
						// }
					});
				} else {
					context.logout();
				}
			} else {
				console.log("is not conected!!");
				setRefreshing(false);
				Alert.alert(
					"Sem Conexão...",
					"Parece que está sem conexão com a internet , tente novamente mais tarde..."
				);
			}
		} catch (err) {
			console.log("erro ao pegar os romaneios", err);
			Alert.alert("Erro ao Salvar o Romaneio", `${err}`);
		} finally {
			setRefreshing(false);
		}
	};

	const handleScrollRefresh = () => {
		setRefreshing(false);
		setTimeout(() => {
			Alert.alert(
				"Atualize no botão",
				"Utilize o Botão deslizando para salvar o romaneio"
			);
		}, 300);
	};

	return (
		<AlertNotificationRoot>
			<View style={styles.rootContainer}>
				<View style={styles.resumoContainer}>
					<ResumoContainer />
				</View>
				<SafeAreaView style={styles.roundList}>
					<View style={styles.listContainer}>
						{data && data.length > 0 && (
							<FlatList
								data={data}
								scrollEnabled={preventSroll}
								showsVerticalScrollIndicator={false}
								keyExtractor={(item) => item.idApp}
								renderItem={renderRomaneioList}
								ItemSeparatorComponent={() => (
									<View style={{ height: 13 }} />
								)}
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										// onRefresh={handleRefreshScroll}
										onRefresh={handleScrollRefresh}
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
		// paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
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
		backgroundColor: Colors.primary[700]
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8
	}
});
