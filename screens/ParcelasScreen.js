import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

import Button from '../components/ui/Button'
import { Colors } from '../constants/styles';

import { ICON_URL, findImg } from "../utils/imageUrl";

const ParcelasScreen = ({ navigation, route }) => {

    const { parcelas } = route.params; // Access the passed parameter

    console.log('parcelas router, ', parcelas)


    const handleGOBack = (data) => {
        const { onGoBack } = route.params; // Retrieve the callback function
        if (onGoBack) {
            onGoBack(data); // Send data back
        }
        navigation.goBack(); // Navigate back to the previous screen
    };


    const renderPacelasList = (itemData) => {
        console.log('data', itemData.item)
        const { parcela, cultura, variedade, selected } = itemData.item;

        return (
            <View style={[styles.cardContainer, selected && {backgroundColor: Colors.success[200]}]}>
                <Pressable
                    disabled={selected}
                    onPress={handleGOBack.bind(this, itemData.item)}
                    style={({ pressed }) => [
                        styles.cardContent,
                        pressed && styles.pressed
                    ]}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.parcelaName}>{parcela}</Text>
                        <Text style={styles.plantedArea}>{variedade}</Text>
                    </View>
                    <View>
                        <Image
                            source={findImg(ICON_URL, cultura)}
                            style={styles.image}
                        />
                    </View>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'whitesmoke', fontWeight: 'bold'}}>Selecione uma Parcela</Text>
            </View>
            <FlatList
                // scrollEnabled={false}
                data={parcelas}
                keyExtractor={(item, i) => item.parcela + i}
                renderItem={renderPacelasList}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.flatListContent} // Add padding to the list
            />
            <View style={styles.buttonContainer}>
                <Button
                    onPress={() => navigation.goBack()}
                    btnStyles={{
                        height: 50,
                        marginVertical: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: Colors.gold[700]
                    }}
                >
                    Voltar
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default ParcelasScreen

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute', // Position button at the bottom
        bottom: 0, // Align at the bottom
        left: 0, // Align to the left of the screen
        right: 0, // Stretch to the right of the screen
        marginBottom: 30, // Optional: Add some margin from the bottom
        paddingHorizontal: 20, // Optional: Add some padding on the sides
        backgroundColor: Colors.primary500
    },
    flatListContent: {
        paddingBottom: 70, // Make space for the button at the bottom (adjust as necessary)
    },
    pressed: {
        opacity: 0.5
    },
    container: {
        flex: 1,
    },
    cardContainer: {
        marginVertical: 5,
        marginHorizontal: 6,
        borderRadius: 10,
        backgroundColor: Colors.secondary[100],
        elevation: 4,
        shadowColor: Colors.primary[900],
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 12,
        flex: 1
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 8,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        // backgroundColor: 'red',
        alignItems: 'flex-start'
    },
    parcelaName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    plantedArea: {
        fontSize: 14,
        color: Colors.textGray,
    },
    separator: {
        height: 0,
    },
});
