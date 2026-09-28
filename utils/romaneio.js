export const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

export function toDate(value) {
  if (!value) return null;
  if (value?.seconds != null) return new Date(value.seconds * 1000 + (value.nanoseconds || 0) / 1e6);
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function numericValue(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value ?? "").replace(".", "").replace(",", ".").trim();
  return Number(normalized) || 0;
}

export function getRomaneioStatus(item) {
  const bruto = numericValue(item?.pesoBruto);
  const liquido = numericValue(item?.liquido);
  if (!bruto) return "aguardando_pesagem";
  if (!liquido) return "aguardando_liquido";
  if (item?.uploadedToProtheus === false) return "pendente_protheus";
  return "concluido";
}

export const STATUS = {
  aguardando_pesagem: { label: "Aguardando pesagem", color: "#C78300", bg: "#FFF3D6" },
  aguardando_liquido: { label: "Aguardando líquido", color: "#A45A00", bg: "#FFE8C2" },
  pendente_protheus: { label: "Pendente de envio", color: "#1565C0", bg: "#DCEEFF" },
  concluido: { label: "Concluído", color: "#1E7B49", bg: "#DDF5E6" },
};

export function formatPlate(value) {
  const plate = String(value ?? "").replace(/[^a-z0-9]/gi, "").toUpperCase();
  return plate.length > 3 ? `${plate.slice(0, 3)}-${plate.slice(3)}` : plate || "Placa não informada";
}

export function getParcelas(item) {
  return Array.isArray(item?.parcelasObjFiltered)
    ? item.parcelasObjFiltered.filter(Boolean)
    : [];
}

export function matchesRomaneio(item, filters) {
  const query = normalizeText(filters.query);
  const status = getRomaneioStatus(item);
  const parcelas = getParcelas(item);
  const haystack = [
    item?.placa, item?.motorista, item?.fazendaOrigem, item?.relatorioColheita,
    item?.ticket, item?.codTicketPro, item?.classificacao,
    ...parcelas.map((parcela) => parcela?.parcela),
  ].map(normalizeText).join(" ");
  if (query && !haystack.includes(query)) return false;
  if (filters.statuses.length && !filters.statuses.includes(status)) return false;
  if (filters.fazendas.length && !filters.fazendas.includes(item?.fazendaOrigem)) return false;
  if (filters.classificacoes.length && !filters.classificacoes.includes(item?.classificacao)) return false;
  if (filters.parcelas.length && !parcelas.some((p) => filters.parcelas.includes(p?.parcela))) return false;
  const date = toDate(item?.appDate);
  if (filters.from && (!date || date < new Date(`${filters.from}T00:00:00`))) return false;
  if (filters.to && (!date || date > new Date(`${filters.to}T23:59:59`))) return false;
  return true;
}
