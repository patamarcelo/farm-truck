import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";

function Button({ children, onPress, btnStyles, disabled, textStyles }) {
	return (
		<Pressable
			disabled={disabled}
			style={({ pressed }) => [
				styles.button,
				btnStyles,
				pressed && styles.pressed,
				disabled && styles.disabledStyle
			]}
			onPress={onPress}
		>
			<View>
				<Text style={[styles.buttonText, textStyles]}>{children}</Text>
			</View>
		</Pressable>
	);
}

export default Button;

const styles = StyleSheet.create({
	disabledStyle: {
		opacity: 0.7
	},
	button: {
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: Colors.primary500,
		elevation: 2,
		shadowColor: "black",
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.25,
		shadowRadius: 4
	},
	pressed: {
		opacity: 0.7
	},
	buttonText: {
		textAlign: "center",
		color: "white",
		fontSize: 16,
		fontWeight: "bold"
	}
});
