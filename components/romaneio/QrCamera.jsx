import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraView, useCameraPermissions } from 'expo-camera/next';


const QrCamera = ({closeCamera, setQrValues}) => {
    const [scanned, setScanned] = useState(false);
    const [hasPermission, askPermission] = useCameraPermissions();

    useEffect(() => {
        askPermission();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        const dataStr = JSON.stringify(data)
        const dataParsed = JSON.parse(dataStr)
        setQrValues(dataParsed)
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    useEffect(() => {
        if(scanned){
            setTimeout(() => {
                closeCamera()
            },500)
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
                <Camera
                    style={styles.camera}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={closeCamera}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            )}
            {!hasPermission?.granted && (
                <Text style={styles.text}>Camera permission not granted</Text>
            )}
            {scanned && <Text style={styles.scanText}>Scanned!</Text>}
        </View>
    );
}

export default QrCamera

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '95%',
        height: '50%',
        justifyContent: 'flex-end'
    },
    cancelText: {
        fontSize: 20,
        textAlign: 'center',
        color:'rgba(244,244,244,0.9)'
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
    buttonContainer:{
        alignItems: 'stretch'
    }
});