import { View, Text, StyleSheet, Image } from "react-native";
import IconButton from "../ui/IconButton";
import { useState, useEffect } from "react";
import { Colors } from "../../constants/styles";
import * as Haptics from "expo-haptics";

import { ICON_URL, findImg } from "../../utils/imageUrl";
import Animated, {
	FadeInUp,
	FadeOutUp,
	Layout
} from "react-native-reanimated";

const CaixasParcelas = (props) => {
	const { parcela, removeparcela, handleCaixas } = props;
	const [valueParcela, setValueParcela] = useState(0);

	useEffect(() => {
		handleCaixas(parcela?.parcela, valueParcela);
	}, [valueParcela]);

	const handleDelete = (parcelaNome) => {
		Haptics.notificationAsync(
			Haptics.NotificationFeedbackType.Success
		);

		setTimeout(() => {
			removeparcela(parcelaNome);
		}, 200);
	};

	return (
		<Animated.View
			style={[
				styles.container,
				valueParcela === 0 && styles.notSelectedCaixas
			]}
			exiting={FadeOutUp.duration(100)}
			entering={FadeInUp.duration(100)}
			layout={Layout.springify().damping(20).stiffness(90)}
		>
			<View style={styles.parcelaContainer}>
				<IconButton
					icon="trash"
					color={Colors.danger[400]}
					size={24}
					onPress={() => handleDelete(parcela?.parcela)}
					btnStyles={styles.iconStylesRemove}
				/>

				<Text
					style={styles.parcelasText}
					numberOfLines={1}
				>
					{parcela?.parcela}
				</Text>

				<Image
					source={findImg(ICON_URL, parcela?.cultura)}
					style={styles.culturaImage}
				/>

				<Text
					style={styles.variedadeText}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{parcela?.variedade}
				</Text>
			</View>

			<View style={styles.containerButtons}>
				<IconButton
					icon="remove-outline"
					color="white"
					size={24}
					disabled={valueParcela === 0}
					onPress={() =>
						setValueParcela((prev) => Math.max(0, prev - 1))
					}
					btnStyles={[
						styles.iconStyles,
						valueParcela === 0 && styles.disabledButton
					]}
				/>

				<Text style={styles.valueField}>{valueParcela}</Text>

				<IconButton
					icon="plus"
					color="white"
					size={24}
					type="paper"
					onPress={() => setValueParcela((prev) => prev + 1)}
					btnStyles={styles.iconStyles}
				/>
			</View>
		</Animated.View>
	);
};

export default CaixasParcelas;

const styles = StyleSheet.create({
	container: {
		alignSelf: "stretch",
		flexDirection: "row",
		alignItems: "center",
		minHeight: 54,
		marginVertical: 5,
		paddingHorizontal: 8,
		backgroundColor: "rgba(248,248,248,0.1)",
		borderRadius: 8
	},
	parcelaContainer: {
		flex: 1,
		minWidth: 0,
		flexDirection: "row",
		alignItems: "center",
		marginRight: 6,
		overflow: "hidden"
	},
	containerButtons: {
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 0
	},
	disabledButton: {
		opacity: 0.5
	},
	notSelectedCaixas: {
		borderWidth: 1,
		borderColor: "red"
	},
	iconStylesRemove: {
		width: 36,
		height: 36,
		flexShrink: 0,
		alignItems: "center",
		justifyContent: "center"
	},
	iconStyles: {
		width: 36,
		height: 36,
		flexShrink: 0,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary[500],
		borderRadius: 5
	},
	parcelasText: {
		color: "whitesmoke",
		fontWeight: "bold",
		flexShrink: 1
	},
	culturaImage: {
		width: 25,
		height: 25,
		marginLeft: 8,
		marginRight: 6,
		flexShrink: 0
	},
	variedadeText: {
		flex: 1,
		minWidth: 0,
		color: "white",
		fontSize: 10,
		marginTop: "auto",
		marginBottom: 4
	},
	valueField: {
		width: 24,
		color: "whitesmoke",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 16
	}
});
