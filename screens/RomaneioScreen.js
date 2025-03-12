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
import { useState, useContext, useRef } from "react";

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

const RomaneioScreen = ({ navigation, route }) => {
	const isFocused = useIsFocused();
	const [sentData, setSentData] = useState([]);
	const dispatch = useDispatch();
	const data = useSelector(romaneiosFarmSelector);
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

	// const ref = useRef(null);

	const slideAnim = useRef(new AnimatedOrigin.Value(-100)).current; // start off-screen (above)

	// State to control visibility
	const [visible, setVisible] = useState(false);

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
	const slideUp = () => {
		AnimatedOrigin.timing(slideAnim, {
			toValue: -100,
			duration: 500,
			useNativeDriver: true,
		}).start(() => {
			setVisible(false);
		});
	};
	const handleFilterProps = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		setShowSearch((prev) => {
			if (!prev) {
				slideDown()
				return !prev
			} else {
				slideUp()
				setSearch("");
				return !prev
			}
		})
	}

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

	useEffect(() => {
		if (projetosData) {
			seTisLoading(true);
			const getDataFire = async () => {
				try {
					const data = await getAllDocsFirebase(projetosData);
					if (data === false) {
						dispatch(addRomaneiosFarm([]));
						context.logout();
					}
					dispatch(addRomaneiosFarm(data.filter((data) => Number(data.liquido) !== 1)));
				} catch (error) {
					if (error.code === "permission-denied") {
						dispatch(addRomaneiosFarm([]));
						context.logout();
					}
				} finally {
					// seTisLoading(false);
				}
			};
			if (isFocused) {
				console.log("isFocused", isFocused);
				getDataFire();
				console.log("finalizou de pegar os dados");
			}
		} else {
			dispatch(addRomaneiosFarm([]));
			// seTisLoading(false);
		}
		seTisLoading(false);
	}, [isFocused]);

	useEffect(() => {
		if (isFocused) {
			setSearch("");
		}
	}, [isFocused]);

	const handleRefresh = async () => {
		console.log('atualuizando os dadosssss')
		setRefreshing(true);
		try {
			const data = await getAllDocsFirebase(projetosData);
			if (data === false) {
				dispatch(addRomaneiosFarm([]));
				context.logout();
			}
			if (data) {
				dispatch(addRomaneiosFarm(data.filter((data) => Number(data.liquido) !== 1)))
			}
		} catch (error) {
			console.log("Erro ao pegar os dados: ", error);
			if (error.code === "permission-denied") {
				dispatch(addRomaneiosFarm([]));
				context.logout();
			}
		} finally {
			setRefreshing(false);
		}
	};

	// const context = useContext(AuthContext);
	const [search, setSearch] = useState("");

	const updateSearchHandler = (e) => {
		setSearch(e);
	};

	// useScrollToTop(
	// 	useRef({
	// 		scrollToTop: () => ref.current?.scrollTo({ y: 0 })
	// 	})
	// );

	// useScrollToTop(ref);

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
					// ref={ref}
					// contentContainerStyle={{ minHeight: '100%' }}
					contentInsetAdjustmentBehavior='automatic'
				// refreshControl={
				// 	<RefreshControl
				// 		refreshing={refreshing}
				// 		onRefresh={handleRefresh}
				// 		colors={["#9Bd35A", "#689F38"]}
				// 		tintColor={"whitesmoke"}
				// 	/>
				// }
				>
					<RomaneioList search={search} data={sentData}
						filteredData={filteredData}
						setFilteredData={setFilteredData}
						refreshing={refreshing}
						handleRefresh={handleRefresh}
						HeaderComp={<HeaderComp />}
					/>
				</View>
				<View style={[styles.fabContainer, { marginBottom: showSearch && tabBarHeight }]}>
					<FAB
						style={[styles.fab, { backgroundColor: "rgba(200, 200, 200, 0.3)", marginBottom: showSearch && tabBarHeight }]}
						icon={showSearch ? "close" : "magnify"}
						color="black" // Icon color
						onPress={handleFilterProps}
					/>
				</View>
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
