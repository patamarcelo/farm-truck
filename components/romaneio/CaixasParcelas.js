import { View, Text, StyleSheet, Image, Easing } from "react-native";
import IconButton from "../ui/IconButton";
import { useState, useEffect } from "react";
import { Colors } from "../../constants/styles";
import * as Haptics from "expo-haptics";

import { ICON_URL, findImg } from "../../utils/imageUrl";
import Animated, { BounceIn, BounceOut, FadeIn, FadeInUp, FadeOut, FadeOutUp, Layout} from 'react-native-reanimated';

const CaixasParcelas = (props) => {
	const { parcela, removeparcela, handleCaixas } = props;
	const [valueParcela, setValueParcela] = useState(0);

	useEffect(() => {
		console.log(valueParcela);
		handleCaixas(parcela?.parcela, valueParcela);
	}, [valueParcela]);

	// const fadeAnim = new Animated.Value(1); // Initial opacity of 0 (invisible)

	// Trigger the fade-in and fade-out animation on mount/unmount
	const [isVisible, setIsVisible] = useState(true);

	
	const handleDelete = (parcela) =>{
		setIsVisible(false)
		setTimeout(() => {
			removeparcela(parcela)
		}, 200);
	}

	return (
		<Animated.View
		style={[{ ...styles.container }, valueParcela === 0 && styles.notSelectedCaixas]}
		exiting={FadeOutUp.duration(100)}
		entering={FadeInUp.duration(100)}
		layout={Layout.springify().damping(20).stiffness(90)}
		>
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
					btnStyles={[styles.iconStyles, valueParcela === 0 && styles.disabledButton] }
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
	disabledButton:{
		opacity: 0.5
	},
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
		marginVertical: 5,
		paddingHorizontal: 10,
		alignItems: "center",
		backgroundColor: "rgba(248,248,248,0.1)",
		borderRadius: 8
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
