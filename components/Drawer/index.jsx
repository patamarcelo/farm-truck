import React from 'react'

import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Colors } from '../../constants/styles';

import { AuthContext } from '../../store/auth-context';
import { useContext, useState } from 'react';
import { EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN } from "@env";

import { useDispatch } from 'react-redux';
import { setPlantioDataFromServer } from '../../store/redux/romaneios';



const DrawerHome = (props) => {
    const context = useContext(AuthContext);
    const dispatch = useDispatch()
    
    const [loading, setLoading] = useState(false);

    const handleTopButtonPress = async () => {
        setLoading(true); // Show loading indicator
        try {
            // Simulate API request (replace with your actual API call)
            const response = await fetch("https://diamante-quality.up.railway.app/diamante/plantio/get_plantio/", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                dispatch(setPlantioDataFromServer(result))
                // Show success message
                Alert.alert('Feito', 'Dados Atualizados com sucesso!');
            } else {
                // Handle API error response
                Alert.alert('Erro', result.message || 'Alguma coisa deu errado!!');
            }
        } catch (error) {
            // Handle network or other errors
            Alert.alert('Erro', 'Erro ao pegar os dados, Por favor tente novamente');
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };


    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: Colors.primary[100] }}>
            {/* Top Button */}
            <TouchableOpacity 
            style={[styles.topButton, loading && styles.disabledTopButton]}
            onPress={handleTopButtonPress}
            disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Atualizar Colheita</Text>
                )}

            </TouchableOpacity>

            {/* Default Drawer Items */}
            {/* <DrawerItemList {...props} /> */}

            {/* Bottom Button */}
            <TouchableOpacity 
            style={[styles.bottomButton, loading && styles.disabledBottomButton]}
            onPress={() => context.logout()}
            disabled={loading}
            >
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    )
}

export default DrawerHome

const styles = StyleSheet.create({
    topButton: {
        padding: 15,
        backgroundColor: Colors.primary[500],
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 60,
        borderRadius: 10,
    },
    bottomButton: {
        padding: 15,
        backgroundColor: Colors.danger[500],
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 'auto', // Pushes the button to the bottom of the drawer
        marginBottom: 10, // Optional margin for spacing
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledTopButton:{
        backgroundColor: Colors.primary[300]
    },
    disabledBottomButton:{
        backgroundColor: Colors.danger[300]
    }
});
