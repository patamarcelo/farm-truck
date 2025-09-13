import { useMemo } from "react";
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
import { useCallback } from "react";

const renderRomaneioList = (itemData) => {
	return (
		<CardRomaneio
			data={itemData.item}
			styleContainer={styles.bannerContainer}
		/>
	);
};

const RomaneioList = ({ search, data, filteredData, setFilteredData, handleRefresh, refreshing, HeaderComp }) => {
	const listRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);

	useLayoutEffect(() => {
		setFilteredData(data);
		setIsLoading(false);
	}, [data, setFilteredData]);

	useEffect(() => {
		if (!search) {
			setFilteredData(data);
			return;
		}
		const normalized = search.toLowerCase();
		const newArr = data.filter((row) => {
			const appDateStr = moment(
				new Date(row.appDate.seconds * 1000 + row.appDate.nanoseconds / 1e6)
			).format("DD/MM/YYYY - HH:mm");

			return (
				row.placa.toLowerCase().includes(normalized) ||
				row.fazendaOrigem?.toLowerCase().includes(normalized) ||
				row.motorista?.toLowerCase().includes(normalized) ||
				row.parcelasNovas?.join("").toLowerCase().includes(normalized) ||
				row.relatorioColheita?.toString().includes(search) ||
				row.ticket?.toString().includes(search) ||
				appDateStr.includes(search)
			);
		});
		setFilteredData(newArr);
	}, [search, data, setFilteredData]);

	useScrollToTop(
		useRef({ scrollToOffset: (params) => listRef.current?.scrollToOffset(params) })
	);

	const renderItem = useCallback(
		({ item }) => <CardRomaneio data={item} styleContainer={styles.bannerContainer} />,
		[]
	);

	const memoRefreshControl = useMemo(
		() => (
			<RefreshControl
				refreshing={refreshing}
				onRefresh={handleRefresh}
				colors={["#f5f5f5"]}            // Android
				tintColor="#f5f5f5"             // iOS
				progressBackgroundColor="#333"  // Android
			/>
		),
		[refreshing, handleRefresh]
	);

	const isFetching = isLoading || refreshing;


	if (!isFetching && !data.length) {
		return (
			<View style={[styles.adviseContainer, styles.bannerContainer]}>
				<Text style={styles.adviseContainerTitle}>Sem Romaneio Cadastrado</Text>
			</View>
		);
	}

	if (!isFetching && !filteredData.length) {
		return (
			<View style={styles.adviseContainer}>
				<Text style={styles.adviseContainerTitle}>Sem resultados para essa busca</Text>
			</View>
		);
	}

	return (
		<FlatList
			ref={listRef}
			data={filteredData}
			keyExtractor={(item) => String(item.idApp)}
			renderItem={renderItem}
			ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
			contentContainerStyle={{ flexGrow: 1 }}
			ListHeaderComponent={HeaderComp ? <HeaderComp /> : null}

			// refreshing={refreshing}
			// onRefresh={handleRefresh}

			// refreshControl={
			// 	<RefreshControl
			// 		refreshing={refreshing}
			// 		onRefresh={handleRefresh}
			// 		colors={["#f5f5f5"]}       // Android → array de cores
			// 		tintColor="#f5f5f5"        // iOS → cor do spinner
			// 		progressBackgroundColor="#333" // Android → fundo do círculo
			// 	/>
			// }

			refreshControl={memoRefreshControl}

			removeClippedSubviews
			initialNumToRender={10}
			windowSize={7}
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
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: 'red',
		justifyContent: 'center',
		alignItems: 'center'
	}
});
