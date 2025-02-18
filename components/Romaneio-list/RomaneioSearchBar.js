import { SearchBar } from "react-native-elements";
import { useState, useRef, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, Animated } from "react-native";
import { Colors } from "../../constants/styles";

const SearchBarComp = (props) => {
	const { search, updateSearchHandler } = props;
	const slideAnim = useRef(new Animated.Value(-100)).current; // start off-screen (above)

	// State to control visibility
	const [visible, setVisible] = useState(false);

	// Function to slide down (show)
	const slideDown = () => {
		setVisible(true);
		Animated.timing(slideAnim, {
			toValue: 0,
			duration: 250,
			useNativeDriver: true,
		}).start();
	};

	// Function to slide up (hide)
	const slideUp = () => {
		Animated.timing(slideAnim, {
			toValue: -100,
			duration: 250,
			useNativeDriver: true,
		}).start(() => {
			setVisible(false);
		});
	};

	useEffect(() => {
		slideDown()
	}, []);
	return (
		<SafeAreaView style={styles.mainContainer}>
			{visible &&
				<Animated.View style={[styles.mainContainer, { transform: [{ translateY: slideAnim }] }]}>
					<SearchBar
						containerStyle={styles.mainContainerInput}
						inputContainerStyle={styles.inputCont}
						placeholder="Procure um Romaneio"
						onChangeText={updateSearchHandler}
						value={search}
					/>
					<View style={styles.helperTextContainer}>
						<Text style={styles.helpText}>
							Procure por: Placa, Motorista, Parcela, Romaneio, Data, Ticket
							{/* Por Placa, ou Motorista, ou Parcela(s), ou Romaneio, ou Data, ou Ti */}
						</Text>
					</View>
				</Animated.View>
			}
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
