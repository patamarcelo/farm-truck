import { View, Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../constants/styles";

function Input({
	label,
	keyboardType,
	secure,
	onUpdateValue,
	value,
	isInvalid,
	inputStyles,
	onBlur,
	placeholder,
	styleInput,
	disabled,
	multilne = false,
	numberOfLines = 2,
	inputContainerProps,
	maxLength
}) {
	return (
		<View style={[styles.inputContainer, inputContainerProps]}>
			<Text style={[styles.label, isInvalid && styles.labelInvalid]}>
				{label}
			</Text>
			<TextInput
				style={[
					styles.input,
					inputStyles,
					isInvalid && styles.inputInvalid,
					styleInput
				]}
				// autoCapitalize={false}
				keyboardType={keyboardType}
				secureTextEntry={secure}
				onChangeText={onUpdateValue}
				value={value}
				onBlur={onBlur}
				placeholder={placeholder}
				editable={!disabled}
				selectTextOnFocus={!disabled}
				multiline={multilne}
				numberOfLines={numberOfLines}
				maxLength={maxLength}
			/>
		</View>
	);
}

export default Input;

const styles = StyleSheet.create({
	inputContainer: {
		marginVertical: 8
	},
	label: {
		color: "white",
		marginBottom: 4
	},
	labelInvalid: {
		color: Colors.error500
	},
	input: {
		paddingVertical: 8,
		paddingHorizontal: 6,
		backgroundColor: Colors.primary100,
		borderRadius: 4,
		fontSize: 16
	},
	inputInvalid: {
		backgroundColor: Colors.error100
	}
});
