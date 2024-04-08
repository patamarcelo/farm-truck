import { SearchBar } from "react-native-elements";
import { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Colors } from "../../constants/styles";

const SearchBarComp = (props) => {
	const { search, updateSearchHandler } = props;
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
				<View style={styles.helperTextContainer}>
					<Text style={styles.helpText}>
						Por Placa, ou Motorista, ou Parcela(s), ou Romaneio, ou Data
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SearchBarComp;

const styles = StyleSheet.create({
	helperTextContainer: {
		marginHorizontal: 20,
		marginTop: -5,
		alignItems: "flex-start"
	},
	helpText: {
		fontSize: 10,
		color: "lightgrey"
	},
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
