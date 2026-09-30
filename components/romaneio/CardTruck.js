import React from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Colors } from "../../constants/styles";
import { ICON_URL, findImg } from "../../utils/imageUrl";
import { formatDate } from "../../utils/formatDate";
import { getParcelas, toDate } from "../../utils/romaneio";
import {
    getRomaneioStatus,
    STATUS
} from "../../utils/romaneio";


const width = Dimensions.get("window").width;

// Mantém a composição visual dos cards anteriores, com acesso seguro aos dados.
export default function CardTruck({ data, styleContainer, isOpendSwipe }) {
    const navigation = useNavigation(),
        parcelas = getParcelas(data),
        first = parcelas[0] || {},
        date = toDate(data?.appDate);
    const hasWeight =
        Number(data?.tara) > 0 ||
        Number(data?.pesoBruto) > 0 ||
        Number(data?.liquido) > 0;
    const complete =
        Boolean(data?.tara) && Boolean(data?.pesoBruto) && Boolean(data?.liquido);
    const ticket =
        data?.ticket ||
        (data?.codTicketPro
            ? Number(String(data.codTicketPro).trim().replace(/^0+/, ""))
            : null);
    const label =
        parcelas
            .map((item) => item?.parcela)
            .filter(Boolean)
            .join(" - ") || "—";

    const statusKey = getRomaneioStatus(data);
    const status = STATUS[statusKey];

    const enviadoAoProtheus =
        statusKey === "concluido";


    return (
        <Pressable
            disabled={isOpendSwipe}
            onPress={() =>
                navigation.navigate("ModalRomaneio", {
                    data: data?.idApp,
                    filtId: data?.id || ""
                })
            }
            style={({ pressed }) => [
                styles.rootContainer,
                styleContainer,
                pressed && styles.pressed
            ]}
        >
            <View style={styles.truckContainer}>
                <View style={styles.iconColumn}>
                    <View style={styles.shadowContainer}>
                        <View>
                            <MaterialCommunityIcons
                                name={status.icon}
                                size={42}
                                color={status.color}
                            />

                            {enviadoAoProtheus && (

                                <MaterialCommunityIcons
                                    name="check-all"
                                    size={15}
                                    color="#00C853"
                                    style={styles.protheusCheck}
                                />

                            )}
                        </View>
                    </View>
                    <Text style={styles.number}>Nº {data?.relatorioColheita || "-"}</Text>
                </View>
                <Text style={styles.date}>
                    {date
                        ? moment(date).format("DD/MM/YY  HH:mm")
                        : formatDate(data?.appDate) || "—"}
                </Text>
            </View>
            <View style={styles.main}>
                <View style={styles.content}>
                    <View style={styles.info}>
                        <View style={styles.row}>
                            <Text style={styles.title}>Motorista: </Text>
                            <Text numberOfLines={1} style={styles.value}>
                                {data?.motorista || "—"}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Placa: </Text>
                            <Text style={styles.value}>
                                {data?.placa
                                    ? `${String(data.placa).slice(0, 3)}-${String(data.placa).slice(3, 12)}`
                                    : "—"}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>
                                {parcelas.length > 1 ? "Parcelas: " : "Parcela: "}
                            </Text>
                            <Text numberOfLines={1} style={styles.parcelas}>
                                {label}
                            </Text>
                        </View>
                        <View style={styles.project}>
                            <Text numberOfLines={1} style={styles.projectText}>
                                {String(data?.fazendaOrigem || "Projeto não informado").replace(
                                    "Projeto ",
                                    ""
                                )}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.right}>
                        {first?.cultura ? (
                            <View style={styles.shadow}>
                                <Image
                                    source={findImg(ICON_URL, first.cultura)}
                                    style={styles.image}
                                />
                            </View>
                        ) : null}
                        <Text numberOfLines={1} style={styles.product}>
                            {first?.variedade || ""}
                        </Text>
                        <Text style={styles.ticketTitle}>Ticket</Text>
                        <Text style={styles.ticket}>{ticket ?? "—"}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    rootContainer: {
        flexDirection: "row",
        width: "100%",
        height: 105,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOpacity: 1,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
        elevation: 6
    },
    pressed: { opacity: 0.5 },
    truckContainer: {
        flex: 1,
        marginLeft: -10,
        paddingRight: 20,
        height: "100%",
        justifyContent: "space-around"
    },
    iconColumn: {
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 20
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 6
    },
    number: {
        fontSize: 10,
        marginLeft: 8,
        color: Colors.secondary[600],
        fontWeight: "bold"
    },
    date: { fontSize: 10, marginLeft: 28, color: "grey", fontWeight: "bold" },
    main: {
        flex: 3,
        justifyContent: "space-around",
        alignItems: "center",
        width
    },
    content: {
        flex: 3,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    info: { justifyContent: "space-around", height: "100%", width: "58%" },
    row: { flexDirection: "row", maxWidth: "100%" },
    title: { fontWeight: "bold", fontSize: 11 },
    value: {
        fontSize: 11,
        fontWeight: "bold",
        color: Colors.secondary[700],
        flexShrink: 1
    },
    parcelas: {
        fontSize: 11,
        flex: 1,
        fontWeight: "bold",
        color: Colors.secondary[600]
    },
    project: {
        backgroundColor: Colors.primary[600],
        padding: 5,
        justifyContent: "center",
        borderRadius: 12,
        alignSelf: "flex-start",
        maxWidth: "100%"
    },
    projectText: { fontWeight: "bold", color: "whitesmoke", fontSize: 10 },
    right: {
        alignSelf: "flex-end",
        paddingRight: 10,
        minWidth: "29%",
        alignItems: "flex-end"
    },
    image: { width: 25, height: 25, resizeMode: "contain" },
    product: {
        fontSize: 11,
        fontWeight: "bold",
        textAlign: "right",
        color: Colors.secondary[600],
        maxWidth: 90
    },
    ticketTitle: {
        fontWeight: "bold",
        fontSize: 9,
        color: Colors.secondary[600],
        marginTop: 4
    },
    ticket: { fontSize: 11, fontWeight: "bold", color: Colors.primary[500] },
    protheusCheck: {
        position: "absolute",
        right: -10,
        bottom: 1,
        textShadowColor: "rgba(0, 85, 40, 0.45)",
        textShadowOffset: {
            width: 0,
            height: 1
        },
        textShadowRadius: 2
    },
});
