import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import Button from "../ui/Button";
import Input from "../Auth/Input";

import { Controller } from "react-hook-form";

function FormInputs({ isLogin, onSubmit, control, errors }) {
	return (
		<View style={styles.form}>
			<Controller
				control={control}
				name="placa"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						styleInput={{
							borderWidth: errors.placa && 1,
							borderColor: errors.placa && "#ff375b"
						}}
						label="Placa"
						onUpdateValue={onChange}
						value={value}
						// keyboardType="email-address"
						onBlur={onBlur}
						inputStyles={styles.inputStyles}
						placeholder="Placa"
					/>
				)}
			/>
			{errors.placa && (
				<Text style={styles.labelError}>{errors.placa?.message}</Text>
			)}
			<Controller
				control={control}
				name="motorista"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						styleInput={{
							borderWidth: errors.motorista && 1,
							borderColor: errors.motorista && "#ff375b"
						}}
						label="Motorista"
						onUpdateValue={onChange}
						value={value}
						// keyboardType="email-address"
						onBlur={onBlur}
						inputStyles={styles.inputStyles}
						placeholder="Motorista"
					/>
				)}
			/>
			{errors.motorista && (
				<Text style={styles.labelError}>
					{errors.motorista?.message}
				</Text>
			)}
		</View>
	);
}

export default FormInputs;

const styles = StyleSheet.create({
	inputStyles: {
		backgroundColor: "white"
	},
	buttons: {
		marginTop: 12
	},
	labelError: {
		alignSelf: "flex-start",
		color: "#ff375b",
		marginBottom: 8
	}
});
