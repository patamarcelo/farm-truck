import React, {
  useMemo
} from "react";

import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  useSelector
} from "react-redux";

import {
  romaneioSelector,
  selectSyncingRomaneioId
} from "../../store/redux/selector";

import {
  Colors
} from "../../constants/styles";

function formatPlate(plate) {
  if (!plate) {
    return "Placa não informada";
  }

  const normalized = String(plate)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  if (normalized.length <= 3) {
    return normalized;
  }

  return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
}

export default function GlobalSyncOverlay() {
  const syncingId = useSelector(
    selectSyncingRomaneioId
  );

  const romaneios = useSelector(
    romaneioSelector
  );

  const syncingRomaneio = useMemo(() => {
    if (!syncingId) {
      return null;
    }

    return (
      romaneios.find(
        (item) => item?.idApp === syncingId
      ) || null
    );
  }, [
    romaneios,
    syncingId
  ]);

  return (
    <Modal
      visible={Boolean(syncingId)}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={() => {}}
    >
      <View style={styles.syncOverlay}>
        <View style={styles.syncOverlayCard}>
          <ActivityIndicator
            size="large"
            color={Colors.primary500}
          />

          <Text style={styles.syncOverlayTitle}>
            Enviando romaneio
          </Text>

          <Text style={styles.syncOverlayDescription}>
            Aguarde enquanto o arquivo é enviado
            {"\n"}
            para o servidor.
          </Text>

          {syncingRomaneio ? (
            <View style={styles.syncOverlayDetails}>
              <Text style={styles.syncOverlayPlate}>
                {formatPlate(
                  syncingRomaneio?.placa
                )}
              </Text>

              <Text
                style={styles.syncOverlayDriver}
                numberOfLines={1}
              >
                {syncingRomaneio?.motorista ||
                  "Motorista não informado"}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  syncOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "rgba(0, 0, 0, 0.42)"
  },

  syncOverlayCard: {
    width: "100%",
    maxWidth: 340,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 22,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",

    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 18,
    elevation: 12
  },

  syncOverlayTitle: {
    marginTop: 17,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "700",
    textAlign: "center",
    color: "#1C1C1E"
  },

  syncOverlayDescription: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    color: "#636366"
  },

  syncOverlayDetails: {
    width: "100%",
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 13,
    alignItems: "center",
    backgroundColor: "#F2F2F7"
  },

  syncOverlayPlate: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: "#1C1C1E"
  },

  syncOverlayDriver: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    color: "#636366"
  }
});