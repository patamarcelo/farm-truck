import { FlatList, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { romaneioSelector } from "../../store/redux/selector";

import CardRomaneio from "../romaneio/CardTruck";
import { useLayoutEffect, useState, useEffect } from "react";

const renderRomaneioList = (itemData) => {
	return (
		<CardRomaneio
			data={itemData.item}
			styleContainer={styles.bannerContainer}
		/>
	);
};

const RomaneioList = ({ search }) => {
	const data = useSelector(romaneioSelector);
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
				console.log(dataFilter);
				return (
					dataFilter.placa
						.toLowerCase()
						.includes(search.toLowerCase()) ||
					dataFilter.motorista
						.toLowerCase()
						.includes(search.toLowerCase()) ||
					dataFilter.parcelasNovas
						.join("")
						.toLowerCase()
						.includes(search.toLowerCase())
				);
			});
			setFilteredData(newArr);
		} else {
			setFilteredData(data);
		}
	}, [search]);

	return (
		<FlatList
			data={filteredData}
			keyExtractor={(item) => item.id}
			renderItem={renderRomaneioList}
			ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
		/>
	);
};

export default RomaneioList;

const styles = StyleSheet.create({
	bannerContainer: {
		borderRadius: 12,
		width: "95%",
		alignSelf: "center"
	}
});
