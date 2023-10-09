import { StyleSheet, Text, View, Button } from "react-native";
import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useState, useContext } from "react";

import { AuthContext } from "../store/auth-context";

import RomaneioList from "../components/Romaneio-list/RomaneioList";
import SearchBar from "../components/Romaneio-list/RomaneioSearchBar";

const RomaneioScreen = () => {
	const context = useContext(AuthContext);
	const [search, setSearch] = useState("");

	const updateSearchHandler = (e) => {
		setSearch(e);
		console.log(e);
	};
	return (
		<View style={styles.mainContainer}>
			<SearchBar
				search={search}
				updateSearchHandler={updateSearchHandler}
			/>
			<RomaneioList search={search} />
		</View>
	);
};

export default RomaneioScreen;

const styles = StyleSheet.create({
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "whitesmoke"
	},
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.primary500
	}
});
