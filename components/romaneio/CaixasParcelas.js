import { View, Text, StyleSheet } from "react-native";
import IconButton from "../ui/IconButton";
import { useState, useEffect } from "react";
import { Colors } from "../../constants/styles";
import * as Haptics from "expo-haptics";

const CaixasParcelas = (props) => {
	const { parcela, removeparcela, handleCaixas } = props;
	const [valueParcela, setValueParcela] = useState(0);

	useEffect(() => {
		console.log(valueParcela);
		handleCaixas(parcela, valueParcela);
	}, [valueParcela]);

	return (
		<View style={styles.container}>
			<View style={styles.parcelaContainer}>
				<IconButton
					icon="trash"
					color={Colors.danger[400]}
					size={28}
					onPress={removeparcela.bind(this, parcela)}
					btnStyles={styles.iconStylesRemove}
				/>
				<Text style={styles.parcelasText}>{parcela}</Text>
			</View>
			<View style={styles.containerButtons}>
				<IconButton
					icon="remove-outline"
					color={"white"}
					size={28}
					disabled={valueParcela === 0}
					onPress={() => setValueParcela((prev) => (prev -= 1))}
					btnStyles={styles.iconStyles}
				/>
				<Text style={styles.valueField}>{valueParcela}</Text>
				<IconButton
					icon="plus"
					color={"white"}
					size={28}
					type={"paper"}
					onPress={() => setValueParcela((prev) => (prev += 1))}
					btnStyles={styles.iconStyles}
				/>
			</View>
		</View>
	);
};

export default CaixasParcelas;

const styles = StyleSheet.create({
	iconStylesRemove: {},
	container: {
		flex: 1,
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
		marginVertical: 10,
		paddingHorizontal: 10,
		alignItems: "center",
		backgroundColor: "rgba(248,248,248,0.1)",
		borderRadius: 12
	},
	containerButtons: {
		flexDirection: "row",
		alignItems: "center"
	},
	valueField: {
		color: "whitesmoke",
		marginHorizontal: 10
	},
	parcelasText: {
		color: "whitesmoke",
		fontWeight: "bold"
	},
	iconStyles: {
		backgroundColor: Colors.primary[500],
		borderRadius: 5
		// padding: 1
	},
	parcelaContainer: {
		flexDirection: "row",
		alignItems: "center"
	}
});
