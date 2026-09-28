import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import CardTruck from "../romaneio/CardTruck";
export default function RomaneioList({
  data,
  refreshing,
  onRefresh,
  ListHeaderComponent,
    ref
}) {
  return (
    <FlatList
      data={data}
      ref={ref}
      keyExtractor={(item) => String(item.id || item.idApp)}
      renderItem={({ item }) => <CardTruck data={item} />}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nenhum romaneio encontrado</Text>
          <Text style={styles.emptyText}>
            Ajuste os filtros ou atualize a lista.
          </Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={[
        styles.content,
        !data.length && styles.emptyContent
      ]}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#176B3A"
          colors={["#176B3A"]}
        />
      }
      initialNumToRender={12}
      windowSize={7}
      removeClippedSubviews
    />
  );
}
const styles = StyleSheet.create({
  content: { paddingVertical: 12, paddingBottom: 24 },
  emptyContent: { flexGrow: 1 },
  empty: { alignItems: "center", justifyContent: "center", padding: 36 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#1C1C1E" },
  emptyText: { marginTop: 5, color: "#6C6C70", textAlign: "center" }
});
