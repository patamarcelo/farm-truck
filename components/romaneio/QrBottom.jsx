import { View, Text, Pressable, StyleSheet } from 'react-native'

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const QrBottomSheet = (props) => {

    const { onClose , goToCamera} = props
    return (

        <View style={styles.container}
        >
            <Pressable
            style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
				styles.iconContainer
			]}
            onPress={goToCamera}
            >
                <AntDesign name="qrcode" size={48} color="white" />
                <Text style={{ color: 'whitesmoke' }}>QrCode</Text>
            </Pressable>
            <Pressable
            style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
				styles.iconContainer
			]}
            onPress={onClose}>
                {/* <Button onPress={onClose}> */}
                    <FontAwesome5 name="keyboard" size={48} color="white" />
                {/* </Button> */}
                    <Text style={{ color: 'whitesmoke' }}>Teclado</Text>
            </Pressable>

        </View>
    );
}

export default QrBottomSheet;

const styles = StyleSheet.create({
    pressed: {
		opacity: 0.7
	},
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 50,
        marginTop: 20
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10
    }
})