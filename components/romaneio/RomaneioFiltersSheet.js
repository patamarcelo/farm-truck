import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

import { STATUS } from "../../utils/romaneio";
import { Colors } from "../../constants/styles";

export const emptyFilters = {
    query: "",
    statuses: [],
    fazendas: [],
    parcelas: [],
    classificacoes: [],
    from: "",
    to: ""
};

const iso = (date) =>
    `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`;

const fromISO = (value) =>
    value
        ? new Date(`${value}T12:00:00`)
        : new Date();

const dateLabel = (value) =>
    value
        ? fromISO(value).toLocaleDateString("pt-BR")
        : "Selecionar data";

const toggle = (list, value) =>
    list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

const collator = new Intl.Collator("pt-BR", {
    numeric: true,
    sensitivity: "base"
});

const sortNatural = (items) =>
    [...items].sort(collator.compare);

const parcelaKey = (fazenda, parcela) =>
    `${fazenda}::${parcela}`;

function getParcelasPorFazenda(data) {
    const grouped = new Map();

    data.forEach((item) => {
        const fazenda = item?.fazendaOrigem;

        if (!fazenda) {
            return;
        }

        const parcelas =
            item?.parcelasObjFiltered || [];

        const current =
            grouped.get(fazenda) || new Set();

        parcelas.forEach((itemParcela) => {
            if (itemParcela?.parcela) {
                current.add(itemParcela.parcela);
            }
        });

        grouped.set(fazenda, current);
    });

    return [...grouped.entries()]
        .sort(([a], [b]) =>
            collator.compare(a, b)
        )
        .map(([fazenda, parcelas]) => ({
            fazenda,
            parcelas: sortNatural([...parcelas])
        }));
}

