import { FlatList, View, StyleSheet, Text, RefreshControl, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { romaneioSelector } from "../../store/redux/selector";

import CardRomaneio from "../romaneio/CardTruck";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { useScrollToTop } from "@react-navigation/native";

import { Dimensions } from "react-native";
const width = Dimensions.get("window").width; //full width
const height = Dimensions.get("screen").height; //full heihgt

import { formatDate } from "../../utils/formatDate";

import moment from "moment";

const renderRomaneioList = (itemData) => {
	return (
		<CardRomaneio
			data={itemData.item}
			styleContainer={styles.bannerContainer}
		/>
	);
};

const RomaneioList = ({ search, data, filteredData, setFilteredData, handleRefresh, refreshing, HeaderComp }) => {
	// const data = useSelector(romaneioSelector);
	const listRef = useRef(null);

	const [isLoading, setIsLoading] = useState(true);


	useLayoutEffect(() => {
		setFilteredData(data);
		setIsLoading(false);
	}, [data]);

	useEffect(() => {
		if (search) {
			const newArr = filteredData
				.filter((dataFilter) => {
					const formatDate = moment(
						new Date(
							dataFilter.appDate.seconds * 1000 +
							dataFilter.appDate.nanoseconds / 1000000
						)
					).format("DD/MM/YYYY - HH:mm");
					return (
						dataFilter.placa.toLowerCase().includes(search.toLowerCase()) ||
						dataFilter.fazendaOrigem
							.toLowerCase()
							.includes(search.toLowerCase()) ||
						dataFilter.motorista.toLowerCase().includes(search.toLowerCase()) ||
						dataFilter.parcelasNovas
							?.join("")
							.toLowerCase()
							.includes(search.toLowerCase()) ||
						dataFilter.relatorioColheita
							.toString()
							.includes(search.toString()) ||
						dataFilter.ticket
							.toString()
							.includes(search.toString()) ||
						formatDate.includes(search)
					);
				});
			setFilteredData(newArr);
		} else {
			setFilteredData(data);
		}
	}, [search]);

	useScrollToTop(
		useRef({
			scrollToOffset: (params) => listRef.current?.scrollToOffset(params),
		})
	);


	// Show loading indicator if data is still being processed
	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#689F38" />
			</View>
		);
	}

	// Handle empty states
	if (!data.length) {
		return (
			<View style={[styles.adviseContainer, styles.bannerContainer]}>
				<Text style={styles.adviseContainerTitle}>Sem Romaneio Cadastrado</Text>
			</View>
		);
	}

	if (!filteredData.length) {
		return (
			<View style={styles.adviseContainer}>
				<Text style={styles.adviseContainerTitle}>Sem resultados para essa busca</Text>
			</View>
		);
	}
	return (


		<FlatList
			// scrollEnabled={false}
			ref={listRef}
			data={filteredData}
			keyExtractor={(item, i) => item.idApp + i}
			renderItem={renderRomaneioList}
			ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
			contentContainerStyle={{ flexGrow: 1 }}
			ListHeaderComponent={HeaderComp}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={handleRefresh}
					colors={["#9Bd35A", "#689F38"]}
					tintColor={"whitesmoke"}
				/>
			}
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
