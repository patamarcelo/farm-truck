import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library


function Button({ children, onPress, btnStyles, disabled = false, textStyles, hasIcon = false }) {
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
			{
				!hasIcon ?
					<View>
						<Text style={[styles.buttonText, textStyles]}>{children}</Text>
					</View>
					:
					<View style={styles.buttonContent}>
						<Text style={[styles.buttonText, textStyles]}>{children}</Text>
						{/* Right arrow icon */}
						<Icon name="arrow-right" size={20} color={Colors.primary500} style={styles.arrowIcon} />
					</View>
			}
		</Pressable>
	);
}

export default Button;

const styles = StyleSheet.create({
    buttonContent: {
        flexDirection: 'row', // Aligns text and icon horizontally
        justifyContent: 'space-between', // Distributes space between text and icon
        alignItems: 'center', // Vertically aligns text and icon
        flex: 1,
    },
    disabledStyle: {
        opacity: 0.7, // Adjusted opacity for disabled state
    },
    button: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.primary500,
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        flexDirection: 'row', // Ensures the button can have a horizontal layout
        alignItems: 'center', // Vertically aligns text and icon
        justifyContent: 'center', // Centers the content within the button
    },
    pressed: {
        opacity: 0.7, // Button appearance when pressed
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10, // Adds some space between text and icon
    },
});