function FilterChip({
    label,
    selected,
    onPress
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed
            ]}
        >
            <Text
                style={[
                    styles.chipText,
                    selected && styles.chipTextSelected
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

function FilterSection({
    children,
    style
}) {
    return (
        <View style={[styles.sectionBlock, style]}>
            <View style={styles.sectionInner}>
                {children}
            </View>
        </View>
    );
}


export default function RomaneioFiltersSheet({
    visible,
    filters,
    data = [],
    onClose,
    onApply
}) {
    const scrollRef = useRef(null);

    const [draft, setDraft] =
        useState(filters);

    const [picking, setPicking] =
        useState(null);

    useEffect(() => {
        if (visible) {
            setDraft(filters);
            setPicking(null);
        }
    }, [visible, filters]);

    const fazendas = useMemo(
        () =>
            sortNatural(
                [
                    ...new Set(
                        data
                            .map(
                                (item) =>
                                    item?.fazendaOrigem
                            )
                            .filter(Boolean)
                    )
                ]
            ),
        [data]
    );

    /*
     * Sem fazenda selecionada: mostra todas as parcelas.
     * Com uma ou mais fazendas: mostra somente parcelas
     * pertencentes a elas.
     */
    const dataDasFazendasSelecionadas =
        useMemo(() => {
            if (!draft.fazendas.length) {
                return data;
            }

            return data.filter((item) =>
                draft.fazendas.includes(
                    item?.fazendaOrigem
                )
            );
        }, [data, draft.fazendas]);

    const parcelasPorFazenda = useMemo(
        () =>
            getParcelasPorFazenda(
                dataDasFazendasSelecionadas
            ),
        [dataDasFazendasSelecionadas]
    );

    const classificacoesDisponiveis =
        useMemo(
            () => [
                ...new Set(
                    dataDasFazendasSelecionadas
                        .map((item) => item?.classificacao)
                        .filter(Boolean)
                )
            ],
            [dataDasFazendasSelecionadas]
        );

    const toggleFilter = (key, value) => {
        Haptics.selectionAsync();

        setDraft((current) => ({
            ...current,
            [key]: toggle(current[key], value)
        }));
    };

    const toggleFazenda = (fazenda) => {
        Haptics.selectionAsync();

        setDraft((current) => {
            const nextFazendas = toggle(
                current.fazendas,
                fazenda
            );

            const dataPermitida =
                nextFazendas.length === 0
                    ? data
                    : data.filter((item) =>
                        nextFazendas.includes(
                            item?.fazendaOrigem
                        )
                    );

            const parcelasPermitidas = new Set(
                getParcelasPorFazenda(dataPermitida)
                    .flatMap(({ fazenda, parcelas }) =>
                        parcelas.map((parcela) =>
                            parcelaKey(fazenda, parcela)
                        )
                    )
            );

            /*
             * Se a fazenda foi removida, remove também as
             * parcelas que não pertencem mais à seleção.
             */
            return {
                ...current,
                fazendas: nextFazendas,
                parcelas: current.parcelas.filter(
                    (parcela) =>
                        parcelasPermitidas.has(parcela)
                )
            };
        });
    };

    const openDatePicker = (field) => {
        Haptics.selectionAsync();

        setPicking(field);

        /*
         * Garante que o calendário fique visível depois
         * de expandir o card.
         */
        requestAnimationFrame(() => {
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({
                    animated: true
                });
            }, 150);
        });
    };

    const changeDate = (_, date) => {
        if (Platform.OS === "android") {
            setPicking(null);
        }

        if (date && picking) {
            Haptics.selectionAsync();

            setDraft((current) => ({
                ...current,
                [picking]: iso(date)
            }));
        }
    };

    const clearAndClose = () => {
        Haptics.impactAsync(
            Haptics.ImpactFeedbackStyle.Light
        );

        onApply(emptyFilters);
        onClose();
    };

    const applyFilters = () => {
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        );

        onApply(draft);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />

                <View style={styles.sheet}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>
                                Filtros
                            </Text>

                            <Text style={styles.headerSubtitle}>
                                Refine a lista de romaneios
                            </Text>
                        </View>

                        <Pressable
                            onPress={clearAndClose}
                            style={({ pressed }) => [
                                styles.clearButton,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <Text style={styles.clear}>
                                Limpar
                            </Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator
                        indicatorStyle="black"
                        scrollIndicatorInsets={{ right: 2 }}
                    >
                        <FilterSection style={{ marginTop: 0 }}>

                            <Text style={styles.section}>
                                Status
                            </Text>

                            <View style={styles.wrap}>
                                {Object.entries(STATUS).map(
                                    ([key, item]) => (
                                        <FilterChip
                                            key={key}
                                            label={item.label}
                                            selected={draft.statuses.includes(
                                                key
                                            )}
                                            onPress={() =>
                                                toggleFilter("statuses", key)
                                            }
                                        />
                                    )
                                )}
                            </View>
                        </FilterSection>

                        <FilterSection>


                            <Text style={styles.section}>
                                Fazenda
                            </Text>

                            <View style={styles.wrap}>
                                {fazendas.map((name) => (
                                    <FilterChip
                                        key={name}
                                        label={name.replace("Projeto ", "")}
                                        selected={draft.fazendas.includes(
                                            name
                                        )}
                                        onPress={() =>
                                            toggleFazenda(name)
                                        }
                                    />
                                ))}
                            </View>
                        </FilterSection>
                        <FilterSection>

                            <View style={styles.sectionHeader}>
                                <Text style={styles.section}>
                                    Parcelas
                                </Text>

                                {draft.fazendas.length > 0 && (
                                    <Text style={styles.assistiveText}>
                                        Das fazendas selecionadas
                                    </Text>
                                )}
                            </View>

                            {parcelasPorFazenda.map(
                                ({ fazenda, parcelas }, index) => (
                                    <View
                                        key={fazenda}
                                        style={[
                                            styles.parcelasFarmGroup,
                                            index === 0 &&
                                            styles.parcelasFarmGroupFirst
                                        ]}
                                    >
                                        <Text style={styles.parcelasFarmTitle}>
                                            {fazenda.replace("Projeto ", "")}
                                        </Text>

                                        <View style={styles.wrap}>
                                            {parcelas.map((parcela) => {
                                                const key = parcelaKey(
                                                    fazenda,
                                                    parcela
                                                );

                                                return (
                                                    <FilterChip
                                                        key={key}
                                                        label={parcela}
                                                        selected={draft.parcelas.includes(
                                                            key
                                                        )}
                                                        onPress={() =>
                                                            toggleFilter(
                                                                "parcelas",
                                                                key
                                                            )
                                                        }
                                                    />
                                                );
                                            })}
                                        </View>
                                    </View>
                                )
                            )}
                        </FilterSection>
                        {classificacoesDisponiveis.length > 0 && (
                            <>
                                <Text style={styles.section}>
                                    Classificação
                                </Text>

                                <View style={styles.wrap}>
                                    {classificacoesDisponiveis.map(
                                        (name) => (
                                            <FilterChip
                                                key={name}
                                                label={name}
                                                selected={draft.classificacoes.includes(
                                                    name
                                                )}
                                                onPress={() =>
                                                    toggleFilter(
                                                        "classificacoes",
                                                        name
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </View>
                            </>
                        )}
                        <FilterSection>


                            <Text style={styles.section}>
                                Período
                            </Text>

                            <View
                                style={[
                                    styles.dateCard,
                                    picking && styles.dateCardFocused
                                ]}
                            >
                                <View style={styles.dates}>
                                    <Pressable
                                        onPress={() =>
                                            openDatePicker("from")
                                        }
                                        style={({ pressed }) => [
                                            styles.dateButton,
                                            picking === "from" &&
                                            styles.dateButtonFocused,
                                            pressed && styles.buttonPressed
                                        ]}
                                    >
                                        <Text style={styles.dateKey}>
                                            De
                                        </Text>

                                        <Text style={styles.dateValue}>
                                            {dateLabel(draft.from)}
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() =>
                                            openDatePicker("to")
                                        }
                                        style={({ pressed }) => [
                                            styles.dateButton,
                                            picking === "to" &&
                                            styles.dateButtonFocused,
                                            pressed && styles.buttonPressed
                                        ]}
                                    >
                                        <Text style={styles.dateKey}>
                                            Até
                                        </Text>

                                        <Text style={styles.dateValue}>
                                            {dateLabel(draft.to)}
                                        </Text>
                                    </Pressable>
                                </View>

                                {picking && (
                                    <View style={styles.picker}>
                                        <DateTimePicker
                                            value={fromISO(
                                                draft[picking]
                                            )}
                                            mode="date"
                                            display={
                                                Platform.OS === "ios"
                                                    ? "inline"
                                                    : "default"
                                            }
                                            onChange={changeDate}
                                            themeVariant="light"
                                            textColor="#1C1C1E"
                                            accentColor={Colors.primary500}
                                        />

                                        {Platform.OS === "ios" && (
                                            <Pressable
                                                onPress={() => {
                                                    Haptics.selectionAsync();
                                                    setPicking(null);
                                                }}
                                                style={({ pressed }) => [
                                                    styles.done,
                                                    pressed && styles.buttonPressed
                                                ]}
                                            >
                                                <Text style={styles.doneText}>
                                                    Concluir
                                                </Text>
                                            </Pressable>
                                        )}
                                    </View>
                                )}
                            </View>
                        </FilterSection>
                    </ScrollView>

                    <Pressable
                        onPress={applyFilters}
                        style={({ pressed }) => [
                            styles.apply,
                            pressed && styles.applyPressed
                        ]}
                    >
                        <Text style={styles.applyText}>
                            Ver romaneios
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)"
    },

    sheet: {
        maxHeight: "88%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24
    },

    handle: {
        width: 42,
        height: 4,
        borderRadius: 4,
        backgroundColor: "#D1D1D6",
        alignSelf: "center",
        marginTop: 8
    },

    header: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F2"
    },

    title: {
        fontSize: 21,
        fontWeight: "700",
        color: "#1C1C1E"
    },

    headerSubtitle: {
        marginTop: 2,
        fontSize: 12,
        color: "#6C6C70"
    },

    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 9,
        backgroundColor: "#FFF0F0"
    },

    clear: {
        color: "#C62828",
        fontWeight: "800",
        fontSize: 12
    },

    content: {
        paddingHorizontal: 16,
        paddingBottom: 18
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between"
    },

    section: {
        fontWeight: "700",
        color: "#3A3A3C",
        marginTop: 17,
        marginBottom: 8
    },

    assistiveText: {
        marginBottom: 8,
        fontSize: 11,
        color: Colors.primary500,
        fontWeight: "600"
    },

    wrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },

    chip: {
        borderWidth: 1,
        borderColor: "#D1D1D6",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 11,
        paddingVertical: 8,
        borderRadius: 16
    },

    chipSelected: {
        backgroundColor: Colors.primary500,
        borderColor: Colors.primary500
    },

    chipPressed: {
        opacity: 0.72,
        transform: [{ scale: 0.97 }]
    },

    chipText: {
        color: "#3A3A3C",
        fontWeight: "600",
        fontSize: 12
    },

    chipTextSelected: {
        color: "#FFFFFF"
    },

    dateCard: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#D1D1D6",
        borderRadius: 13,
        backgroundColor: "#FFFFFF"
    },

    dateCardFocused: {
        borderColor: Colors.primary500,
        borderWidth: 2,
        backgroundColor: "#F7FCF8"
    },

    dates: {
        flexDirection: "row",
        gap: 8
    },

    dateButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#E0E0E4",
        backgroundColor: "#F8FAFC",
        borderRadius: 10,
        padding: 11
    },

    dateButtonFocused: {
        borderColor: Colors.primary500,
        backgroundColor: "#EAF7ED"
    },

    dateKey: {
        fontSize: 11,
        color: "#6C6C70",
        fontWeight: "700"
    },

    dateValue: {
        fontSize: 14,
        color: "#1C1C1E",
        marginTop: 3,
        fontWeight: "700"
    },

    picker: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
        paddingTop: 8,
        backgroundColor: "#F8FAFC",
        borderRadius: 10
    },

    done: {
        alignSelf: "flex-end",
        paddingHorizontal: 12,
        paddingVertical: 10
    },

    doneText: {
        color: Colors.primary500,
        fontWeight: "800"
    },

    apply: {
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 26,
        backgroundColor: Colors.primary500,
        borderRadius: 12,
        alignItems: "center",
        padding: 15
    },

    applyPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.985 }]
    },

    applyText: {
        color: "#FFFFFF",
        fontWeight: "800"
    },

    buttonPressed: {
        opacity: 0.7
    },
    parcelasFarmGroup: {
        marginTop: 14,
        paddingTop: 11,
        borderTopWidth: 1,
        borderTopColor: "#ECECF0"
    },

    parcelasFarmGroupFirst: {
        marginTop: 0,
        paddingTop: 0,
        borderTopWidth: 0
    },

    parcelasFarmTitle: {
        marginBottom: 8,
        fontSize: 12,
        fontWeight: "800",
        color: Colors.primary500
    },
    content: {
        paddingBottom: 18
    },

    sectionBlock: {
        width: "100%",
        marginTop: 8,
        paddingVertical: 14,
        backgroundColor: "#F4F5F7",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB"
    },

    sectionInner: {
        paddingHorizontal: 16
    },

    section: {
        marginTop: 0,
        marginBottom: 9,
        fontWeight: "800",
        color: "#3A3A3C"
    },
});