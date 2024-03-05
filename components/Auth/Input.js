import { View, Text, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
	maxLength,
	register,
	nameRegister,
	hasIcon,
	setshowPassword,
	showPassword
}) {
	return (
		<View style={[styles.inputContainer, inputContainerProps]}>
			<Text style={[styles.label, isInvalid && styles.labelInvalid]}>
				{label}
			</Text>
			{register && (
				<TextInput
					{...register(nameRegister)}
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
			)}
			{!register && hasIcon && (
				<View style={styles.iconCointainer}>
					<TextInput
						style={[
							{ flex: 1 },
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

					<Ionicons
						style={styles.icon}
						name={!showPassword ? "eye" : "eye-off"}
						color={"grey"}
						size={24}
						onPress={setshowPassword}
					/>
				</View>
			)}
			{!register && !hasIcon && (
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
			)}
		</View>
	);
}

export default Input;

const styles = StyleSheet.create({
	icon: {
		position: "absolute",
		right: 10
	},
	iconCointainer: {
		flexDirection: "row",
		// paddingBottom: 10,
		justifyContent: "center",
		alignItems: "center"
	},
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
		height: 40,
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
