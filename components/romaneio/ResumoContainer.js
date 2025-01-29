import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { romaneioSelector } from "../../store/redux/selector";
import { useLayoutEffect, useState } from "react";
import { Divider } from "react-native-paper";

import { Colors } from "../../constants/styles";

const ResumoContainer = () => {
	const data = useSelector(romaneioSelector);
	const [parcelasArr, setParcelasArr] = useState([]);

	useLayoutEffect(() => {
		const newParcelas = data.map((d) => d.parcelasObjFiltered.map((data) => data.parcela));
		const reducerData = newParcelas
			.flat()
			.sort((a, b) => a.localeCompare(b))
			.reduce((acc, curr) => {
				const filterData = acc.filter((data) => data.parcela === curr);
				if (filterData.length === 0) {
					const objToAdd = {
						parcela: curr,
						quantidade: 1
					};
					acc.push(objToAdd);
				} else {
					const findIndexOf = (data) => data.parcela === curr;
					const getIndex = acc.findIndex(findIndexOf);
					acc[getIndex]["quantidade"] += 1;
				}
				return acc;
			}, []);
		setParcelasArr(reducerData);
	}, [data]);

	return (
		<View style={styles.mainView}>
			{data.length > 0 ? (
				<View style={styles.leftSide}>
					<Text style={styles.resumoTitleNumber}>{data.length}</Text>
					<Text style={styles.resumoTitle}>
						{data.length > 1 ? "Romaneios" : "Romaneio"}
					</Text>
					<Text style={styles.resumoTitle}>
						{data.length > 1 ? "Pendentes" : "Pendente"}
					</Text>
				</View>
			) : (
				<View style={styles.leftSide}>
					<Text style={styles.okTitle}>Atualizado</Text>
				</View>
			)}

			<Divider
				bold={true}
				horizontalInset={true}
				theme={{ colors: { primary: "green" } }}
				style={{ height: "95%", width: 2 }}
			/>
			<View style={styles.rightSide}>
				{parcelasArr.map((data, i) => {
					return (
						<View style={styles.containerQuant} key={i}>
							<Text style={styles.reumoParcela}>
								{data.parcela}
							</Text>
							<Text style={styles.resumoQuanti}>
								{data.quantidade > 1
									? `${data.quantidade} Cargas`
									: `${data.quantidade} Carga`}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
};

export default ResumoContainer;

const styles = StyleSheet.create({
	reumoParcela: {
		fontWeight: "bold"
	},
	containerQuant: {
		flexDirection: "row",
		width: "90%",
		gap: 15
	},
	okTitle: {
		fontSize: 20,
		fontWeight: "500",
		color: Colors.success[600]
	},
	resumoTitleNumber: {
		fontSize: 24,
		fontWeight: "bold"
	},
	leftSide: {
		// backgroundColor: "green",
		flex: 1,
		height: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	rightSide: {
		// backgroundColor: "pink",
		flex: 1,
		height: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	mainView: {
		flexDirection: "row",
		gap: 10,
		flex: 1,
		// backgroundColor: "red",
		justifyContent: "center",
		alignItems: "center",
		width: "100%"
	},
	resumoTitle: {
		// color: "whitesmoke",
		fontWeight: "bold",
		fontSize: 14
	}
});
