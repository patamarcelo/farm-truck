import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";

import Button from "../ui/Button";
import Input from "../Auth/Input";

import { Controller } from "react-hook-form";

import RNPickerSelect from "react-native-picker-select";
import { Colors } from "../../constants/styles";

import { Ionicons } from "@expo/vector-icons";

import MultiSelect from "react-native-multiple-select";

const customData = require("../../store/parcelas.json");

const FadeInView = (props) => {
	const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true
		}).start();
	}, [fadeAnim]);

	return (
		<Animated.View // Special animatable View
			style={{
				...props.style,
				opacity: fadeAnim // Bind opacity to animated value
			}}
		>
			{props.children}
		</Animated.View>
	);
};

function FormInputs({
	isLogin,
	onSubmit,
	control,
	errors,
	handlerChange,
	selectedFarm,
	setValue
}) {
	const [selectedItems, setSelectedItems] = useState([]);
	const [parcelasSelected, setParcelasSelected] = useState([]);
	const [filteredFarms, setFilteredFarms] = useState([]);
	const [filteredParcelasFarmObj, setfilteredParcelasFarmObj] = useState([]);
	const [filteInputparcelas, setFilteInputparcelas] = useState([]);

	useLayoutEffect(() => {
		console.log("start");
		const filteredArr = customData.resumo_safra.map((data) => {
			return data.talhao__fazenda__nome;
		});
		const onlyFarms = [...new Set([...filteredArr])];
		const onlyFarsObj = onlyFarms.map((data) => {
			return { label: data, value: data };
		});
		setFilteredFarms(onlyFarsObj);
	}, []);

	useEffect(() => {
		const filInputSelect = filteredParcelasFarmObj.filter((data) =>
			filteInputparcelas.includes(data.parcela)
		);
		console.log(filInputSelect);
		const onlyVars = filInputSelect.map((data) => data.variedade);
		const onlyCult = filInputSelect.map((data) => data.cultura);
		setValue("mercadoria", onlyVars[0]);
		setValue("cultura", onlyCult[0]);
	}, [filteInputparcelas]);

	useEffect(() => {
		if (selectedFarm) {
			const selectedData = customData.dados[selectedFarm];
			const filteredArrParcelas = Object.keys(selectedData);
			if (filteredArrParcelas) {
				const parcelasObj = filteredArrParcelas.map((data, i) => {
					return { id: data, name: data };
				});
				setParcelasSelected(parcelasObj);
			}
			let finalArr = [];
			const newFullParcelasObj = Object.keys(selectedData).map((data) => {
				const obj = {
					parcela: data,
					ciclo: selectedData[data].ciclo,
					cultura: selectedData[data].cultura,
					variedade: selectedData[data].variedade,
					colheita: selectedData[data].finalizado_colheita,
					safra: selectedData[data].safra,
					ciclo: selectedData[data].ciclo
				};
				finalArr.push(obj);
			});
			setfilteredParcelasFarmObj(finalArr);
		}
	}, [selectedFarm]);

	const onSelectedItemsChange = (items) => {
		console.log("farm", items);
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
						onUpdateValue={(e) => {
							handlerChange(e, "placa");
							onChange(
								e.replace(/[^a-z0-9]/gi, "").toUpperCase()
							);
						}}
						value={value}
						// keyboardType="email-address"
						onBlur={onBlur}
						inputStyles={styles.inputStyles}
						placeholder="Placa"
						maxLength={7}
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
						onUpdateValue={(e) => {
							handlerChange(e, "motorista");
							onChange(e.toUpperCase());
						}}
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
					errors.fazendaOrigem && styles.errorStyle
				]}
			>
				<Controller
					control={control}
					name="projeto"
					render={({ field: { onChange, onBlur, value } }) => (
						<RNPickerSelect
							onValueChange={(e) => {
								handlerChange(e, "fazenda");
								onChange(e);
							}}
							placeholder={{ label: "Selecione uma fazenda" }}
							items={filteredFarms}
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
			{errors.fazendaOrigem && (
				<Text style={styles.labelError}>
					{errors.fazendaOrigem?.message}
				</Text>
			)}
			{selectedFarm && parcelasSelected.length > 0 && (
				<>
					<Text style={styles.labelPicker}>
						Selecione as parcelas
					</Text>
					<FadeInView style={styles.pickerMult}>
						<Controller
							control={control}
							name="parcelasNovas"
							render={({
								field: { onChange, onBlur, value }
							}) => (
								<>
									<MultiSelect
										hideTags
										items={parcelasSelected}
										uniqueKey="id"
										ref={(component) => {
											this.multiSelect = component;
										}}
										onSelectedItemsChange={(e) => {
											handlerChange(e, "parcelas");
											setFilteInputparcelas(e);
											onChange(e);
										}}
										selectedItems={value}
										selectText="Selecione as Parcelas"
										searchInputPlaceholderText="Procure as Parcelas"
										onChangeInput={(text) =>
											console.log(text)
										}
										// altFontFamily="ProximaNova-Light"
										tagRemoveIconColor="#CCC"
										tagBorderColor="white"
										tagTextColor="white"
										selectedItemTextColor="#CCC"
										selectedItemIconColor="#CCC"
										itemTextColor="#000"
										displayKey="name"
										searchInputStyle={{
											color: "#CCC",
											padding: 8
										}}
										submitButtonColor="black"
										submitButtonText="Confirmar"
										styleDropdownMenuSubsection={{
											borderRadius: 4,
											borderWidth:
												errors.parcelasNovas && 1,
											borderColor:
												errors.parcelasNovas &&
												"#ff375b"
										}}
										styleTextDropdown={{
											paddingHorizontal: 8
										}}
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
											this.multiSelect &&
											this.multiSelect.getSelectedItemsExt(
												value
											)}
									</View>
									{errors.parcelasNovas && (
										<Text style={styles.labelError}>
											{errors.parcelasNovas?.message}
										</Text>
									)}
								</>
							)}
						/>
					</FadeInView>
				</>
			)}
			<View style={styles.computedValues}>
				<Controller
					control={control}
					name="cultura"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							styleInput={{
								backgroundColor: Colors.primary100
							}}
							inputContainerProps={{ width: "48%" }}
							label="Cultura"
							onUpdateValue={onChange}
							value={value}
							// keyboardType="email-address"
							onBlur={onBlur}
							inputStyles={styles.inputStyles}
							placeholder="Cultura"
							disabled={true}
						/>
					)}
				/>
				<Controller
					control={control}
					name="mercadoria"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							styleInput={{
								backgroundColor: Colors.primary100
							}}
							inputContainerProps={{ width: "48%" }}
							label="Variedade"
							onUpdateValue={onChange}
							value={value}
							// keyboardType="email-address"
							onBlur={onBlur}
							inputStyles={styles.inputStyles}
							placeholder="Variedade"
							disabled={true}
						/>
					)}
				/>
			</View>
			<Controller
				control={control}
				name="observacoes"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						styleInput={{
							height: 140
						}}
						label="Observação"
						onUpdateValue={onChange}
						value={value}
						// keyboardType="email-address"
						onBlur={onBlur}
						inputStyles={styles.inputStyles}
						placeholder="Observação"
						multilne={true}
					/>
				)}
			/>
		</View>
	);
}

export default FormInputs;

const styles = StyleSheet.create({
	inputContainerProps: {
		with: "50%"
	},
	computedValues: {
		flexDirection: "row",
		// backgroundColor: "red",
		justifyContent: "space-between"
	},
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
