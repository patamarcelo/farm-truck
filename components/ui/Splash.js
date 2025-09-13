import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Colors } from "../../constants/styles";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
	runOnJS
} from "react-native-reanimated";

import { useEffect, useContext } from "react";
import { AuthContext } from "../../store/auth-context";

// import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const Splash = ({ logIng }) => {
	const context = useContext(AuthContext);

	const toGo = !context.isAuth ? "inicio" : "Login";
	const screen = !context.isAuth ? "Welcome" : "";
	const logoScale = useSharedValue(1);
	const logoPositionY = useSharedValue(0);

	const dimensions = useWindowDimensions();
	// const navigation = useNavigation();

	const getHeight =
		logIng === false ? dimensions.height / 2 + 10 : -dimensions.height;

	const logoAnimatedStyles = useAnimatedStyle(() => ({
		transform: [
			{ scale: logoScale.value },
			{ translateY: logoPositionY.value }
		]
	}));

	const logoAnimation = () => {
		logoScale.value = withSequence(
			withTiming(0.7),
			withTiming(1.3),
			withTiming(1, undefined, (finished) => {
				if (finished) {
					logoPositionY.value = withSequence(
						withTiming(getHeight, { duration: 400 }, (finished) => {
							if (finished) {
								logoScale.value = withSequence(withTiming(0.9));
							}
						})
					);

					// runOnJS(onEndSplash)();
				}
			})
		);
	};

	useEffect(() => {
		logoAnimation();
	}, []);

	// const onEndSplash = () => {
	// 	setTimeout(() => {
	// 		navigation.navigate(toGo, { screen: screen });
	// 	}, 500);
	// };
	return (
		<View style={styles.container}>
			<Animated.Image
				source={require("../../assets/diamond.png")}
				style={[styles.logo, logoAnimatedStyles]}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.primary500,
		justifyContent: "center",
		alignItems: "center"
	},
	logo: {
		width: 70,
		height: 70
	}
});

export default Splash;
