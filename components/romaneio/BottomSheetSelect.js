import { Pressable, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/styles";
import * as Haptics from 'expo-haptics';

const BottomSheetSelect = ({
	navigation,
	onClose,
	setSelectedFarm,
	name,
	label
}) => {
	const handleSelect = (farm) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		console.log("selecionar a Fazenda");
		setSelectedFarm(farm);
		onClose();
	};
	return (
		<Pressable
			// onPress={handleSelect.bind(this, data, i)}
			onPress={handleSelect.bind(this, label)}
			android_ripple={{ color: 'rgba(255,255,255,0.2)' }}	
			style={({ pressed }) => [
				pressed && styles.pressed,
				styles.mainContainer
			]}
			disabled={name === "Sem Fazendas Liberadas" ? true : false}
		>
			<View style={{ width: "100%" }}>
				<Text style={{ color: "whitesmoke", fontSize: 18 }}>
					{name}
				</Text>
			</View>
		</Pressable>
	);
};

export default BottomSheetSelect;

const styles = StyleSheet.create({
	mainContainer: {
		width: "100%",
		padding: 10,
		borderRadius: 12
		// margin: 5
	},
	pressed: {
		backgroundColor: Colors.primary[500]
	}
});
