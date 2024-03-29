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
import { romaneiosFarmSelector } from "../store/redux/selector";

import { Dimensions, RefreshControl } from "react-native";

import { useScrollToTop } from "@react-navigation/native";

import { projetosSelector } from "../store/redux/selector";

const width = Dimensions.get("window").width; //full width

const RomaneioScreen = ({ navigation, route }) => {
	const isFocused = useIsFocused();
	const [sentData, setSentData] = useState([]);
	const dispatch = useDispatch();
	const data = useSelector(romaneiosFarmSelector);

	const [isLoading, seTisLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

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
			console.log("alterando loader para true");
			const getDataFire = async () => {
				try {
					const data = await getAllDocsFirebase(projetosData);
					if (data === false) {
						dispatch(addRomaneiosFarm([]));
						context.logout();
					}
					dispatch(addRomaneiosFarm(data));
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
					<RomaneioList search={search} data={sentData} />
				</ScrollView>
			</View>
		);
	}
};

export default RomaneioScreen;

const styles = StyleSheet.create({
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
