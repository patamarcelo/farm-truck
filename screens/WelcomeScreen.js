import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";

import {
	ActivityIndicator,
	Alert,
	FlatList,
	Platform,
	Pressable,
	RefreshControl,
	SafeAreaView,
	StyleSheet,
	Text,
	View
} from "react-native";

import {
	GestureHandlerRootView,
	Swipeable
} from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
	ALERT_TYPE,
	AlertNotificationRoot,
	Dialog
} from "react-native-alert-notification";

import CardRomaneio from "../components/romaneio/CardTruck";
import ResumoContainer from "../components/romaneio/ResumoContainer";
import IconButton from "../components/ui/IconButton";

import { Colors } from "../constants/styles";

import {
	romaneioSelector,
	userSelector
} from "../store/redux/selector";

import { removeFromCargas } from "../store/redux/romaneios";

import {
	saveDataOnFirebaseAndUpdate
} from "../store/firebase";

import nodeServer from "../utils/axios/axios";

import {
	useAutoSyncColheita
} from "../utils/features/useAutoSyncCOlheita";

const SWIPE_ACTION_WIDTH = 76;

function formatPlate(plate) {
	if (!plate) {
		return "Placa não informada";
	}

	const normalized = String(plate)
		.replace(/[^a-zA-Z0-9]/g, "")
		.toUpperCase();

	if (normalized.length <= 3) {
		return normalized;
	}

	return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
}

function DialogTitle({ text }) {
	return (
		<View style={styles.dialogTitleContainer}>
			<Text style={styles.dialogTitle}>
				{text}
			</Text>
		</View>
	);
}

function SyncSuccessContent({
	placa,
	motorista
}) {
	return (
		<View style={styles.successContainer}>
			<View style={styles.successIconContainer}>
				<Ionicons
					name="checkmark"
					size={30}
					color="#FFFFFF"
				/>
			</View>

			<Text style={styles.successTitle}>
				Romaneio sincronizado
			</Text>

			<View style={styles.successDetails}>
				<Text style={styles.successPlate}>
					{formatPlate(placa)}
				</Text>

				<Text style={styles.successDriver}>
					{motorista || "Motorista não informado"}
				</Text>
			</View>
		</View>
	);
}

function EmptyRomaneios() {
	return (
		<View style={styles.emptyContainer}>
			<View style={styles.emptyIconContainer}>
				<Ionicons
					name="checkmark-circle-outline"
					size={38}
					color={Colors.primary500}
				/>
			</View>

			<Text style={styles.emptyTitle}>
				Nenhum romaneio pendente
			</Text>

			<Text style={styles.emptyDescription}>
				Os próximos carregamentos aparecerão aqui.
			</Text>
		</View>
	);
}

async function uploadRomaneioToProtheus(firebaseId) {
	if (!firebaseId) {
		throw new Error(
			"Não foi retornado um identificador válido."
		);
	}

	const response = await nodeServer.post(
		"upload-romaneio/",
		{
			id: firebaseId
		}
	);

	return response.data;
}

