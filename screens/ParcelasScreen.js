import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

import Button from '../components/ui/Button'
import { Colors } from '../constants/styles';

import { ICON_URL, findImg } from "../utils/imageUrl";
import { useState, useEffect } from 'react';

const ParcelasScreen = ({ navigation, route }) => {

    const { parcelas } = route.params; // Access the passed parameter

    const [filterModules, setFilterModules] = useState([]);
    const [filteredModule, setFilteredModule] = useState(null);
    const [filtedLetterModule, setFiltedLetterModule] = useState('Geral');


    useEffect(() => {
        if (parcelas) {
            const letters = parcelas.map(item => item.parcela[0]);
            const allLetters = ["Geral", ...letters]
            const uniqueLetters = [...new Set(allLetters)];
            setFilterModules(uniqueLetters)
        }
    }, [parcelas]);



    const handleGOBack = (data) => {
        const { onGoBack } = route.params; // Retrieve the callback function
        if (onGoBack) {
            onGoBack(data); // Send data back
        }
        navigation.goBack(); // Navigate back to the previous screen
    };


    const handlerFilterparcelas = (text) => {
        if (text === 'Geral') {
            setFilteredModule(parcelas)
            setFiltedLetterModule(text)
        }
        if (text && text !== 'Geral') {
            const filteredData = parcelas.filter((item) =>
                item.parcela.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredModule(filteredData);
            setFiltedLetterModule(text)
        } else {
            setFilteredModule(null); // Reset filter if input is cleared
        }
    }


    const renderPacelasList = (itemData) => {
        const { parcela, cultura, variedade, selected } = itemData.item;

        return (
            <View style={[styles.cardContainer, selected && { backgroundColor: Colors.success[200] }]}>
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
                    <View style={styles.shadowContainer}>
                        <Image
                            source={findImg(ICON_URL, cultura)}
                            style={styles.image}
                        />
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'whitesmoke', fontWeight: 'bold' }}>Selecione uma Parcela</Text>

            </View>
            <ScrollView
                contentContainerStyle={styles.containerModule}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                scrollEventThrottle={16} // For smoother scrolling
                


            >
                {
                    filterModules && filterModules.map((data, i) => {
                        return (
                            <Pressable key={i}
                                style={({ pressed }) => [
                                    pressed && styles.pressed,
                                    styles.filteCard,
                                    data === filtedLetterModule && styles.selectedModule
                                ]}
                                onPress={handlerFilterparcelas.bind(this, data)}
                                android_ripple={true}
                            >
                                <View>
                                    <Text style={{fontWeight: 'bold'}}>{data}</Text>
                                </View>
                            </Pressable>
                        )
                    })
                }
            </ScrollView>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Colors.secondary[400], fontWeight: 'bold' }}>Filtre por módulos</Text>
            </View>
            <FlatList
                // scrollEnabled={false}
                data={filteredModule || parcelas} // Use filtered data or original
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
    selectedModule: {
        backgroundColor: Colors.success[200]
    },
    filteCard: {
        backgroundColor: Colors.secondary[200],
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 40,
        width: 60,
    },
    containerModule: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
        flexGrow: 1,
        paddingLeft: 5,
        paddingRight: 5
        // backgroundColor: Colors.primary[800]
    },
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
        opacity: 0.5,
        backgroundColor: Colors.success[200]
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
        resizeMode: 'contain'
    },
    shadowContainer: {
        shadowColor: "#000",  // Shadow color
        shadowOffset: { width: 3, height: 5 },  // Offset for drop shadow effect
        shadowOpacity: 0.4,  // Opacity of shadow
        shadowRadius: 4,  // Spread of shadow
        elevation: 6,  // Required for Android
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
        fontSize: 12,
        color: Colors.secondary[600],
        fontWeight:'bold'
    },
    separator: {
        height: 0,
    },
});
