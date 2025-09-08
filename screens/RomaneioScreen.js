import {
	StyleSheet,
	Text,
	View,
	Button,
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
	StatusBar,
	Platform,
	Animated as AnimatedOrigin,
	Pressable
} from "react-native";
// import { ScrollView } from "react-native-virtualized-view";
import Animated, { FadeInRight, FadeOut, Layout, BounceIn, BounceOut, FadeOutRight } from 'react-native-reanimated';

import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useState, useContext, useRef, useCallback } from "react";

import { AuthContext } from "../store/auth-context";

import RomaneioList from "../components/Romaneio-list/RomaneioList";
import SearchBar from "../components/Romaneio-list/RomaneioSearchBar";

import { getAllDocsFirebase } from "../store/firebase/index";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { addRomaneiosFarm } from "../store/redux/romaneios";
import { romaneiosFarmSelector, userSelectorAttr } from "../store/redux/selector";

import { Dimensions, RefreshControl } from "react-native";

// import { useScrollToTop } from "@react-navigation/native";

import { projetosSelector } from "../store/redux/selector";

import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FAB } from "react-native-paper"; // Floating Action Button
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';

const width = Dimensions.get("window").width; //full width
import { InteractionManager } from "react-native";
import { Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const RomaneioScreen = () => {
	// const isFocused = useIsFocused();
	const dispatch = useDispatch();
	const data = useSelector(romaneiosFarmSelector);
	const [sentData, setSentData] = useState(() => data ?? []);

	const user = useSelector(userSelectorAttr);

	const tabBarHeight = useBottomTabBarHeight();

	const [isLoading, seTisLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const [filteredData, setFilteredData] = useState([]);
	const [onlyLoadTruck, setOnlyLoadTruck] = useState(0);
	const [onlyWeiTruck, setOnlyWeiTruck] = useState(0);
	const [onlyPendingProtheusTruck, setOnlyPendingProtheusTruck] = useState(0);

	const [showSearch, setShowSearch] = useState(false);
	const [isFiltered, setIsFiltered] = useState(false);
	const [oldArray, setOldArray] = useState([]);

	const projetosData = useSelector(projetosSelector);

	const context = useContext(AuthContext);
	
	const insets = useSafeAreaInsets();
	const FAB_OFFSET = 16; // distância do fundo

	// const ref = useRef(null);

	const slideAnim = useRef(new AnimatedOrigin.Value(-100)).current; // start off-screen (above)

	// State to control visibility
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		setSentData(data ?? []);
	}, [data]);

	// Function to slide down (show)
	const slideDown = () => {
		setVisible(true);
		AnimatedOrigin.timing(slideAnim, {
			toValue: 0,
			duration: 500,
			useNativeDriver: true,
		}).start();
	};

	// Function to slide up (hide)
	const slideUp = (onFinish) => {
		AnimatedOrigin.timing(slideAnim, {
			toValue: -100,
			duration: 500,
			useNativeDriver: true,
		}).start(() => {
			setVisible(false);
			if (onFinish) onFinish(); // executa só depois da animação
		});
	};


	// const handleFilterProps = () => {
	// 	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
	// 	setShowSearch((prev) => {
	// 		if (!prev) {
	// 			slideDown()
	// 			return !prev
	// 		} else {
	// 			slideUp()
	// 			setSearch("");
	// 			return !prev
	// 		}
	// 	})
	// }
	const handleFilterProps = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		if (!showSearch) {
			slideDown();
			setShowSearch(true);
		} else {
			setShowSearch(false);
			slideUp(() => setSearch("")); // limpa só depois do slideUp terminar
		}
	};

	useEffect(() => {
		if (!showSearch) {
			const task = InteractionManager.runAfterInteractions(() => setSearch(""));
			return () => task?.cancel?.();
		}
	}, [showSearch]);


	useEffect(() => {
		if (data) {
			setSentData(data);
		} else {
			setSentData([]);
		}
	}, []);

	useEffect(() => {
		if (data) {
			setSentData(data);
		}
	}, [data]);

	const fetchRomaneios = useCallback(async () => {
		if (data.length === 0) {
			seTisLoading(true);
		}
		try {
			if (!projetosData) {
				dispatch(addRomaneiosFarm([]));
				return;
			}
			const data = await getAllDocsFirebase(projetosData);
			if (data === false) {
				dispatch(addRomaneiosFarm([]));
				context.logout();
				return;
			}
			dispatch(addRomaneiosFarm(data.filter(d => Number(d.liquido) !== 1)));
		} catch (error) {
			if (error?.code === "permission-denied") {
				dispatch(addRomaneiosFarm([]));
				context.logout();
			}
		} finally {
			seTisLoading(false);
		}
	}, [projetosData, dispatch, context]);

	const hasFetchedOnce = useRef(false);

	useEffect(() => {
		if (hasFetchedOnce.current) return;        // evita rodar novamente
		if (!projetosData) return;                 // espera ter projetosData válido
		hasFetchedOnce.current = true;
		fetchRomaneios();
	}, [projetosData, fetchRomaneios]);


	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			await fetchRomaneios();
		} finally {
			setRefreshing(false);
		}
	};

	// useEffect(() => {
	// 	if (isFocused) {
	// 		setSearch("");
	// 	}
	// }, [isFocused]);


	const [search, setSearch] = useState("");

	const updateSearchHandler = (e) => {
		console.log('handler e', e)
		setSearch(e);
	};



	useEffect(() => {
		if (filteredData.length > 0) {
			const onlyLoad = filteredData.filter((data) => data.pesoBruto.length === 0)
			setOnlyLoadTruck(onlyLoad?.length)
			const onlyWei = filteredData.filter((data) => data.pesoBruto > 0 && data.liquido.length === 0)
			setOnlyWeiTruck(onlyWei?.length)

			const onlyPendingProtheus = filteredData.filter((data) => data.pesoBruto > 0 && data.liquido > 0 && data.uploadedToProtheus === false)
			setOnlyPendingProtheusTruck(onlyPendingProtheus?.length)
			setOldArray(data)
		}
	}, [filteredData]);

	const handleFilterTruck = (trucks) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		if (trucks === 'clear') {
			setFilteredData(oldArray)
			setIsFiltered(false)
		}
		if (trucks === 'onlyLoadTruck') {
			const onlyLoad = oldArray.filter((data) => data.pesoBruto.length === 0)
			setFilteredData(onlyLoad)
			setIsFiltered(true)
		}
		if (trucks === 'onlyWeiTruck') {
			const onlyWei = filteredData.filter((data) => data.pesoBruto > 0 && data.liquido.length === 0)
			setFilteredData(onlyWei)
			setIsFiltered(true)
		}
		if (trucks === 'onlyPendingProtheusTruck') {
			const onlyPendingProtheus = filteredData.filter((data) => data.pesoBruto > 0 && data.liquido > 0 && data.uploadedToProtheus === false)
			setFilteredData(onlyPendingProtheus)
			setIsFiltered(true)
		}
	}

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					backgroundColor: Colors.primary800
				}}
			>
				<ActivityIndicator size="large" color="#f5f5f5" />
			</View>
		);
	}


	const HeaderComp = () => {
		return (
			<View style={styles.infoHeaderContainer}>
				{
					filteredData && filteredData.length > 0 &&
					<View style={styles.containerInfo}>
						<View style={styles.containerInfoTruck}>
							{
								onlyLoadTruck > 0 &&
								<View
									entering={FadeInRight.duration(500)} // Root-level animation for appearance
									exiting={FadeOutRight.duration(500)} // Root-level animation for disappearance
									layout={Layout.springify()}    // 
								>

									<Pressable
										onPress={handleFilterTruck.bind(this, 'onlyLoadTruck')}
									>
										<Text style={styles.infoHeader}><MaterialCommunityIcons name="truck-fast" size={24} color={Colors.secondary[400]} /> {onlyLoadTruck}</Text>
									</Pressable>
								</View>
							}
							{
								onlyWeiTruck > 0 &&
								<View
									entering={FadeInRight.duration(500)} // Root-level animation for appearance
									exiting={FadeOutRight.duration(500)} // Root-level animation for disappearance
									layout={Layout.springify()}    // 
								>

									<Pressable
										onPress={handleFilterTruck.bind(this, 'onlyWeiTruck')}
									>
										<Text style={styles.infoHeader}><MaterialCommunityIcons name="truck-fast" size={24} color={Colors.yellow[700]} /> {onlyWeiTruck}</Text>
									</Pressable>
								</View>
							}
							{
								onlyPendingProtheusTruck > 0 &&
								<View
									entering={FadeInRight.duration(500)} // Root-level animation for appearance
									exiting={FadeOutRight.duration(500)} // Root-level animation for disappearance
									layout={Layout.springify()}    // 
								>
									<Pressable
										onPress={handleFilterTruck.bind(this, 'onlyPendingProtheusTruck')}
									>
										<Text style={styles.infoHeader}><MaterialCommunityIcons name="truck-fast" size={24} color={Colors.success[100]} /> {onlyPendingProtheusTruck}</Text>
									</Pressable>
								</View>
							}
							{
								isFiltered &&
								<View
									entering={FadeInRight.duration(500)} // Root-level animation for appearance
									exiting={FadeOutRight.duration(500)} // Root-level animation for disappearance
									layout={Layout.springify()}    // 
								>
									<Pressable
										onPress={handleFilterTruck.bind(this, 'clear')}
									>

										<MaterialCommunityIcons name="progress-close" size={24} color={Colors.gold[500]} />
									</Pressable>
								</View>
							}
						</View>
						<View style={styles.containerInfoTotal}>
							<Text style={styles.infoHeader}>Lista: {filteredData.length}</Text>
						</View>
					</View>
				}
			</View>
		)
	}

	if (!isLoading) {
		return (
			<SafeAreaView style={styles.mainContainer}>
				{
					showSearch && (
						<AnimatedOrigin.View style={[styles.mainContainer, { transform: [{ translateY: slideAnim }], padding: 0, margin: 0, paddingTop: 0 }]}>
							<SearchBar
								search={search}
								updateSearchHandler={updateSearchHandler}
							/>
						</AnimatedOrigin.View>
					)
				}
				<View
					showsVerticalScrollIndicator={false}
					contentInsetAdjustmentBehavior='automatic'
				>
					<RomaneioList search={search} data={sentData}
						filteredData={filteredData}
						setFilteredData={setFilteredData}
						refreshing={refreshing}
						handleRefresh={handleRefresh}
						HeaderComp={HeaderComp}
					/>
				</View>
				<Portal>
					<FAB
						icon={showSearch ? "close" : "magnify"}
						color="black"
						onPress={handleFilterProps}
						style={{
							position: "absolute",
							right: 16,
							bottom: (tabBarHeight || 0) + (insets.bottom || 0) + FAB_OFFSET,
							backgroundColor: "rgba(200,200,200,0.3)",
							borderColor: Colors.success[300],
							borderWidth: 1,
						}}
					/>
				</Portal>
			</SafeAreaView>
		);
	}
};