function WelcomeScreen() {
	useAutoSyncColheita();

	const navigation = useNavigation();
	const dispatch = useDispatch();
	const netInfo = useNetInfo();

	const romaneios = useSelector(romaneioSelector) || [];
	const user = useSelector(userSelector);

	const openedSwipeableRef = useRef(null);

	const [syncingId, setSyncingId] = useState(null);
	const [refreshing, setRefreshing] = useState(false);

	const isOnline =
		netInfo.isConnected === true &&
		netInfo.isInternetReachable !== false;

	const firstName = useMemo(() => {
		const displayName = user?.displayName?.trim();

		if (!displayName) {
			return "Usuário";
		}

		return displayName.split(" ")[0];
	}, [user?.displayName]);

	const listSubtitle = useMemo(() => {
		const total = romaneios.length;

		if (total === 0) {
			return "Nenhum carregamento aguardando envio";
		}

		if (total === 1) {
			return "1 carregamento aguardando envio";
		}

		return `${total} carregamentos aguardando envio`;
	}, [romaneios.length]);

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTransparent: false,
			headerShadowVisible: false,
			headerTitleAlign: "center",

			headerStyle: {
				backgroundColor: Colors.primary500
			},

			headerTitle: () => (
				<Text style={styles.headerTitle}>
					FarmTruck
				</Text>
			),

			headerLeft: () => null,

			headerRight: () => (
				<IconButton
					icon="menu"
					color="#FFFFFF"
					size={25}
					onPress={() =>
						navigation.toggleDrawer()
					}
				/>
			),

			headerRightContainerStyle: {
				paddingRight: 14
			},

			tabBarStyle: {
				backgroundColor: Colors.primary800,
				borderTopColor: "transparent",
				borderTopWidth: 0,
				elevation: 0
			}
		});
	}, [navigation]);

	const openRomaneioDetails = useCallback(
		(romaneio) => {
			openedSwipeableRef.current?.close();

			navigation.navigate("ModalRomaneio", {
				data: romaneio.idApp,

				/*
				 * O modal usa filtId para decidir entre:
				 * romaneiosFarmSelector ou romaneioSelector.
				 *
				 * Para romaneios pendentes locais, envie string vazia.
				 */
				filtId: ""
			});
		},
		[navigation]
	);

	const showSyncSuccess = useCallback((romaneio) => {
		Dialog.show({
			type: ALERT_TYPE.SUCCESS,

			title: (
				<DialogTitle text="Envio concluído" />
			),

			textBody: (
				<SyncSuccessContent
					placa={romaneio?.placa}
					motorista={romaneio?.motorista}
				/>
			),

			button: "Concluir"
		});
	}, []);

	const handleSwipeOpen = useCallback((swipeable) => {
		if (
			openedSwipeableRef.current &&
			openedSwipeableRef.current !== swipeable
		) {
			openedSwipeableRef.current.close();
		}

		openedSwipeableRef.current = swipeable;
	}, []);

	const handleSwipeClose = useCallback((swipeable) => {
		if (openedSwipeableRef.current === swipeable) {
			openedSwipeableRef.current = null;
		}
	}, []);

	const confirmDelete = useCallback(
		(romaneio, swipeable) => {
			swipeable?.close();

			const description = [
				formatPlate(romaneio?.placa),
				romaneio?.motorista
			]
				.filter(Boolean)
				.join(" · ");

			Alert.alert(
				"Excluir romaneio?",
				description ||
					"Esta ação removerá o romaneio deste aparelho.",
				[
					{
						text: "Cancelar",
						style: "cancel"
					},
					{
						text: "Excluir",
						style: "destructive",

						onPress: () => {
							dispatch(
								removeFromCargas(
									romaneio.idApp
								)
							);
						}
					}
				]
			);
		},
		[dispatch]
	);

	const synchronizeRomaneio = useCallback(
		async (romaneio, swipeable) => {
			swipeable?.close();

			if (!romaneio?.idApp) {
				Alert.alert(
					"Romaneio inválido",
					"Não foi possível identificar este romaneio."
				);

				return;
			}

			if (!isOnline) {
				Alert.alert(
					"Sem conexão",
					"O romaneio continua salvo no aparelho e poderá ser enviado quando a conexão voltar."
				);

				return;
			}

			if (syncingId) {
				return;
			}

			setSyncingId(romaneio.idApp);

			try {
				const dataToSave = {
					...romaneio,

					appDate: romaneio.appDate
						? new Date(romaneio.appDate)
						: new Date(),

					createdAt: romaneio.createdAt
						? new Date(romaneio.createdAt)
						: new Date(),

					entrada: romaneio.entrada
						? new Date(romaneio.entrada)
						: new Date(),

					userDataApp: user?.email || null,
					userCreateDoc:
						user?.displayName || null,

					uploadedToProtheus: false,
					syncDate: new Date()
				};

				const firebaseResponse =
					await saveDataOnFirebaseAndUpdate(
						dataToSave
					);

				const ticket =
					romaneio?.codTicketPro
						? String(
								romaneio.codTicketPro
							).replace(/^0+/, "")
						: "";

				if (firebaseResponse === "DUPLICATE") {
					Alert.alert(
						"Ticket já cadastrado",
						`O ticket ${
							ticket || "informado"
						} da filial ${
							romaneio?.filialPro || ""
						} já foi cadastrado.`
					);

					return;
				}

				if (!firebaseResponse) {
					throw new Error(
						"Não foi possível obter o identificador do documento."
					);
				}

				await uploadRomaneioToProtheus(
					firebaseResponse
				);

				dispatch(
					removeFromCargas(romaneio.idApp)
				);

				showSyncSuccess(romaneio);
			} catch (error) {
				console.error(
					"Erro ao sincronizar romaneio:",
					error
				);

				const message =
					error?.response?.data?.detail ||
					error?.response?.data?.message ||
					error?.message;

				Alert.alert(
					"Erro na sincronização",
					message ||
						"Não foi possível enviar o romaneio. Tente novamente."
				);
			} finally {
				setSyncingId(null);
			}
		},
		[
			dispatch,
			isOnline,
			showSyncSuccess,
			syncingId,
			user?.displayName,
			user?.email
		]
	);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);

		setTimeout(() => {
			setRefreshing(false);

			if (!isOnline) {
				Alert.alert(
					"Sem conexão",
					"Não foi possível verificar atualizações."
				);
			}
		}, 450);
	}, [isOnline]);

	const renderLeftActions = useCallback(
		(romaneio, swipeable) => (
			<View style={styles.leftActionWrapper}>
				<Pressable
					disabled={
						syncingId === romaneio.idApp
					}
					onPress={() =>
						confirmDelete(
							romaneio,
							swipeable
						)
					}
					style={({ pressed }) => [
						styles.swipeAction,
						styles.deleteAction,

						pressed &&
							styles.actionPressed
					]}
					accessibilityRole="button"
					accessibilityLabel="Excluir romaneio"
				>
					<Ionicons
						name="trash-outline"
						size={21}
						color="#FFFFFF"
					/>

					<Text style={styles.swipeActionText}>
						Excluir
					</Text>
				</Pressable>
			</View>
		),
		[confirmDelete, syncingId]
	);

	const renderRightActions = useCallback(
		(romaneio, swipeable) => {
			const isCurrentSyncing =
				syncingId === romaneio.idApp;

			const hasAnotherSync =
				Boolean(syncingId) &&
				!isCurrentSyncing;

			return (
				<View style={styles.rightActionWrapper}>
					<Pressable
						disabled={
							!isOnline ||
							isCurrentSyncing ||
							hasAnotherSync
						}
						onPress={() =>
							synchronizeRomaneio(
								romaneio,
								swipeable
							)
						}
						style={({ pressed }) => [
							styles.swipeAction,
							styles.syncAction,

							(!isOnline ||
								hasAnotherSync) &&
								styles.disabledAction,

							pressed &&
								styles.actionPressed
						]}
						accessibilityRole="button"
						accessibilityLabel="Sincronizar romaneio"
					>
						{isCurrentSyncing ? (
							<ActivityIndicator
								size="small"
								color="#FFFFFF"
							/>
						) : (
							<>
								<Ionicons
									name="arrow-up-outline"
									size={22}
									color="#FFFFFF"
								/>

								<Text style={styles.swipeActionText}>
									Enviar
								</Text>
							</>
						)}
					</Pressable>
				</View>
			);
		},
		[
			isOnline,
			synchronizeRomaneio,
			syncingId
		]
	);

	const renderRomaneio = useCallback(
		({ item }) => {
			let swipeableInstance = null;

			return (
				<View style={styles.itemShadowContainer}>
					<Swipeable
						ref={(reference) => {
							swipeableInstance = reference;
						}}
						friction={2}
						leftThreshold={35}
						rightThreshold={35}
						overshootLeft={false}
						overshootRight={false}
						onSwipeableOpen={() =>
							handleSwipeOpen(
								swipeableInstance
							)
						}
						onSwipeableClose={() =>
							handleSwipeClose(
								swipeableInstance
							)
						}
						renderLeftActions={() =>
							renderLeftActions(
								item,
								swipeableInstance
							)
						}
						renderRightActions={() =>
							renderRightActions(
								item,
								swipeableInstance
							)
						}
					>
						<Pressable
							onPress={() =>
								openRomaneioDetails(item)
							}
							style={({ pressed }) => [
								styles.cardPressable,

								pressed &&
									styles.cardPressed
							]}
							accessibilityRole="button"
							accessibilityLabel={`Abrir detalhes do romaneio ${formatPlate(
								item?.placa
							)}`}
						>
							<CardRomaneio
								data={item}
								isOpendSwipe
								styleContainer={
									styles.cardContent
								}
							/>
						</Pressable>
					</Swipeable>
				</View>
			);
		},
		[
			handleSwipeClose,
			handleSwipeOpen,
			openRomaneioDetails,
			renderLeftActions,
			renderRightActions
		]
	);

	const keyExtractor = useCallback(
		(item, index) =>
			String(
				item?.idApp ||
					`romaneio-${index}`
			),
		[]
	);

	return (
		<AlertNotificationRoot>
			<GestureHandlerRootView style={styles.flex}>
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.screen}>
						<View style={styles.topSection}>
							<View style={styles.welcomeSection}>
								<Text style={styles.welcomeTitle}>
									Olá, {firstName}
								</Text>

								<Text
									style={styles.welcomeSubtitle}
									numberOfLines={1}
								>
									Acompanhe seus carregamentos pendentes
								</Text>
							</View>

							<View style={styles.summaryContainer}>
								<ResumoContainer />
							</View>
						</View>

						<View style={styles.listSection}>
							<View style={styles.listHeader}>
								<View style={styles.listHeaderText}>
									<Text style={styles.listTitle}>
										Romaneios
									</Text>

									<Text
										style={styles.listSubtitle}
										numberOfLines={1}
									>
										{listSubtitle}
									</Text>
								</View>

								<View style={styles.countBadge}>
									<Text style={styles.countBadgeText}>
										{romaneios.length}
									</Text>
								</View>
							</View>

							<FlatList
								data={romaneios}
								keyExtractor={keyExtractor}
								renderItem={renderRomaneio}
								showsVerticalScrollIndicator={false}
								keyboardShouldPersistTaps="handled"
								removeClippedSubviews={
									Platform.OS === "android"
								}
								initialNumToRender={8}
								maxToRenderPerBatch={8}
								windowSize={7}
								updateCellsBatchingPeriod={50}
								contentContainerStyle={[
									styles.listContent,

									romaneios.length === 0 &&
										styles.emptyListContent
								]}
								ItemSeparatorComponent={() => (
									<View
										style={styles.itemSeparator}
									/>
								)}
								ListEmptyComponent={EmptyRomaneios}
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={handleRefresh}
										tintColor={
											Colors.primary500
										}
										colors={[
											Colors.primary500
										]}
									/>
								}
							/>
						</View>
					</View>
				</SafeAreaView>
			</GestureHandlerRootView>
		</AlertNotificationRoot>
	);
}

