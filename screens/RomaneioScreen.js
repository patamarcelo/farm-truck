import {
	StyleSheet,
	Text,
	View,
	Button,
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
	StatusBar,
	Platform
} from "react-native";
// import { ScrollView } from "react-native-virtualized-view";

import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useState, useContext } from "react";

import { AuthContext } from "../store/auth-context";

import RomaneioList from "../components/Romaneio-list/RomaneioList";
import SearchBar from "../components/Romaneio-list/RomaneioSearchBar";

import { getAllDocsFirebase } from "../store/firebase/index";
import { useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { addRomaneiosFarm } from "../store/redux/romaneios";
import { romaneiosFarmSelector, userSelectorAttr } from "../store/redux/selector";

import { Dimensions, RefreshControl } from "react-native";

import { useScrollToTop } from "@react-navigation/native";

import { projetosSelector } from "../store/redux/selector";

import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const width = Dimensions.get("window").width; //full width

const RomaneioScreen = ({ navigation, route }) => {
	const isFocused = useIsFocused();
	const [sentData, setSentData] = useState([]);
	const dispatch = useDispatch();
	const data = useSelector(romaneiosFarmSelector);
	const user = useSelector(userSelectorAttr);

	const [isLoading, seTisLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const [filteredData, setFilteredData] = useState([]);
	const [onlyLoadTruck, setOnlyLoadTruck] = useState(0);
	const [onlyWeiTruck, setOnlyWeiTruck] = useState(0);

	const projetosData = useSelector(projetosSelector);

	const context = useContext(AuthContext);

	const ref = useRef(null);

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
					let maxQuery = 100
					if(user?.admin){
						maxQuery = 150
					}
					const data = await getAllDocsFirebase(projetosData, maxQuery);
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
		setRefreshing(true);
		try {
			const data = await getAllDocsFirebase(projetosData);
			if (data === false) {
				dispatch(addRomaneiosFarm([]));
				context.logout();
			}
			if (data) {
				dispatch(addRomaneiosFarm(data));
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

	useScrollToTop(
		useRef({
			scrollToTop: () => ref.current?.scrollTo({ y: 0 })
		})
	);

	useScrollToTop(ref);

	useEffect(() => {
		if(filteredData.length > 0){
			const onlyLoad = filteredData.filter((data) => data.pesoBruto.length === 0)
			setOnlyLoadTruck(onlyLoad?.length)
			const onlyWei = filteredData.filter((data) => data.pesoBruto > 0 && data.liquido.length === 0)
			setOnlyWeiTruck(onlyWei?.length)
		}
	}, [filteredData]);

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

	if (!isLoading) {
		return (
			<View style={styles.mainContainer}>
				<SearchBar
					search={search}
					updateSearchHandler={updateSearchHandler}
				/>
				<View style={styles.infoHeaderContainer}>
					{
						filteredData && filteredData.length > 0 &&
						<View style={styles.containerInfo}>
							<View style={styles.containerInfoTruck}>
								<Text style={styles.infoHeader}><MaterialCommunityIcons name="truck-fast" size={24} color={Colors.success[400]}/> {onlyLoadTruck}</Text>
								<Text style={styles.infoHeader}><MaterialCommunityIcons name="truck-check-outline" size={24} color={Colors.yellow[700]}/> {onlyWeiTruck}</Text>
							</View>
							<View style={styles.containerInfoTotal}>
								<Text style={styles.infoHeader}>Lista: {filteredData.length}</Text>
							</View>
						</View>
					}
				</View>
				<ScrollView
					showsVerticalScrollIndicator={false}
					ref={ref}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
							colors={["#9Bd35A", "#689F38"]}
							tintColor={"whitesmoke"}
						/>
					}
				>
					<RomaneioList search={search} data={sentData}
						filteredData={filteredData}
						setFilteredData={setFilteredData}

					/>
				</ScrollView>
			</View>
		);
	}
};

export default RomaneioScreen;

const styles = StyleSheet.create({
	containerInfo:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "flex-end",
		width: '100%',
	},
	containerInfoTruck:{
		flexDirection: 'row',
		gap: 20,
	},
	containerInfoTotal:{},
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
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.primary500,
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
	}
});
