import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar
} from "react-native";

import {
  useIsFocused,
  useScrollToTop
} from "@react-navigation/native";

import {
  SafeAreaView
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import RomaneioList from "../components/Romaneio-list/RomaneioList";
import RomaneioFiltersSheet, {
  emptyFilters
} from "../components/romaneio/RomaneioFiltersSheet";

import {
  romaneiosFarmSelector,
  createFilteredRomaneiosSelector,
  plantioDataFromServerSelector
} from "../store/redux/selector";

import { addRomaneiosFarm } from "../store/redux/romaneios";
import { getAllDocsFirebase } from "../store/firebase";
import { projetosSelector } from "../store/redux/selector";
import { Colors } from "../constants/styles";

export default function RomaneioScreen() {
  const dispatch = useDispatch();
  const data = useSelector(romaneiosFarmSelector);
  const projetos = useSelector(projetosSelector);
  const [filters, setFilters] = useState(emptyFilters);
  const [openFilters, setOpenFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const selector = useMemo(
    () => createFilteredRomaneiosSelector(filters),
    [filters]
  );
  const visibleData = useSelector(selector);

  const isFocused = useIsFocused();

  const plantioData = useSelector(
    plantioDataFromServerSelector
  );

  const hasPlantioData =
    plantioData &&
    Object.keys(plantioData).length > 0;

  const hasFazendas =
    Array.isArray(projetos) &&
    projetos.length > 0;

  const needsPlantioUpdate =
    !hasPlantioData || !hasFazendas;

  const hasShownUpdateAlertRef =
    useRef(false);

  const activeCount =
    filters.statuses.length +
    filters.fazendas.length +
    filters.parcelas.length +
    filters.classificacoes.length +
    Number(Boolean(filters.from)) +
    Number(Boolean(filters.to));
  const listRef = useRef(null);

  const scrollToTopRef = useRef({
    scrollToTop: () => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: true
      });
    }
  });

  useEffect(() => {
    if (!isFocused) {
      hasShownUpdateAlertRef.current =
        false;

      return;
    }

    if (
      needsPlantioUpdate &&
      !hasShownUpdateAlertRef.current
    ) {
      hasShownUpdateAlertRef.current =
        true;

      Alert.alert(
        "Atenção",
        "Por favor atualizar os dados da colheita"
      );
    }
  }, [
    isFocused,
    needsPlantioUpdate
  ]);

  useScrollToTop(scrollToTopRef);

  const refresh = useCallback(async () => {
    /*
     * Sem projetos carregados, preserva o cache local.
     * Não há motivo para apagar romaneios já existentes.
     */
    if (!hasFazendas) {
      return;
    }

    setRefreshing(true);

    try {
      const result =
        await getAllDocsFirebase(projetos);

      /*
       * Uma resposta vazia, falha de rede ou falha de
       * permissão não pode apagar o último cache válido.
       */
      if (
        Array.isArray(result) &&
        result.length > 0
      ) {
        dispatch(addRomaneiosFarm(result));
      }
    } catch (error) {
      console.log(
        "[Romaneios] Falha ao atualizar; cache preservado:",
        error?.message
      );
    } finally {
      setRefreshing(false);
    }
  }, [
    dispatch,
    hasFazendas,
    projetos
  ]);

  useEffect(() => {
    if (!isFocused || !hasFazendas) {
      return;
    }

    refresh();
  }, [
    isFocused,
    hasFazendas,
    refresh
  ]);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["left", "right", "top"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary800}
        translucent={false}
      />

      <View style={styles.header}>
        <Text style={styles.title}>
          Romaneios
        </Text>

        <Text style={styles.subtitle}>
          {visibleData.length} de {data.length} romaneios
        </Text>

        <View style={styles.controls}>
          <View style={styles.search}>
            <Ionicons
              name="search"
              size={19}
              color="#6C6C70"
            />

            <TextInput
              value={filters.query}
              onChangeText={(query) =>
                setFilters((current) => ({
                  ...current,
                  query
                }))
              }
              placeholder="Placa, motorista, parcela ou ticket"
              placeholderTextColor="#8E8E93"
              style={styles.input}
            />

            {filters.query ? (
              <Pressable
                onPress={() =>
                  setFilters((current) => ({
                    ...current,
                    query: ""
                  }))
                }
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color="#8E8E93"
                />
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={() => setOpenFilters(true)}
            style={styles.filter}
          >
            <Ionicons
              name="options-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.filterText}>
              Filtros{activeCount ? ` (${activeCount})` : ""}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.listArea}>
        <RomaneioList
          data={visibleData}
          refreshing={refreshing}
          onRefresh={refresh}
          ref={listRef}
        />
      </View>

      <RomaneioFiltersSheet
        visible={openFilters}
        filters={filters}
        data={data}
        onClose={() => setOpenFilters(false)}
        onApply={(next) => {
          setFilters(next);
          setOpenFilters(false);
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary800
  },

  listArea: {
    flex: 1,
    backgroundColor: Colors.primary100
  },
  screen: { flex: 1, backgroundColor: "#F2F2F7" },
  header: { backgroundColor: Colors.primary800, padding: 16, paddingBottom: 12 },
  title: { fontSize: 25, fontWeight: "800", color: "whitesmoke" },
  subtitle: { fontSize: 12, color: "whitesmoke", marginTop: 2 },
  controls: { flexDirection: "row", gap: 9, marginTop: 14 },
  search: {
    height: 44,
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 11,
    gap: 7
  },
  input: { flex: 1, color: "#1C1C1E", fontSize: 13 },
  filter: {
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: Colors.primary500
  },
  filterText: { color: "#fff", fontSize: 12, fontWeight: "700" }
});