export default WelcomeScreen;

const styles = StyleSheet.create({
	flex: {
		flex: 1
	},

	safeArea: {
		flex: 1,
		backgroundColor: Colors.primary500
	},

	screen: {
		flex: 1,
		width: "100%",
		backgroundColor: "#F2F2F7"
	},

	headerTitle: {
		fontSize: 17,
		lineHeight: 22,
		fontWeight: "700",
		letterSpacing: -0.2,
		color: "#FFFFFF"
	},

	topSection: {
		width: "100%",
		paddingBottom: 8
	},

	welcomeSection: {
		width: "100%",
		paddingHorizontal: 16,
		paddingTop: 13,
		paddingBottom: 8
	},

	welcomeTitle: {
		fontSize: 23,
		lineHeight: 28,
		fontWeight: "700",
		letterSpacing: -0.45,
		color: "#1C1C1E"
	},

	welcomeSubtitle: {
		marginTop: 1,
		fontSize: 11,
		lineHeight: 15,
		color: "#8E8E93"
	},

	summaryContainer: {
		width: "100%",
		paddingHorizontal: 8,
		paddingBottom: 2
	},

	listSection: {
		flex: 1,
		width: "100%",
		backgroundColor: "#F7F7F9",
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		overflow: "hidden",

		shadowColor: "#000000",
		shadowOpacity: 0.07,
		shadowOffset: {
			width: 0,
			height: -3
		},
		shadowRadius: 8,

		elevation: 4
	},

	listHeader: {
		minHeight: 59,
		paddingHorizontal: 14,
		paddingVertical: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#FFFFFF",

		shadowColor: "#000000",
		shadowOpacity: 0.035,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowRadius: 4,

		elevation: 1,
		zIndex: 2
	},

	listHeaderText: {
		flex: 1,
		paddingRight: 10
	},

	listTitle: {
		fontSize: 18,
		lineHeight: 22,
		fontWeight: "700",
		letterSpacing: -0.3,
		color: "#1C1C1E"
	},

	listSubtitle: {
		marginTop: 1,
		fontSize: 11,
		lineHeight: 15,
		color: "#8E8E93"
	},

	countBadge: {
		minWidth: 30,
		height: 30,
		paddingHorizontal: 9,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#E8F1EC"
	},

	countBadgeText: {
		fontSize: 13,
		fontWeight: "700",
		color: Colors.primary500
	},

	listContent: {
		flexGrow: 1,
		width: "100%",
		paddingTop: 5,
		paddingBottom: 24
	},

	emptyListContent: {
		justifyContent: "center"
	},

	itemShadowContainer: {
		width: "100%",
		backgroundColor: "#FFFFFF",

		shadowColor: "#000000",
		shadowOpacity: 0.09,
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,

		elevation: 3
	},

	cardPressable: {
		width: "100%",
		backgroundColor: "#FFFFFF"
	},

	cardPressed: {
		opacity: 0.84,
		backgroundColor: "#F8F8FA"
	},

	cardContent: {
		width: "100%",
		alignSelf: "stretch"
	},

	itemSeparator: {
		height: 7,
		backgroundColor: "#F2F2F7",

		shadowColor: "#000000",
		shadowOpacity: 0.04,
		shadowOffset: {
			width: 0,
			height: -2
		},
		shadowRadius: 3
	},

	leftActionWrapper: {
		width: SWIPE_ACTION_WIDTH,
		justifyContent: "center",
		backgroundColor: "#FF3B30"
	},

	rightActionWrapper: {
		width: SWIPE_ACTION_WIDTH,
		justifyContent: "center",
		backgroundColor: Colors.primary500
	},

	swipeAction: {
		width: SWIPE_ACTION_WIDTH,
		height: "100%",
		minHeight: 86,
		alignItems: "center",
		justifyContent: "center",
		gap: 5
	},

	deleteAction: {
		backgroundColor: "#FF3B30"
	},

	syncAction: {
		backgroundColor: Colors.primary500
	},

	disabledAction: {
		backgroundColor: "#AEAEB2"
	},

	actionPressed: {
		opacity: 0.76
	},

	swipeActionText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#FFFFFF"
	},

	emptyContainer: {
		minHeight: 220,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 30
	},

	emptyIconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#E8F3EC"
	},

	emptyTitle: {
		marginTop: 14,
		fontSize: 18,
		lineHeight: 23,
		fontWeight: "700",
		textAlign: "center",
		color: "#1C1C1E"
	},

	emptyDescription: {
		marginTop: 5,
		fontSize: 13,
		lineHeight: 18,
		textAlign: "center",
		color: "#8E8E93"
	},

	dialogTitleContainer: {
		paddingTop: 18,
		alignItems: "center"
	},

	dialogTitle: {
		fontSize: 18,
		lineHeight: 23,
		fontWeight: "700",
		color: "#1C1C1E"
	},

	successContainer: {
		width: "100%",
		alignItems: "center",
		paddingTop: 8,
		paddingBottom: 4
	},

	successIconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#34C759"
	},

	successTitle: {
		marginTop: 13,
		fontSize: 16,
		lineHeight: 21,
		fontWeight: "700",
		color: "#1C1C1E"
	},

	successDetails: {
		width: "100%",
		marginTop: 15,
		padding: 13,
		borderRadius: 13,
		alignItems: "center",
		backgroundColor: "#F2F2F7"
	},

	successPlate: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: "700",
		color: "#1C1C1E"
	},

	successDriver: {
		marginTop: 3,
		fontSize: 12,
		lineHeight: 17,
		color: "#636366"
	}
});