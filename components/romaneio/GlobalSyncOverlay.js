import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { selectSyncingRomaneioId, romaneioSelector } from "../../store/redux/selector";
import { Colors } from "../../constants/styles";
import { formatPlate } from "../../utils/romaneio";

// Renderize uma única vez no App, como irmão do Navigation.
export default function GlobalSyncOverlay() {
  const syncingId = useSelector(selectSyncingRomaneioId);
  const cargas = useSelector(romaneioSelector);
  const romaneio = cargas.find((item) => item.idApp === syncingId);
  return <Modal visible={Boolean(syncingId)} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent presentationStyle="overFullScreen"><View style={styles.backdrop}><View style={styles.card}><ActivityIndicator size="large" color={Colors.primary500}/><Text style={styles.title}>Enviando romaneio</Text><Text style={styles.description}>Aguarde enquanto o arquivo é enviado ao servidor.</Text>{romaneio ? <Text style={styles.details}>{formatPlate(romaneio.placa)} · {romaneio.motorista || "Motorista"}</Text> : null}</View></View></Modal>;
}
const styles=StyleSheet.create({backdrop:{flex:1,backgroundColor:"rgba(0,0,0,.46)",alignItems:"center",justifyContent:"center",padding:28},card:{width:"100%",maxWidth:330,backgroundColor:"#fff",borderRadius:18,padding:26,alignItems:"center"},title:{marginTop:15,fontSize:18,fontWeight:"800",color:"#1C1C1E"},description:{marginTop:7,textAlign:"center",color:"#6C6C70",lineHeight:19},details:{marginTop:16,fontWeight:"700",color:"#3A3A3C"}});
