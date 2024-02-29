import { FlatList, View, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { romaneioSelector } from "../../store/redux/selector";

import CardRomaneio from "../romaneio/CardTruck";
import { useLayoutEffect, useState, useEffect } from "react";

import { Dimensions } from "react-native";
const width = Dimensions.get("window").width; //full width
const height = Dimensions.get("screen").height; //full heihgt

const renderRomaneioList = (itemData) => {
	return (
		<CardRomaneio
			data={itemData.item}
			styleContainer={styles.bannerContainer}
		/>
	);
};

const RomaneioList = ({ search, data }) => {
	// const data = useSelector(romaneioSelector);
	const [filteredData, setFilteredData] = useState([]);
	useLayoutEffect(() => {
		setFilteredData(data);
	}, []);
	useLayoutEffect(() => {
		setFilteredData(data);
	}, [data]);

	useEffect(() => {
		if (search) {
			const newArr = data.filter((dataFilter) => {
				return (
					dataFilter.placa
						.toLowerCase()
						.includes(search.toLowerCase()) ||
					dataFilter.motorista
						.toLowerCase()
						.includes(search.toLowerCase()) ||
					dataFilter.parcelasNovas
						?.join("")
						.toLowerCase()
						.includes(search.toLowerCase()) ||
					dataFilter.relatorioColheita
						.toString()
						.includes(search.toString())
				);
			});
			setFilteredData(newArr);
		} else {
			setFilteredData(data);
		}
	}, [search]);

	if (filteredData.length === 0 && data.length > 0) {
		return (
			<View style={styles.adviseContainer}>
				<Text style={styles.adviseContainerTitle}>
					Sem resultados para essa busca
				</Text>
			</View>
		);
	}
	if (filteredData.length === 0) {
		return (
			<View style={[styles.adviseContainer, styles.bannerContainer]}>
				<Text style={styles.adviseContainerTitle}>
					Sem Romaneio Cadastrado
				</Text>
			</View>
		);
	}

	return (
		<FlatList
			scrollEnabled={false}
			data={filteredData}
			keyExtractor={(item, i) => item.idApp}
			renderItem={renderRomaneioList}
			ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
		/>
	);
};

export default RomaneioList;

const styles = StyleSheet.create({
	adviseContainerTitle: {
		color: "whitesmoke",
		fontSize: 16,
		textAlign: "center",
		marginTop: 200
	},
	adviseContainer: {
		// backgroundColor: "red",
		flex: 1,
		width: width,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	bannerContainer: {
		// borderRadius: 12,
		width: "100%",
		alignSelf: "center"
	}
});
