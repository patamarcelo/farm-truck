import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import Button from "../ui/Button";
import Input from "../Auth/Input";

import { Controller } from "react-hook-form";

import RNPickerSelect from "react-native-picker-select";
import { Colors } from "../../constants/styles";

import { Ionicons } from "@expo/vector-icons";

import MultiSelect from "react-native-multiple-select";

const items = [
	{ label: "Football", value: "football" },
	{ label: "Baseball", value: "baseball" },
	{ label: "Hockey", value: "hockey" }
];
const items2 = [
	{
		id: "92iijs7yta",
		name: "Ondo"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "a0s0a8ssbsd",
		name: "Ogun"
	},
	{
		id: "16hbajsabsd",
		name: "Calabar"
	},
	{
		id: "nahs75a5sg",
		name: "Lagos"
	},
	{
		id: "667atsas",
		name: "Maiduguri"
	},
	{
		id: "hsyasajs",
		name: "Anambra"
	},
	{
		id: "djsjudksjd",
		name: "Benue"
	},
	{
		id: "sdhyaysdj",
		name: "Kaduna"
	},
	{
		id: "suudydjsjd",
		name: "Abuja"
	}
];

function FormInputs({ isLogin, onSubmit, control, errors, getValues }) {
	const [selectedItems, setSelectedItems] = useState([]);
	const [parcelasSelected, setParcelasSelected] = useState([]);

	const onSelectedItemsChange = (items) => {
		console.log(items);
		setSelectedItems(items);
	};
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

			<Text style={styles.labelPicker}>Selecione uma fazenda</Text>
			<View
				style={[
					styles.input,
					styles.inputContainer,
					errors.fazenda && styles.errorStyle
				]}
			>
				<Controller
					control={control}
					name="fazenda"
					render={({ field: { onChange, onBlur, value } }) => (
						<RNPickerSelect
							onValueChange={onChange}
							placeholder={{ label: "Selecione uma fazenda" }}
							items={items}
							value={value}
							style={pickerSelectStyles}
							Icon={({ color }) => {
								return (
									<Ionicons
										name="arrow-down-circle-outline"
										size={24}
										color="black"
									/>
								);
							}}
						/>
					)}
				/>
			</View>
			{errors.fazenda && (
				<Text style={styles.labelError}>{errors.fazenda?.message}</Text>
			)}
			<Text style={styles.labelPicker}>Selecione as parcelas</Text>
			<View style={styles.pickerMult}>
				<Controller
					control={control}
					name="parcelas"
					render={({ field: { onChange, onBlur, value } }) => (
						<>
							<MultiSelect
								hideTags
								items={items2}
								uniqueKey="id"
								ref={(component) => {
									this.multiSelect = component;
								}}
								onSelectedItemsChange={onChange}
								selectedItems={value}
								selectText="Selecione as Parcelas"
								searchInputPlaceholderText="Procure as Parcelas"
								onChangeInput={(text) => console.log(text)}
								// altFontFamily="ProximaNova-Light"
								tagRemoveIconColor="#CCC"
								tagBorderColor="white"
								tagTextColor="white"
								selectedItemTextColor="#CCC"
								selectedItemIconColor="#CCC"
								itemTextColor="#000"
								displayKey="name"
								searchInputStyle={{ color: "#CCC", padding: 8 }}
								submitButtonColor="black"
								submitButtonText="Confirmar"
								styleDropdownMenuSubsection={{
									borderRadius: 4,
									borderWidth: errors.parcelas && 1,
									borderColor: errors.parcelas && "#ff375b"
								}}
								styleTextDropdown={{ paddingHorizontal: 8 }}
								styleTextDropdownSelected={{
									paddingHorizontal: 8
								}}
								styleDropdownMenu={{ marginTop: 8 }}
								styleIndicator={{ bottom: 5, left: 10 }}
								tagContainerStyle={{
									borderRadius: 8
								}}
								styleItemsContainer={
									{
										// maxHeightheight: "80%"
									}
								}
							/>
							<View>
								{value &&
									this.multiSelect.getSelectedItemsExt(value)}
							</View>
							{errors.parcelas && (
								<Text style={styles.labelError}>
									{errors.parcelas?.message}
								</Text>
							)}
						</>
					)}
				></Controller>
			</View>
		</View>
	);
}

export default FormInputs;

const styles = StyleSheet.create({
	errorStyle: {
		borderWidth: 1,
		borderColor: "#ff375b"
	},
	labelPicker: {
		color: "white",
		marginTop: 8
	},
	inputContainer: {
		marginVertical: 8
	},
	label: {
		color: "black",
		marginBottom: 4
	},
	input: {
		// paddingVertical: 8,
		// paddingHorizontal: 6,
		backgroundColor: "white",
		borderRadius: 4
	},
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

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		paddingVertical: 8,
		paddingHorizontal: 6,
		borderColor: "gray",
		borderRadius: 4,
		color: "black",
		paddingRight: 30 // to ensure the text is never behind the icon
	},
	iconContainer: {
		top: 5,
		right: 15
	},
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: "purple",
		borderRadius: 8,
		color: "black",
		paddingRight: 30 // to ensure the text is never behind the icon
	}
});
