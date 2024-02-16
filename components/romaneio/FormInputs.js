import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Text, Animated, Pressable } from "react-native";

import Button from "../ui/Button";
import Input from "../Auth/Input";

import { Controller } from "react-hook-form";

import { Colors } from "../../constants/styles";

import { Ionicons } from "@expo/vector-icons";

import MultiSelect from "react-native-multiple-select";
import { Picker as SelectPicker } from "@react-native-picker/picker";

import { DEST } from "../../store/initialForm";
import { Divider } from "@rneui/themed";

const customData = require("../../store/parcelas.json");

import { useIsFocused } from "@react-navigation/native";
import IconButton from "../ui/IconButton";

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
	setSelectedFarm,
	setValue,
	setSelectedDest,
	selectedDest,
	handlerModal
}) {
	const [selectedItems, setSelectedItems] = useState([]);
	const [parcelasSelected, setParcelasSelected] = useState([]);
	const [filteredFarms, setFilteredFarms] = useState([]);
	const [filteredDest, setFilteredDest] = useState([]);
	const [filteredParcelasFarmObj, setfilteredParcelasFarmObj] = useState([]);
	const [filteInputparcelas, setFilteInputparcelas] = useState([]);

	const isFocused = useIsFocused();

	useLayoutEffect(() => {
		console.log("start");
		const filteredArr = customData.resumo_safra.map((data) => {
			return data.talhao__fazenda__nome;
		});
		const onlyFarms = [...new Set(["Selecione a Fazenda", ...filteredArr])];
		const onlyFarsObj = onlyFarms.map((data) => {
			return { label: data, value: data };
		});
		setFilteredFarms(onlyFarsObj);

		const filtDest = DEST.map((data) => {
			return { label: data, value: data };
		});
		setFilteredDest(filtDest);
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
		setFilteInputparcelas([]);
		return () => setFilteInputparcelas([]);
	}, []);

	useEffect(() => {
		if (selectedFarm && selectedFarm !== "Selecione a Fazenda") {
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
		setValue("parcelasNovas", []);
		if (selectedFarm !== "Selecione a Fazenda") {
			setValue("fazendaOrigem", selectedFarm);
		}
	}, [selectedFarm]);

	useEffect(() => {
		if (selectedFarm && selectedFarm !== "Selecione a Fazenda") {
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
		setValue("parcelasNovas", []);
		if (selectedFarm !== "Selecione a Fazenda") {
			setValue("fazendaOrigem", selectedFarm);
		}
	}, []);

	const onSelectedItemsChange = (items) => {
		console.log("farm", items);
		setSelectedItems(items);
	};

	const handlerChangeSelect = (farm) => {
		console.log("farm", farm);
		setSelectedFarm(farm);
	};
	const handlerChangeSelectDest = (dest) => {
		console.log("Destino", dest);
		setSelectedDest(dest);
		setValue("fazendaDestino", dest);
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
			<Divider width={0.5} color={"white"} style={{ width: "100%" }} />

			<View
				style={[
					styles.pickerView,
					styles.inputContainer,
					errors.fazendaOrigem && styles.errorStyle
				]}
			>
				{
					<Controller
						control={control}
						name="fazendaOrigem"
						render={({ field: { onChange, onBlur, value } }) => (
							<SelectPicker
								selectionColor={"rgba(255,255,255,0.2)"}
								itemStyle={{ color: "whitesmoke" }}
								style={{ height: 100 }}
								selectedValue={selectedFarm}
								onValueChange={(e) => {
									handlerChangeSelect(e, "Parcelas");
								}}
							>
								{filteredFarms.map((data, i) => {
									return (
										<SelectPicker.Item
											key={i}
											label={data.label.replace(
												"Projeto",
												""
											)}
											value={data.value}
										/>
									);
								})}
							</SelectPicker>
						)}
					/>
				}
			</View>
			{errors.fazendaOrigem && (
				<Text style={styles.labelError}>
					{errors.fazendaOrigem?.message}
				</Text>
			)}
			{selectedFarm &&
				selectedFarm !== "Selecione a Fazenda" &&
				parcelasSelected.length > 0 && (
					<>
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
												this.multiSelect._clearSelectorCallback();
											}}
											selectedText={
												value.length > 1
													? "Parcelas selecionadas"
													: "Parcela selecionada"
											}
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
											styleIndicator={{
												bottom: 5,
												left: 10
											}}
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

			{parcelasSelected.length == 0 ||
				(selectedFarm === "Selecione a Fazenda" && (
					<View style={{ marginBottom: 10 }}>
						<Text></Text>
					</View>
				))}

			{parcelasSelected.length > 0 &&
				selectedFarm !== "Selecione a Fazenda" &&
				selectedFarm !== null && (
					<>
						<View style={styles.computedValues}>
							<Controller
								control={control}
								name="cultura"
								render={({
									field: { onChange, onBlur, value }
								}) => (
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
								render={({
									field: { onChange, onBlur, value }
								}) => (
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
						{/* <Pressable
							style={({ pressed }) => [
								pressed && styles.pressed,
								{
									flexDirection: "row",
									alignItems: "center"
								}
							]}
							onPress={handlerModal}
							android_ripple={true}
						>
							<IconButton
								type={"awesome"}
								icon={"plus"}
								color="white"
								size={24}
							/>
							<Text style={{ fontSize: 18, color: "whitesmoke" }}>
								Observações
							</Text>
						</Pressable> */}
						<Divider
							width={0.5}
							color={"white"}
							style={{ width: "100%" }}
						/>
					</>
				)}
			<View
				style={[
					styles.pickerView,
					styles.inputContainer,
					errors.fazendaOrigem && styles.errorStyle
				]}
			>
				{
					<Controller
						control={control}
						name="fazendaDestino"
						render={({ field: { onChange, onBlur, value } }) => (
							<SelectPicker
								selectionColor={"rgba(255,255,255,0.2)"}
								itemStyle={{ color: "whitesmoke" }}
								style={{ height: 100 }}
								selectedValue={selectedDest}
								onValueChange={(e) => {
									handlerChangeSelectDest(e, "Parcelas");
								}}
							>
								{filteredDest.map((data, i) => {
									return (
										<SelectPicker.Item
											key={i}
											label={data.label}
											value={data.value}
										/>
									);
								})}
							</SelectPicker>
						)}
					/>
				}
			</View>

			{errors.fazendaOrigem && (
				<Text style={styles.labelError}>
					{errors.fazendaOrigem?.message}
				</Text>
			)}
			<Controller
				control={control}
				name="observacoes"
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						styleInput={{
							height: 140
						}}
						label="Observações"
						onUpdateValue={onChange}
						value={value}
						// keyboardType="email-address"
						onBlur={onBlur}
						inputStyles={styles.inputStyles}
						// placeholder="Observações"
						multilne={true}
					/>
				)}
			/>
		</View>
	);
}

export default FormInputs;

const styles = StyleSheet.create({
	pressed: {
		opacity: 0.7
	},
	pickerView: {
		width: "100%",
		color: "black",
		justifyContent: "center",
		marginBottom: 90,
		height: 50

		// alignItems: "center"
	},
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
	},
	form: {
		flex: 1,
		justifyContent: "center",
		// alignItems: "center",
		width: "100%"
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
