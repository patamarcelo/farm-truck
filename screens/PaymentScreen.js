import { StyleSheet, Text, View } from "react-native";
import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useLayoutEffect } from "react";

const PaymentScreen = () => {
	return (
		<View style={styles.mainContainer}>
			<CardButton type="pix" nextUrl="PIX" />
			<CardButton type="creditCard" nextUrl="CARTAO" />
		</View>
	);
};

export default PaymentScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		gap: 20,
		backgroundColor: Colors.primary[500]
	}
});
