import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import {
    SafeAreaView,
    useSafeAreaInsets
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import Button from "../components/ui/Button";
import { Colors } from "../constants/styles";
import {
    ICON_URL,
    findImg
} from "../utils/imageUrl";

const getAreaLabel = (item) => {
    const area =
        item?.area ??
        item?.area_ha ??
        item?.areaPlantada ??
        item?.hectares;

    if (
        area === null ||
        area === undefined ||
        area === ""
    ) {
        return null;
    }

    return `${area} ha`;
};

const formatArea = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    return number.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const getAreaDisponivel = (
    areaColheita,
    areaParcial
) => {
    const total = Number(areaColheita) || 0;
    const parcial = Number(areaParcial) || 0;

    return Math.max(total - parcial, 0);
};

export default function ParcelasScreen({
    navigation,
    route
}) {
    const {
        parcelas = [],
        farmName,
        onGoBack
    } = route.params;

    const insets = useSafeAreaInsets();

    const [filtedLetterModule, setFiltedLetterModule] =
        useState("Geral");

    const [selectedParcelas, setSelectedParcelas] =
        useState([]);

    useEffect(() => {
        setSelectedParcelas(
            parcelas.filter(
                (item) =>
                    item?.selected &&
                    !item?.colheita
            )
        );
    }, [parcelas]);

    const filterModules = useMemo(() => {
        const letters = parcelas
            .map((item) =>
                item?.parcela?.[0]?.toUpperCase()
            )
            .filter(Boolean);

        return [
            "Geral",
            ...new Set(letters)
        ];
    }, [parcelas]);

    const visibleParcelas = useMemo(() => {
        if (filtedLetterModule === "Geral") {
            return parcelas;
        }

        return parcelas.filter((item) =>
            item?.parcela
                ?.toUpperCase()
                .startsWith(filtedLetterModule)
        );
    }, [
        parcelas,
        filtedLetterModule
    ]);

    const selectedIds = useMemo(
        () =>
            new Set(
                selectedParcelas.map(
                    (item) => item.parcela
                )
            ),
        [selectedParcelas]
    );

    const toggleParcela = (item) => {
        if (item?.colheita) {
            Alert.alert(
                "Colheita já finalizada",
                `Colheita já finalizada na parcela ${item.parcela}`
            );

            return;
        }

        Haptics.selectionAsync();

        setSelectedParcelas((current) => {
            const alreadySelected = current.some(
                (selected) =>
                    selected.parcela === item.parcela
            );

            if (alreadySelected) {
                return current.filter(
                    (selected) =>
                        selected.parcela !== item.parcela
                );
            }

            return [
                ...current,
                item
            ];
        });
    };

    const confirmSelection = () => {
        if (!selectedParcelas.length) {
            Alert.alert(
                "Selecione uma parcela",
                "Escolha ao menos uma parcela para continuar."
            );

            return;
        }

        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        );

        onGoBack?.(
            selectedParcelas.map(
                ({ selected, ...parcela }) => parcela
            )
        );

        navigation.goBack();
    };

    const handleGoMap = () => {
        Haptics.impactAsync(
            Haptics.ImpactFeedbackStyle.Heavy
        );

        navigation.navigate("MapScreen", {
            onSelectLocation: onGoBack,
            farmName,
            parcelas
        });
    };

    const renderParcela = ({ item }) => {
        const isSelected = selectedIds.has(
            item.parcela
        );

        const isFinished = Boolean(item.colheita);

        const areaLabel = getAreaLabel(item);

        const areaDisponivel =
            getAreaDisponivel(
                item.area,
                item.area_parcial
            );

        return (
            <View
                style={[
                    styles.cardContainer,
                    isSelected && styles.cardSelected,
                    isFinished && styles.cardFinished
                ]}
            >
                <Pressable
                    onPress={() => toggleParcela(item)}
                    style={({ pressed }) => [
                        styles.cardContent,
                        pressed &&
                        !isFinished &&
                        styles.pressed
                    ]}
                >
                    <View
                        style={[
                            styles.checkbox,
                            isSelected &&
                            styles.checkboxSelected,
                            isFinished &&
                            styles.checkboxDisabled
                        ]}
                    >
                        {isSelected && (
                            <Ionicons
                                name="checkmark"
                                size={16}
                                color="#FFFFFF"
                            />
                        )}
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.parcelaName}>
                            {item.parcela}
                        </Text>

                        <Text style={styles.plantedArea}>
                            {item.variedade ||
                                item.cultura ||
                                "Sem variedade informada"}
                        </Text>

                        {areaLabel && (
                            <>
                                <Text style={styles.areaText}>
                                    Área total: {formatArea(item.area)} ha
                                </Text>

                                <Text style={styles.availableAreaText}>
                                    Disponível: {formatArea(areaDisponivel)} ha
                                </Text>
                            </>
                        )}

                        {isFinished && (
                            <Text style={styles.finishedText}>
                                Colheita finalizada
                            </Text>
                        )}
                    </View>

                    <View style={styles.shadowContainer}>
                        <Image
                            source={findImg(
                                ICON_URL,
                                item.cultura
                            )}
                            style={styles.image}
                        />
                    </View>
                </Pressable>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top", "left", "right"]}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Selecione as parcelas
                </Text>

                <Text style={styles.subtitle}>
                    {farmName}
                </Text>
            </View>

            <View style={styles.content}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={
                        styles.containerModule
                    }
                >
                    {filterModules.map((module) => (
                        <Pressable
                            key={module}
                            onPress={() => {
                                Haptics.selectionAsync();
                                setFiltedLetterModule(module);
                            }}
                            style={({ pressed }) => [
                                styles.filterCard,
                                module === filtedLetterModule &&
                                styles.selectedModule,
                                pressed && styles.pressed
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    module === filtedLetterModule &&
                                    styles.filterTextSelected
                                ]}
                            >
                                {module}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <Text style={styles.moduleLabel}>
                    Filtre por módulos
                </Text>

                <FlatList
                    data={visibleParcelas}
                    keyExtractor={(item, index) =>
                        `${item.parcela}-${index}`
                    }
                    renderItem={renderParcela}
                    showsVerticalScrollIndicator
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    contentContainerStyle={{
                        paddingBottom:
                            150 + insets.bottom
                    }}
                />
            </View>

            <View
                style={[
                    styles.buttonContainer,
                    {
                        paddingBottom: Math.max(
                            insets.bottom,
                            12
                        )
                    }
                ]}
            >
                <Button
                    onPress={() => navigation.goBack()}
                    btnStyles={styles.backButton}
                >
                    Voltar
                </Button>

                <Button
                    onPress={confirmSelection}
                    btnStyles={styles.confirmButton}
                >
                    Adicionar
                    {selectedParcelas.length
                        ? ` (${selectedParcelas.length})`
                        : ""}
                </Button>
            </View>

            <View
                style={[
                    styles.fabContainer,
                    {
                        bottom:
                            95 + Math.max(insets.bottom, 12)
                    }
                ]}
            >
                <TouchableOpacity
                    onPress={handleGoMap}
                    style={styles.fab}
                >
                    <Ionicons
                        name="map-outline"
                        size={31}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary500
    },

    titleContainer: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 4
    },

    title: {
        color: "whitesmoke",
        fontWeight: "bold",
        fontSize: 16
    },

    subtitle: {
        marginTop: 2,
        color: "rgba(255,255,255,0.7)",
        fontSize: 12
    },

    content: {
        flex: 1
    },

    containerModule: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 8,
        gap: 12
    },

    filterCard: {
        minWidth: 58,
        height: 40,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: Colors.secondary[200]
    },

    selectedModule: {
        backgroundColor: Colors.success[200]
    },

    filterText: {
        fontWeight: "bold",
        color: "#1C1C1E"
    },

    filterTextSelected: {
        color: Colors.primary[800]
    },

    moduleLabel: {
        color: Colors.secondary[400],
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4
    },

    cardContainer: {
        marginVertical: 5,
        marginHorizontal: 6,
        borderRadius: 10,
        backgroundColor: Colors.secondary[100],
        elevation: 4,
        shadowColor: Colors.primary[900],
        shadowOpacity: 0.1,
        shadowRadius: 6
    },

    cardSelected: {
        backgroundColor: Colors.success[200],
        borderWidth: 1,
        borderColor: Colors.success[500]
    },

    cardFinished: {
        backgroundColor: Colors.secondary[300],
        opacity: 0.85
    },

    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12
    },

    checkbox: {
        width: 23,
        height: 23,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.secondary[600],
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },

    checkboxSelected: {
        backgroundColor: Colors.success[500],
        borderColor: Colors.success[500]
    },

    checkboxDisabled: {
        borderColor: Colors.danger[600]
    },

    textContainer: {
        flex: 1,
        alignItems: "flex-start"
    },

    parcelaName: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.primary
    },

    plantedArea: {
        fontSize: 12,
        color: Colors.secondary[600],
        fontWeight: "bold"
    },

    areaText: {
        marginTop: 3,
        fontSize: 12,
        color: Colors.primary[700],
        fontWeight: "700"
    },

    finishedText: {
        marginTop: 3,
        fontSize: 11,
        fontWeight: "600",
        color: Colors.danger[600]
    },

    image: {
        width: 30,
        height: 30,
        borderRadius: 8,
        resizeMode: "contain"
    },

    shadowContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 3,
            height: 5
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 6
    },

    separator: {
        height: 0
    },

    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: Colors.primary500
    },

    backButton: {
        flex: 1,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.gold[700]
    },

    confirmButton: {
        flex: 1,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.success[400]
    },

    fabContainer: {
        position: "absolute",
        right: 20
    },

    fab: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "rgba(22,48,110,0.9)",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        borderColor: Colors.primary[300],
        borderWidth: 1
    },

    pressed: {
        opacity: 0.7
    },

    availableAreaText: {
        marginTop: 2,
        fontSize: 12,
        color: Colors.success[600],
        fontWeight: "800"
    }
});