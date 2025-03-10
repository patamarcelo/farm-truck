import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';

const QrCamera = ({ closeCamera, setQrValues }) => {
    const [scanned, setScanned] = useState(false);
    const [hasPermission, askPermission] = useCameraPermissions();
    const cameraRef = useRef(null);

    // Request camera permission if not already granted
    useEffect(() => {
        if (!hasPermission?.granted) {
            askPermission();
        }
    }, [hasPermission]);

    // Ensure CameraView is mounted only when permission is granted
    if (hasPermission === null) {
        return <Text style={styles.text}>Verificando permissão da câmera...</Text>;
    }

    const handleBarCodeScanned = ({ type, data }) => {
        if (scanned) return; // Prevent duplicate scans
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        console.log('Scanned:', data);
        setScanned(true);

        try {
            const dataParsed = JSON.parse(JSON.stringify(data));
            console.log('Parsed QR data:', dataParsed);
            setQrValues(dataParsed);
        } catch (error) {
            console.error('Error parsing QR data:', error);
        }

        setTimeout(() => {
            setScanned(false);
            closeCamera();
        }, 750); // Reset scan and close camera after 2 seconds
    };


    return (
        <SafeAreaView style={styles.container}>
            {hasPermission.granted ? (
                <CameraView
                    barcodeScannerEnabled
                    enableTorch={true}
                    ref={cameraRef}
                    style={styles.camera}
                    onBarcodeScanned={handleBarCodeScanned}
                >
                    <View style={styles.overlay} />
                    <View style={styles.buttonContainer}>
                        {
                            !scanned &&
                            <TouchableOpacity style={styles.cancelButton} onPress={closeCamera}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        }
                        {scanned && <Text style={styles.scanText}>Feito!!</Text>}
                    </View>
                </CameraView>

            ) : (
                <Text style={styles.text}>Permissão de uso da câmera não liberada</Text>
            )}

        </SafeAreaView>
    );
};
export default QrCamera

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: '30%', // Adjust this value to position the overlay
        left: '15%', // Adjust this value to position the overlay
        width: '70%',
        height: '28%',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 5,
        opacity: 0.5,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
    },
    camera: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        borderRadius: 12
    },
    cancelText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'rgba(244,244,244,0.9)'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    scanText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 40,
    },
    cameraContainer: {
        width: '80%',
        aspectRatio: 1,
        overflow: 'hidden',
        borderRadius: 10,
        marginBottom: 40,
    },
    button: {
        backgroundColor: 'blue',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        // paddingHorizontal: 20,
        paddingVertical: 10,
        // borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'stretch',
        marginBottom: 40
    }
});