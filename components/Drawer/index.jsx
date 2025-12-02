// DrawerHome.jsx
import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Colors } from '../../constants/styles';
import { AuthContext } from '../../store/auth-context';
import { useDispatch } from 'react-redux';

// 👇 importa a função nova
import { syncColheitaAndMap } from '../../utils/features/syncColheita';

const DrawerHome = (props) => {
    const context = useContext(AuthContext);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const handleTopButtonPress = async () => {
        setLoading(true);
        try {
            await syncColheitaAndMap(dispatch);
            Alert.alert('Feito', 'Dados Atualizados com sucesso!');
        } catch (error) {
            Alert.alert('Erro', error.message || 'Erro ao atualizar os dados');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1, backgroundColor: Colors.primary[100] }}
        >
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

            <TouchableOpacity
                style={[styles.bottomButton, loading && styles.disabledBottomButton]}
                onPress={() => context.logout()}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
};

export default DrawerHome;

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
    disabledTopButton: {
        backgroundColor: Colors.primary[300]
    },
    disabledBottomButton: {
        backgroundColor: Colors.danger[300]
    }
});
