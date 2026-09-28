import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParcelasPickerSheet from "./ParcelasPickerSheet";
import { Colors } from "../../constants/styles";

// Use no FormInputs no lugar do botão que navega para ParcelasScreenRoute.
export default function ParcelasField({ parcelas, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const names = useMemo(() => (value || []).map((item) => item.parcela), [value]);
  return <View style={styles.container}>
    <Text style={styles.label}>Parcelas</Text>
    <Pressable disabled={disabled} onPress={() => setOpen(true)} style={[styles.button, disabled && styles.disabled]}><Ionicons name="layers-outline" size={20} color={Colors.primary500}/><Text style={styles.buttonText}>{names.length ? `${names.length} parcela${names.length > 1 ? "s" : ""} selecionada${names.length > 1 ? "s" : ""}` : "Selecionar parcelas"}</Text><Ionicons name="chevron-forward" size={19} color="#8E8E93"/></Pressable>
    {names.length > 0 && <View style={styles.chips}>{names.map((name) => <View key={name} style={styles.chip}><Text style={styles.chipText}>{name}</Text></View>)}</View>}
    <ParcelasPickerSheet visible={open} parcelas={parcelas} selected={value || []} onClose={() => setOpen(false)} onApply={(selection) => { onChange(selection); setOpen(false); }} />
  </View>;
}
const styles=StyleSheet.create({container:{marginTop:14},label:{color:"#fff",fontWeight:"700",marginBottom:7},button:{height:48,borderRadius:10,backgroundColor:"#fff",paddingHorizontal:14,alignItems:"center",flexDirection:"row",gap:10},disabled:{opacity:.5},buttonText:{flex:1,color:"#1C1C1E",fontWeight:"600"},chips:{flexDirection:"row",flexWrap:"wrap",gap:6,marginTop:8},chip:{backgroundColor:"#DDF5E6",paddingHorizontal:9,paddingVertical:5,borderRadius:12},chipText:{color:"#1E7B49",fontSize:12,fontWeight:"700"}});
