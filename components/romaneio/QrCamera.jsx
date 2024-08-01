import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner'


const QrCamera = ({ closeCamera, setQrValues }) => {
    const [scanned, setScanned] = useState(false);
    const [hasPermission, askPermission] = useCameraPermissions();

    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            // Make sure camera is loaded before setting the focus
            if (cameraRef.current) {
                // Set the focus depth to a value that works well for scanning QR codes
                await cameraRef.current?.camera?.setFocusDepth(0); // Adjust this value as needed
            }
        })();
    }, []);

    useEffect(() => {
        askPermission();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        const dataStr = JSON.stringify(data)
        const dataParsed = JSON.parse(dataStr)
        setQrValues(dataParsed)
    };

    useEffect(() => {
        if (scanned) {
            setTimeout(() => {
                closeCamera()
            }, 500)
        }
    }, [scanned]);


    // useEffect(() => {
    //     (async () => {
    //         const { status } = await Camera.requestPermissionsAsync();
    //         setHasPermission(status === 'granted');
    //     })();
    // }, []);



    return (
        <View style={styles.container}>
            {hasPermission?.granted && (
                <CameraView
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    enableTorch={true}
                    ref={cameraRef}
                    style={styles.camera}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}

                >
                    <View style={styles.overlay} />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={closeCamera}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
            {!hasPermission?.granted && (
                <Text style={styles.text}>Permissão de uso da Camera não liberado</Text>
            )}
            {scanned && <Text style={styles.scanText}>Feito!!</Text>}
        </View>
    );
}

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