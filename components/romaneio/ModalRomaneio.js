import React, { useLayoutEffect, useEffect, useState, memo } from "react";
import {
	View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
	Dimensions, Platform
} from "react-native";
import { useRoute, useNavigation, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { romaneiosFarmSelector, romaneioSelector } from "../../store/redux/selector";
import { ICON_URL, findImg } from "../../utils/imageUrl";
import { formatDateFirebase } from "../../utils/formatDate";

const width = Dimensions.get("window").width;

const Divider = () => <View style={styles.divider} />;

const Section = ({ title, children }) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>{title}</Text>
		<View style={styles.card}>{children}</View>
	</View>
);

const InfoRow = memo(({ label, value, right }) => (
	<View style={styles.row} accessibilityLabel={`${label}: ${value || "—"}`}>
		<Text style={styles.label}>{label}</Text>
		<View style={styles.valueWrap}>
			<Text style={styles.value} numberOfLines={1}>{value || "—"}</Text>
			{right}
		</View>
	</View>
));

const Chip = ({ children }) => (
	<View style={styles.chip}><Text style={styles.chipText}>{children}</Text></View>
);

const formatPercent = (n) =>
	(n === undefined || n === null || n === "") ? "—"
		: `${Number(n).toLocaleString("pt-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

export default function ModalRomaneioScreen({ navigation }) {
	const route = useRoute();
	const id = route.params.data;
	const filtId = route.params.filtId;

	const isFocused = useIsFocused();
	const data = filtId?.length > 5 ? useSelector(romaneiosFarmSelector) : useSelector(romaneioSelector);

	const [dataShow, setDataShow] = useState(null);
	const [prodType, setProdType] = useState(null);
	const [docNumber, setDocNumber] = useState("");

	useLayoutEffect(() => {
		const compData = data.find(d => d.idApp === id);
		setDataShow(compData);
		const p = compData?.parcelasObjFiltered?.map(x => ({ cultura: x?.cultura, mercadoria: x?.variedade }))[0];
		setProdType(p);
	}, [isFocused, data, id]);

	useEffect(() => {
		if (!dataShow) return;
		setDocNumber(dataShow?.relatorioColheita || dataShow?.idApp);
	}, [dataShow]);

	if (!dataShow) return null;

	const peso = (n) => n ? parseInt(n).toLocaleString("pt-br") : "—";
	const placaFmt = `${dataShow.placa?.slice(0, 3)}-${dataShow.placa?.slice(3)}`;
	const dataFmt = dataShow.id ? formatDateFirebase(dataShow) : new Date(dataShow.appDate).toLocaleString("pt-BR").replace(",", " ·");

	const parcelas = dataShow?.parcelasObjFiltered?.map(x => x.parcela)?.join(" - ")?.trim();
	const ticket = dataShow?.ticket || Number(dataShow?.codTicketPro?.replace(/^0+/, ""));

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerHandle} />
				<Text style={styles.headerTitle}>DETALHES DO ROMANEIO</Text>
				<Image source={require("../../assets/diamond.png")} style={styles.brand} />
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
				{/* Banner Nº */}
				<View style={[styles.banner, { backgroundColor: dataShow.id ? "#1E7F34" : "#1B4FA3" }]}>
					<Text style={styles.bannerText}>Nº {docNumber}</Text>
				</View>

				{/* Cabeçalho curto */}
				<Section title="Geral">
					<InfoRow label="Data" value={dataFmt} />
					<Divider />
					<InfoRow label="Placa" value={placaFmt} />
					<Divider />
					<InfoRow label="Motorista" value={(dataShow.motorista || "").trim()} />
					<Divider />
					<InfoRow label="Projeto" value={(dataShow.fazendaOrigem || "").replace("Projeto", "").trim()} />
				</Section>

				{/* Produção */}
				<Section title="Produção">
					<InfoRow
						label="Cultura"
						value={" "}
						right={
							<Image
								source={findImg(ICON_URL, prodType?.cultura)}
								style={{ width: 20, height: 20, marginLeft: 8 }}
							/>
						}
					/>
					<Divider />
					<InfoRow label="Variedade" value={prodType?.mercadoria?.trim()} />
					<Divider />
					<InfoRow label={dataShow?.parcelasObjFiltered?.length > 1 ? "Parcelas" : "Parcela"} value={parcelas} />
					<Divider />
					<InfoRow label="Ticket" value={String(ticket || "—")} />
				</Section>

				{/* Pesagem */}
				{dataShow.id && (
					<Section title="Pesagem">
						<InfoRow label="Peso Bruto" value={peso(dataShow.pesoBruto)} />
						<Divider />
						<InfoRow label="Peso Tara" value={peso(dataShow.tara)} />
						<Divider />
						{
							dataShow?.liquido > 0 ?
								<View style={styles.row}>
									<Text style={styles.label}>Peso Líquido</Text>
									<View style={styles.valueWrap}>
										<View style={styles.pill}>
											<Text style={styles.pillText}>{peso(dataShow.liquido)}</Text>
										</View>
									</View>
								</View>
								:
								<InfoRow label="Peso Líquido" value={""} />


						}

						<Divider />
						<InfoRow label="Umidade" value={formatPercent(dataShow.umidade)} />
						<Divider />
						<InfoRow label="impureza" value={formatPercent(dataShow.impureza)} />
					</Section>
				)}

				{/* Observação */}
				<Section title="Observações">
					<View style={styles.obsBox}>
						<Text style={styles.obsText}>{dataShow?.observacoes?.trim() || "Nenhuma observação"}</Text>
					</View>
				</Section>

				{/* Rodapé/chave */}
				<View style={styles.footer}>
					<Text style={styles.footerKey}>{dataShow.id || dataShow.idApp}</Text>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: 16, paddingTop: Platform.OS === "ios" ? 12 : 6 },
	header: {
		alignItems: "center", marginBottom: 8,
	},
	headerHandle: {
		width: 48, height: 6, borderRadius: 999, backgroundColor: "#DADDE2", marginBottom: 10,
	},
	headerTitle: { fontSize: 14, fontWeight: "700", color: "whitesmoke", letterSpacing: 0.5 },
	brand: { width: 32, height: 32, position: "absolute", right: 0, top: 0, resizeMode: "contain" },

	banner: {
		borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
		alignItems: "center", justifyContent: "center",
		...Platform.select({
			ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 4 } },
			android: { elevation: 3 }
		}),
		marginBottom: 8
	},
	bannerText: { color: "#fff", fontWeight: "800", fontSize: 16, letterSpacing: 0.5 },

	section: { marginTop: 10 },
	sectionTitle: { color: "whitesmoke", fontWeight: "700", marginBottom: 6 },
	card: {
		borderRadius: 14, backgroundColor: "#fff",
		...Platform.select({
			ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
			android: { elevation: 2 }
		})
	},

	row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 6 },
	label: { width: width * 0.34, textAlign: "right", paddingRight: 10, fontWeight: "700", color: "#334155", flexShrink: 0 },
	valueWrap: { flexDirection: "row", alignItems: "center", flex: 1, minWidth: 0 },
	value: { color: "#0F172A", flexShrink: 1 },

	divider: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(51,51,51,0.5)", marginLeft: width * 0.34 + 14 },

	chip: { backgroundColor: "#EEF6EE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
	chipText: { color: "#1E7F34", fontWeight: "600" },

	pill: { backgroundColor: "#ECFDF5", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 6 },
	pillText: { color: "#065F46", fontWeight: "800" },

	obsBox: { paddingHorizontal: 14, paddingVertical: 12 },
	obsText: { color: "#475569" },

	footer: { alignItems: "center", marginTop: 8 },
	footerKey: { fontStyle: "italic", color: "grey", fontWeight: "bold" },
});