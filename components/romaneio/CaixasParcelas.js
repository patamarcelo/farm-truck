import { View, Text, StyleSheet, Image, Animated, Easing } from "react-native";
import IconButton from "../ui/IconButton";
import { useState, useEffect } from "react";
import { Colors } from "../../constants/styles";
import * as Haptics from "expo-haptics";

import { ICON_URL, findImg } from "../../utils/imageUrl";

const CaixasParcelas = (props) => {
	const { parcela, removeparcela, handleCaixas } = props;
	const [valueParcela, setValueParcela] = useState(0);

	useEffect(() => {
		console.log(valueParcela);
		handleCaixas(parcela?.parcela, valueParcela);
	}, [valueParcela]);

	const fadeAnim = new Animated.Value(1); // Initial opacity of 0 (invisible)

	// Trigger the fade-in and fade-out animation on mount/unmount
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (isVisible) {
			// Fade in animation when the component is mounted
			Animated.timing(fadeAnim, {
				toValue: 1, // Fully visible
				duration: 300,
				easing: Easing.ease,
				useNativeDriver: true,
			}).start();
		} else {
			// Fade out animation when the component is unmounted
			Animated.timing(fadeAnim, {
				toValue: 0, // Fully invisible
				duration: 300,
				easing: Easing.ease,
				useNativeDriver: true,
			}).start();
		}
	}, [isVisible]);
	const handleDelete = (parcela) =>{
		setIsVisible(false)
		setTimeout(() => {
			removeparcela(parcela)
		}, 200);
	}

	return (
		<Animated.View style={[{ ...styles.container, opacity: fadeAnim }, valueParcela === 0 && styles.notSelectedCaixas]}>
			<View style={styles.parcelaContainer }>
				<IconButton
					icon="trash"
					color={Colors.danger[400]}
					size={28}
					onPress={handleDelete.bind(this, parcela?.parcela)}
					btnStyles={styles.iconStylesRemove}
				/>
				<Text style={styles.parcelasText}>{parcela?.parcela}</Text>
				<Image
					source={findImg(ICON_URL, parcela?.cultura)}
					style={{ width: 25, height: 25, marginLeft: 30 }}
				/>
				<Text style={styles.variedadeText}>{parcela?.variedade}</Text>
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
		</Animated.View>
	);
};

export default CaixasParcelas;

const styles = StyleSheet.create({
	notSelectedCaixas:{
		borderWidth: 1,
		borderColor: 'red'
	},
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
		marginHorizontal: 10,
		fontWeight: 'bold',
		fontSize: 16
	},
	variedadeText: {
		color: 'white',
		fontSize: 10,
		bottom: 0,
		marginTop: 'auto',
		// marginLeft: -20,
		marginBottom: 4
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
