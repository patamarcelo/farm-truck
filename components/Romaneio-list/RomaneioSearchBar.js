import { SearchBar } from "react-native-elements";
import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/styles";

const SearchBarComp = () => {
	const [search, setSearch] = useState();

	const updateSearchHandler = (e) => {
		setSearch(e);
		console.log(e);
	};
	return (
		<SafeAreaView style={styles.mainContainer}>
			<View style={styles.mainContainer}>
				<SearchBar
					containerStyle={styles.mainContainerInput}
					inputContainerStyle={styles.inputCont}
					placeholder="Procure um Romaneio"
					onChangeText={updateSearchHandler}
					value={search}
				/>
			</View>
		</SafeAreaView>
	);
};

export default SearchBarComp;

const styles = StyleSheet.create({
	mainContainer: {
		width: "100%",
		paddingVertical: 10,
		paddingHorizontal: 5
	},
	mainContainerInput: {
		width: "100%",
		paddingTop: 10,
		paddingHorizontal: 3,
		borderRadius: 20,
		backgroundColor: Colors.primary500,
		elevation: 0,
		borderBottomWidth: 0,
		borderTopWidth: 0
	},
	inputCont: {
		height: 40,
		borderRadius: 20,
		elevation: 4,

		shadowColor: "black",
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8
	}
});
