import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Alert, Platform } from 'react-native'
import React from 'react'

import Button from '../components/ui/Button'
import { Colors } from '../constants/styles';

import { ICON_URL, findImg } from "../utils/imageUrl";
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { Linking } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';


const ParcelasScreen = ({ navigation, route }) => {

    const { parcelas, farmName, onGoBack } = route.params; // Access the passed parameter
    const insets = useSafeAreaInsets();

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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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
    const handleGoMap = (data) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate("MapScreen",
            {
                onSelectLocation: onGoBack,
                farmName: farmName,
                parcelas: parcelas
            }
        )
            ;
    }

    const renderPacelasList = (itemData) => {
        const { parcela, cultura, variedade, selected, colheita } = itemData.item;

        const isColheitaFinalizada = !!colheita;
        const isDisabled = selected || isColheitaFinalizada;

        return (
            <View
                style={[
                    styles.cardContainer,
                    selected && { backgroundColor: Colors.success[200] },
                    isColheitaFinalizada && { backgroundColor: Colors.secondary[300], opacity: 0.9 },
                ]}
            >
                <Pressable
                    onPress={() => {
                        if (isColheitaFinalizada) {
                            Alert.alert(
                                'Colheita já finalizada',
                                `Colheita já finalizada na parcela ${parcela}`
                            );
                            return;
                        }

                        if (selected) {
                            // já está selecionada, não faz nada
                            return;
                        }

                        handleGOBack(itemData.item);
                    }}
                    style={({ pressed }) => [
                        styles.cardContent,
                        pressed && !isDisabled && styles.pressed,
                    ]}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.parcelaName}>{parcela}</Text>
                        <Text style={styles.plantedArea}>{variedade}</Text>
                        {isColheitaFinalizada && (
                            <Text
                                style={{
                                    fontSize: 11,
                                    fontWeight: '600',
                                    color: Colors.danger[600],
                                    marginTop: 2,
                                }}
                            >
                                Colheita finalizada
                            </Text>
                        )}
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
    };


    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'whitesmoke', fontWeight: 'bold' }}>Selecione uma Parcela do {farmName}</Text>

            </View>
            <View style={styles.content}>


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
                                        <Text style={{ fontWeight: 'bold' }}>{data}</Text>
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
                    contentContainerStyle={[
                        styles.flatListContent,
                        {
                            // altura do botão (50) + paddingBottom do container (30) + safe area
                            paddingBottom: 50 + 30 + insets.bottom + 140,
                        },
                    ]}
                />
            </View>
            <View style={styles.buttonContainer}>
                {/* Botão Voltar */}
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Button
                        onPress={() => navigation.goBack()}
                        btnStyles={{
                            height: 50,
                            marginVertical: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: Colors.gold[700],
                        }}
                    >
                        Voltar
                    </Button>
                </View>
            </View>

            {/* Botão Mapa flutuante */}
            <View style={styles.fabContainer}>
                <TouchableOpacity onPress={handleGoMap} style={styles.fab}>
                    <Ionicons name="map-outline" size={35} color="#fff" />
                </TouchableOpacity>
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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 15,
        flexGrow: 0,
        paddingLeft: 5,
        paddingRight: 5,
        // backgroundColor: Colors.primary[800]
    },
    fabContainer: {
        position: "absolute",
        right: 20,
        bottom: 120
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(22,48,110,0.8)",
        width: 65,
        height: 65,
        borderRadius: 50, // Makes it perfectly circular
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        borderColor: Colors.primary[300],
        borderWidth: 1
    },
    buttonContainer: {
        position: 'absolute', // Position button at the bottom
        bottom: 0, // Align at the bottom
        left: 0, // Align to the left of the screen
        right: 0, // Stretch to the right of the screen
        // marginBottom: 30, // Optional: Add some margin from the bottom
        paddingHorizontal: 20, // Optional: Add some padding on the sides
        paddingBottom: 30,
        backgroundColor: Colors.primary500,
    },
    flatListContent: {
        paddingBottom: 120, // Make space for the button at the bottom (adjust as necessary)
    },
    pressed: {
        opacity: 0.5,
        backgroundColor: Colors.success[200]
    },
    container: {
        flex: 1,
    },
    // content: {
    //     flex: 1,
    //     // nada de justifyContent aqui → padrão já é 'flex-start'
    // },
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
        fontWeight: 'bold'
    },
    separator: {
        height: 0,
    },
});
