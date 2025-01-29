import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
	Modal,
	StyleSheet,
	View,
	Text,
	Animated,
	Pressable
} from "react-native";

import Button from "../ui/Button";
import Input from "../Auth/Input";

import { Controller } from "react-hook-form";

import { Colors } from "../../constants/styles";

import { Ionicons } from "@expo/vector-icons";

import MultiSelect from "react-native-multiple-select";
import { Picker as SelectPicker } from "@react-native-picker/picker";

import { DEST } from "../../store/initialForm";
import { Divider } from "@rneui/themed";


import { useIsFocused } from "@react-navigation/native";
import IconButton from "../ui/IconButton";

import { projetosSelector, plantioDataFromServerSelector } from "../../store/redux/selector";
import { useSelector } from "react-redux";

import { LogBox } from "react-native";
import CaixasParcelas from "./CaixasParcelas";

import * as Haptics from "expo-haptics";

// import { Modal } from "react-native-paper";



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
	handleModal,
	setFilteredFarms,
	filteredFarms,
	filteInputparcelas,
	setFilteInputparcelas,
	setParcelasSelectedObject,
	parcelasSelectedObject,
	obsCheckIcon,
	setObsCheckIcon
}) {
	const [selectedItems, setSelectedItems] = useState([]);
	const [parcelasSelected, setParcelasSelected] = useState([]);
	const [filteredDest, setFilteredDest] = useState([]);
	const [filteredParcelasFarmObj, setfilteredParcelasFarmObj] = useState([]);
	const [openModal, setOpenModal] = useState(false);

	const projetosData = useSelector(projetosSelector);
	const customData = useSelector(plantioDataFromServerSelector)

	const isFocused = useIsFocused();

	const handlerModal = () => {
		setOpenModal(!openModal);
	};

	useEffect(() => {
		LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
	}, []);

	useLayoutEffect(() => {
		console.log("start");
		if (projetosData && customData) {
			const filteredArr = customData?.resumo_safra
				.filter((farm) =>
					projetosData.includes(farm.talhao__fazenda__nome)
				)
				.map((data) => {
					return data.talhao__fazenda__nome;
				});
			// const onlyFarms = [...new Set(["Selecione a Fazenda", ...filteredArr])];
			const onlyFarms = [...new Set([...filteredArr])];
			const onlyFarsObj = onlyFarms.map((data) => {
				return { label: data, value: data };
			});
			setFilteredFarms(onlyFarsObj);

			const filtDest = DEST.map((data) => {
				return { label: data, value: data };
			});
			setFilteredDest(filtDest);
		} else {
			setFilteredFarms([
				{
					label: "Sem Fazendas Liberadas",
					value: "Sem Fazendas Liberadas"
				}
			]);
		}
	}, []);

	useEffect(() => {
		setFilteInputparcelas([]);
		setObsCheckIcon("");
	}, [isFocused]);

	useEffect(() => {
		console.log('Array of Selected Parcelas: ', filteInputparcelas)
		console.log('Array of Selected Parcelas Size: ', filteInputparcelas.length)
		const filInputSelect = filteredParcelasFarmObj.filter((data) =>
			filteInputparcelas.includes(data.parcela)
		);
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
		console.log("parcelas Selected: ", filteInputparcelas);
	}, [filteInputparcelas]);

	const removeparcela = (parcela) => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		const newparcelas = filteInputparcelas.filter(
			(data) => data !== parcela
		);
		setFilteInputparcelas(newparcelas);

		const newObjParcela = parcelasSelectedObject.filter(
			(data) => data.parcela !== parcela
		);
		setParcelasSelectedObject(newObjParcela);
		setValue("parcelasNovas", newparcelas);
	};

	useEffect(() => {
		if (selectedFarm && selectedFarm !== "Selecione a Fazenda") {
			const selectedData = customData?.dados[selectedFarm];
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
					id_plantio: selectedData[data].id_plantio
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
			const selectedData = customData?.dados[selectedFarm];
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
		setSelectedDest(dest);
		setValue("fazendaDestino", dest);
	};

	const handleCaixas = (parcela, caixas) => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		console.log("Parcela", parcela);
		console.log("Caixas", caixas);
		const newObj = parcelasSelectedObject.filter(
			(data) => data.parcela === parcela
		)[0];
		const updateObj = { ...newObj, caixas: caixas };
		const updateObjArr = parcelasSelectedObject.filter(
			(data) => data.parcela !== parcela
		);
		const finalArr = [...updateObjArr, updateObj];
		setParcelasSelectedObject(finalArr);
	};

	useEffect(() => {
		const newArrObj = parcelasSelectedObject.map((data) => data.parcela)
		if (parcelasSelectedObject.length === 0) {
			const filInputSelect = filteredParcelasFarmObj.filter((data) =>
				filteInputparcelas.includes(data.parcela)
			);
			setParcelasSelectedObject(filInputSelect);
		}
		if(filteInputparcelas.length > parcelasSelectedObject.length) {
			const insertParcelas = filteInputparcelas.filter((data) => !newArrObj.includes(data))[0]
			const addParcela = filteredParcelasFarmObj.filter((data) => data.parcela === insertParcelas)[0]
			const newArray = [...parcelasSelectedObject, addParcela]
			setParcelasSelectedObject(newArray);
		}
		if(filteInputparcelas.length < parcelasSelectedObject.length) {
			const insertParcelas = filteInputparcelas.filter((data) => !newArrObj.includes(data))[0]
			const removed = parcelasSelectedObject.filter((data) => data.parcela !==insertParcelas)
			setParcelasSelectedObject(removed);
		}
		if(filteInputparcelas.length === 0){
			setParcelasSelectedObject([]);
		}
	}, [filteInputparcelas]);


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
						onBlur={onBlur}
						inputStyles={styles.inputStyles}
						placeholder="Placa"
						maxLength={7}
						autoComplete={"off"}
						autoCorrect={false}
						keyboardType="visible-password"
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
						onBlur={onBlur}
						inputStyles={styles.inputStyles}
						placeholder="Motorista"
						autoComplete={"off"}
						autoCorrect={false}
						keyboardType="visible-password"
					/>
				)}
			/>
			{errors.motorista && (
				<Text style={styles.labelError}>
					{errors.motorista?.message}
				</Text>
			)}
			<Divider
				width={0.5}
				color={"white"}
				style={{ width: "100%", marginTop: 10 }}
			/>
			<View style={styles.farmSelectButton}>
				<Button
					onPress={handleModal}
					btnStyles={{
						height: 40,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor:
							selectedFarm !== "Selecione a Fazenda" &&
								selectedFarm !== null
								? Colors.success[400]
								: "grey"
					}}
				>
					{selectedFarm ? selectedFarm : "Selecione a Fazenda"}
				</Button>
			</View>
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

			{filteInputparcelas.length > 0 && (
				<>
					<View style={{ alignItems: "center", marginBottom: 5 }}>
						<Text style={{ color: "whitesmoke", fontSize: 14 }}>
							Informe as Caixas de cada Parcela
						</Text>
					</View>
					{parcelasSelectedObject.map((parcela, i) => {
						console.log('parcela: ', parcela)
						return (
							<CaixasParcelas
								key={i}
								parcela={parcela}
								removeparcela={removeparcela}
								handleCaixas={handleCaixas}
							/>
						);
					})}
				</>
			)}
			{parcelasSelected.length == 0 ||
				(selectedFarm === "Selecione a Fazenda" && (
					<View style={{ marginBottom: 10 }}>
						<Text></Text>
					</View>
				))}

			{filteInputparcelas.length > 0 &&
				selectedFarm !== "Selecione a Fazenda" &&
				selectedFarm !== null && (
					<>
						<Pressable
							style={({ pressed }) => [
								pressed && styles.pressed,
								{
									flexDirection: "row",
									alignItems: "center",
									width: "100%",
									height: 60
								}
							]}
							onPress={handlerModal}
							android_ripple={true}
						>
							<IconButton
								type={"awesome"}
								icon={"plus"}
								color="white"
								size={16}
							/>
							<Text style={{ fontSize: 18, color: "whitesmoke" }}>
								Observações
							</Text>
							{obsCheckIcon?.trim().length > 0 && (
								<Ionicons
									name="checkmark-done"
									color={Colors.success[100]}
									size={24}
									style={{ marginLeft: 5 }}
								/>
							)}
						</Pressable>
						<Divider
							width={0.5}
							color={"white"}
							style={{ width: "100%" }}
						/>
					</>
				)}

			{filteInputparcelas.length > 0 && (
				<View style={[styles.pickerView, styles.inputContainer]}>
					{
						<Controller
							control={control}
							name="fazendaDestino"
							render={({
								field: { onChange, onBlur, value }
							}) => (
								<SelectPicker
									selectionColor={"rgba(255,255,255,0.2)"}
									itemStyle={{ color: "whitesmoke" }}
									style={{ height: 100 }}
									selectedValue={value}
									onValueChange={(e) => {
										handlerChangeSelectDest(
											e,
											"fazendaDestino"
										);
										handlerChange(e, "fazendaDestino");
									}}
								>
									{filteredDest.map((data, i) => {
										return (
											<SelectPicker.Item
												style={{
													color: "whitesmoke",
													backgroundColor:
														Colors.primary500
												}}
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
			)}

			{/* {errors.fazendaDestino && (
				<Text style={styles.labelError}>
					{errors.fazendaDestino?.message}
				</Text>
			)} */}
			<Modal
				visible={openModal}
				// presentationStyle="pageSheet"
				animationType="slide"
				transparent={true}
			// cons={{ backgroundColor: Colors.primary[901] }}
			>
				<View
					style={{
						backgroundColor: "rgba(0,0,0,0.75)",
						flex: 1
						// marginTop: 100
					}}
				>
					<Controller
						control={control}
						name="observacoes"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								styleInput={{
									height: 240,
									marginTop: 100
								}}
								// label="Observações"
								onUpdateValue={(e) => {
									setObsCheckIcon(e);
									onChange(e);
								}}
								value={value}
								// keyboardType="email-address"
								onBlur={onBlur}
								inputStyles={styles.inputStyles}
								placeholder="Observações"
								multilne={true}
							/>
						)}
					/>
					<Button
						btnStyles={{
							backgroundColor:
								obsCheckIcon?.trim().length > 0
									? "green"
									: Colors.gold[600]
						}}
						onPress={handlerModal}
					>
						{obsCheckIcon?.trim().length > 0 ? "Salvar" : "Fechar"}
					</Button>
				</View>
			</Modal>
		</View>
	);
}

export default FormInputs;

const styles = StyleSheet.create({
	farmSelectButton: {
		marginVertical: 20
	},
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
		// justifyContent: "c",
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
