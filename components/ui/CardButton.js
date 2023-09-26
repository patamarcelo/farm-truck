import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { ICON_URL } from "../../utils/imageUrl";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";

const CardButton = (props) => {
	const { type, nextUrl } = props;
	const sourceImage = ICON_URL[type].uri;
	const sourceText = ICON_URL[type].title;

	const navigation = useNavigation();

	const handlePress = () => {
		navigation.navigate(nextUrl);
	};
	return (
		<Pressable
			style={({ pressed }) => [
				styles.mainContainer,
				pressed && styles.pressed
			]}
			onPress={handlePress}
		>
			<Image style={styles.image} source={sourceImage} />
			<Text style={styles.text}>{sourceText}</Text>
		</Pressable>
	);
};

export default CardButton;

const styles = StyleSheet.create({
	pressed: {
		opacity: 0.75
	},
	mainContainer: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderColor: "black",
		backgroundColor: Colors.secondary[100],
		paddingVertical: 10,

		shadowColor: "black",
		shadowOpacity: 0.8,
		shadowOffset: { width: 2, height: 4 },
		shadowRadius: 2,
		borderRadius: 20
	},
	image: {
		width: 50,
		height: 50,
		marginRight: 15
	},
	text: {
		fontSize: 18,
		fontWeight: "600",
		fontStyle: "italic"
	}
});
