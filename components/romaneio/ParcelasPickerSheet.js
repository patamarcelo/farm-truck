import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

const unique = (items) => [...new Set(items.filter(Boolean))];

export default function ParcelasPickerSheet({ visible, parcelas = [], selected = [], onClose, onApply }) {
  const [draft, setDraft] = useState([]);
  const [query, setQuery] = useState("");
  const [module, setModule] = useState("Todas");

  useEffect(() => { if (visible) setDraft(selected); }, [visible, selected]);
  const modules = useMemo(() => ["Todas", ...unique(parcelas.map((p) => p?.parcela?.[0]?.toUpperCase()))], [parcelas]);
  const visibleParcelas = useMemo(() => parcelas.filter((item) => {
    const byModule = module === "Todas" || item?.parcela?.toUpperCase().startsWith(module);
    const byQuery = item?.parcela?.toLowerCase().includes(query.trim().toLowerCase());
    return byModule && byQuery;
  }), [parcelas, module, query]);
  const selectedIds = useMemo(() => new Set(draft.map((item) => item.parcela)), [draft]);
  const toggle = (item) => {
    if (item.colheita) return;
    setDraft((current) => selectedIds.has(item.parcela) ? current.filter((p) => p.parcela !== item.parcela) : [...current, item]);
  };
  const selectVisible = () => setDraft((current) => {
    const currentIds = new Set(current.map((item) => item.parcela));
    return [...current, ...visibleParcelas.filter((item) => !item.colheita && !currentIds.has(item.parcela))];
  });

  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.backdrop}><Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}><View><Text style={styles.title}>Selecionar parcelas</Text><Text style={styles.subtitle}>Marque todas as parcelas deste carregamento</Text></View><Pressable onPress={onClose} hitSlop={10}><Ionicons name="close" size={24} color="#1C1C1E" /></Pressable></View>
        <TextInput value={query} onChangeText={setQuery} placeholder="Buscar parcela" placeholderTextColor="#8E8E93" style={styles.search} />
        <FlatList horizontal data={modules} keyExtractor={(item) => item} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modules} renderItem={({ item }) => <Pressable onPress={() => setModule(item)} style={[styles.module, item === module && styles.moduleActive]}><Text style={[styles.moduleText, item === module && styles.moduleTextActive]}>{item}</Text></Pressable>} />
        <View style={styles.tools}><Text style={styles.result}>{visibleParcelas.length} parcelas</Text><Pressable onPress={selectVisible}><Text style={styles.link}>Selecionar visíveis</Text></Pressable></View>
        <FlatList data={visibleParcelas} keyExtractor={(item) => item.parcela} contentContainerStyle={styles.list} renderItem={({ item }) => { const isSelected = selectedIds.has(item.parcela); const disabled = Boolean(item.colheita); return <Pressable disabled={disabled} onPress={() => toggle(item)} style={[styles.item, isSelected && styles.itemSelected, disabled && styles.itemDisabled]}><View style={[styles.check, isSelected && styles.checkSelected]}>{isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}</View><View style={styles.itemText}><Text style={styles.parcela}>{item.parcela}</Text><Text style={styles.detail}>{item.variedade || item.cultura || "Sem cultura informada"}{disabled ? " · Colheita finalizada" : ""}</Text></View></Pressable>; }} />
        <View style={styles.footer}><Pressable onPress={() => setDraft([])}><Text style={styles.clear}>Limpar</Text></Pressable><Pressable onPress={() => onApply(draft)} style={styles.apply}><Text style={styles.applyText}>Aplicar {draft.length ? `(${draft.length})` : ""}</Text></Pressable></View>
      </View>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({ backdrop:{flex:1,justifyContent:"flex-end",backgroundColor:"rgba(0,0,0,.4)"},sheet:{height:"86%",backgroundColor:"#fff",borderTopLeftRadius:24,borderTopRightRadius:24,paddingTop:8},handle:{alignSelf:"center",width:42,height:4,borderRadius:3,backgroundColor:"#D1D1D6"},header:{padding:18,flexDirection:"row",justifyContent:"space-between"},title:{fontSize:20,fontWeight:"700",color:"#1C1C1E"},subtitle:{marginTop:3,color:"#6C6C70",fontSize:13},search:{marginHorizontal:16,borderWidth:1,borderColor:"#E5E5EA",borderRadius:12,paddingHorizontal:12,height:44,color:"#1C1C1E"},modules:{gap:8,padding:16},module:{paddingHorizontal:14,height:34,borderRadius:17,justifyContent:"center",backgroundColor:"#F2F2F7"},moduleActive:{backgroundColor:Colors.primary500},moduleText:{fontWeight:"600",color:"#3A3A3C"},moduleTextActive:{color:"#fff"},tools:{paddingHorizontal:16,flexDirection:"row",justifyContent:"space-between"},result:{color:"#6C6C70"},link:{color:Colors.primary500,fontWeight:"700"},list:{padding:16,gap:8},item:{flexDirection:"row",alignItems:"center",padding:14,borderWidth:1,borderColor:"#E5E5EA",borderRadius:12},itemSelected:{borderColor:Colors.primary500,backgroundColor:"#EDF7F0"},itemDisabled:{opacity:.55,backgroundColor:"#F2F2F7"},check:{width:23,height:23,borderRadius:12,borderWidth:1.5,borderColor:"#AEAEB2",alignItems:"center",justifyContent:"center"},checkSelected:{backgroundColor:Colors.primary500,borderColor:Colors.primary500},itemText:{marginLeft:12,flex:1},parcela:{fontWeight:"700",fontSize:16,color:"#1C1C1E"},detail:{fontSize:12,color:"#6C6C70",marginTop:2},footer:{padding:16,borderTopWidth:1,borderColor:"#E5E5EA",flexDirection:"row",alignItems:"center",justifyContent:"space-between"},clear:{color:"#C62828",fontWeight:"700",padding:10},apply:{backgroundColor:Colors.primary500,borderRadius:12,paddingHorizontal:22,paddingVertical:14},applyText:{color:"#fff",fontWeight:"700"} });