export default RomaneioScreen;

const styles = StyleSheet.create({
	containerInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "flex-end",
		width: '100%',
	},
	containerInfoTruck: {
		flexDirection: 'row',
		gap: 20,
	},
	containerInfoTotal: {},
	infoHeaderContainer: {
		width: '100%',
		paddingRight: 10,
		paddingLeft: 10,
		marginBottom: 5
	},
	infoHeader: {
		color: 'whitesmoke',
	},
	listContainer: {
		with: "50%"
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "whitesmoke"
	},
	mainContainer: {
		// width: width,
		width: "100%",
		// padding: 2,
		backgroundColor: "red",
		flex: 1,
		// flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.primary500,
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
	},
	fabContainer: {
		position: "absolute",
		right: 20,
		bottom: 20
	},
	fab: {
		position: "absolute",
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(200, 200, 200, 0.3)", // Grey, almost transparent
		width: 50,
		height: 50,
		borderRadius: 25, // Makes it perfectly circular
		justifyContent: "center",
		alignItems: "center",
		elevation: 4,
		borderColor: Colors.success[300],
		borderWidth: 1
	},
	fab2: {
		position: "absolute",
		right: 0,
		bottom: 65,
		backgroundColor: "rgba(200, 200, 200, 0.3)", // Grey, almost transparent
		width: 50,
		height: 50,
		borderRadius: 25, // Makes it perfectly circular
		justifyContent: "center",
		alignItems: "center",
		elevation: 4
	},
	mainContainer: {
		width: "100%",
		paddingVertical: 10,
		paddingHorizontal: 5
	},
});
