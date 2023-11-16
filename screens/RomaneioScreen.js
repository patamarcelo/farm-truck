import {
	StyleSheet,
	Text,
	View,
	Button,
	SafeAreaView,
	ScrollView
} from "react-native";
// import { ScrollView } from "react-native-virtualized-view";

import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useState, useContext } from "react";

import { AuthContext } from "../store/auth-context";

import RomaneioList from "../components/Romaneio-list/RomaneioList";
import SearchBar from "../components/Romaneio-list/RomaneioSearchBar";

import { getAllDocsFirebase } from "../store/firebase/index";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { addRomaneiosFarm } from "../store/redux/romaneios";
import { romaneiosFarmSelector } from "../store/redux/selector";

import { Dimensions } from "react-native";
const width = Dimensions.get("window").width; //full width

const RomaneioScreen = ({ navigation, route }) => {
	const isFocused = useIsFocused();
	const [sentData, setSentData] = useState([]);
	const dispatch = useDispatch();
	const data = useSelector(romaneiosFarmSelector);
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
		const getDataFire = async () => {
			const data = await getAllDocsFirebase("Projeto Capivara");
			dispatch(addRomaneiosFarm(data));
			return data;
		};
		if (isFocused) {
			console.log("isFocused", isFocused);
			getDataFire();
		}
	}, [isFocused]);

	const context = useContext(AuthContext);
	const [search, setSearch] = useState("");

	const updateSearchHandler = (e) => {
		setSearch(e);
	};
	return (
		<View style={styles.mainContainer}>
			<SearchBar
				search={search}
				updateSearchHandler={updateSearchHandler}
			/>
			<ScrollView>
				<RomaneioList search={search} data={sentData} />
			</ScrollView>
		</View>
	);
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
		width: width,
		padding: 2,

		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.primary500
	}
});
