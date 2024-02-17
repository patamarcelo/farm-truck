import { Pressable, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/styles";

const BottomSheetSelect = ({ navigation, onClose, setSelectedFarm, name }) => {
	const handleSelect = (farm) => {
		console.log("selecionar a Fazenda");
		onClose();
		setSelectedFarm(farm);
	};
	return (
		<Pressable
			// onPress={handleSelect.bind(this, data, i)}
			onPress={handleSelect.bind(this, name)}
			style={({ pressed }) => [
				pressed && styles.pressed,
				styles.mainContainer
			]}
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
