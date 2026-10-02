export const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export function toDate(value) {
  if (!value) return null;

  if (value?.seconds != null) {
    return new Date(
      value.seconds * 1000 +
      (value.nanoseconds || 0) / 1e6
    );
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

export function numericValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value ?? "")
    .replace(/[^\d,.-]/g, "")
    .trim();

  if (!raw) return 0;

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  let normalized = raw;

  // Ex.: 1.234,56
  if (lastComma > lastDot) {
    normalized = raw
      .replace(/\./g, "")
      .replace(",", ".");
  }

  // Ex.: 1,234.56
  if (lastDot > lastComma) {
    normalized = raw.replace(/,/g, "");
  }

  return Number(normalized) || 0;
}

export function getRomaneioStatus(item) {
  const bruto = numericValue(item?.pesoBruto);
  const liquido = numericValue(item?.liquido);

  if (!bruto) return "aguardando_pesagem";
  if (!liquido) return "aguardando_liquido";

  if (item?.uploadedToProtheus === false) {
    return "pendente_protheus";
  }

  return "concluido";
}

/*
 * Cargas antigas, sem o novo objeto, permanecem pendentes.
 * A classificação nova usa exclusivamente classificacao.status.
 */
export function getStatusClassificacao(item) {
  const status = item?.classificacao?.status;

  return typeof status === "string" &&
    status.trim()
    ? status.trim()
    : "pendente";
}

export const STATUS = {
  aguardando_pesagem: {
    label: "Sem pesagem",
    icon: "truck",
    color: "#7A828A",
    bg: "#EEF0F2"
  },
  aguardando_liquido: {
    label: "Aguardando líquido",
    icon: "truck-outline",
    color: "#C78300",
    bg: "#FFF3D6"
  },
  pendente_protheus: {
    label: "Pendente Protheus",
    icon: "truck-check-outline",
    color: "#1E7B49",
    bg: "#DDF5E6"
  },
  concluido: {
    label: "Enviado ao Protheus",
    icon: "truck-check-outline",
    color: "rgba(102, 204, 153,1)",
    bg: "#DDF5E6"
  }
};

export function formatPlate(value) {
  const plate = String(value ?? "")
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase();

  return plate.length > 3
    ? `${plate.slice(0, 3)}-${plate.slice(3)}`
    : plate || "Placa não informada";
}

export function getParcelas(item) {
  return Array.isArray(item?.parcelasObjFiltered)
    ? item.parcelasObjFiltered.filter(Boolean)
    : [];
}

export const parcelaFilterKey = (fazenda, parcela) =>
  `${fazenda}::${parcela}`;

export function matchesRomaneio(item, filters) {
  const query = normalizeText(filters?.query);
  const status = getRomaneioStatus(item);
  const statusClassificacao =
    getStatusClassificacao(item);
  const parcelas = getParcelas(item);

  const statuses = filters?.statuses || [];
  const fazendas = filters?.fazendas || [];
  const parcelasSelecionadas = filters?.parcelas || [];
  const classificacoes = filters?.classificacoes || [];

  const haystack = [
    item?.placa,
    item?.motorista,
    item?.fazendaOrigem,
    item?.relatorioColheita,
    item?.ticket,
    item?.codTicketPro,

    // Nova estrutura de classificação
    statusClassificacao,
    item?.classificacao?.cultura,
    item?.classificacao?.dados?.classificacaoFinal,

    ...parcelas.map((parcela) => parcela?.parcela)
  ]
    .map(normalizeText)
    .join(" ");

  if (query && !haystack.includes(query)) {
    return false;
  }

  if (
    statuses.length &&
    !statuses.includes(status)
  ) {
    return false;
  }

  if (
    fazendas.length &&
    !fazendas.includes(item?.fazendaOrigem)
  ) {
    return false;
  }

  if (
    parcelasSelecionadas.length &&
    !parcelas.some((parcela) => {
      const key = parcelaFilterKey(
        item?.fazendaOrigem,
        parcela?.parcela
      );

      return (
        parcelasSelecionadas.includes(key) ||
        parcelasSelecionadas.includes(
          parcela?.parcela
        )
      );
    })
  ) {
    return false;
  }

  if (
    classificacoes.length &&
    !classificacoes.includes(
      statusClassificacao
    )
  ) {
    return false;
  }

  const date = toDate(item?.appDate);

  if (
    filters?.from &&
    (
      !date ||
      date < new Date(`${filters.from}T00:00:00`)
    )
  ) {
    return false;
  }

  if (
    filters?.to &&
    (
      !date ||
      date > new Date(`${filters.to}T23:59:59`)
    )
  ) {
    return false;
  }

  return true;
}