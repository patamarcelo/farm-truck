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

import { syncColheitaAndMap } from '../../utils/features/syncColheita';
import { refreshUserData } from '../../store/firebase/syncUserData';

const DrawerHome = (props) => {
	const context = useContext(AuthContext);
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);

	const handleTopButtonPress = async () => {
		setLoading(true);

		try {
			const results = await Promise.allSettled([
				refreshUserData(dispatch),
				syncColheitaAndMap(dispatch),
			]);

			const userResult = results[0];
			const colheitaResult = results[1];

			if (userResult.status === "rejected") {
				console.log("Erro ao atualizar usuário:", userResult.reason);
			}

			if (colheitaResult.status === "rejected") {
				console.log("Erro ao atualizar colheita/mapa:", colheitaResult.reason);
			}

			if (
				userResult.status === "rejected" &&
				colheitaResult.status === "rejected"
			) {
				throw new Error("Não foi possível atualizar os dados agora.");
			}

			if (userResult.status === "rejected") {
				Alert.alert(
					"Atenção",
					"Colheita atualizada, mas não foi possível atualizar os dados do usuário."
				);
				return;
			}

			if (colheitaResult.status === "rejected") {
				Alert.alert(
					"Atenção",
					"Usuário atualizado, mas não foi possível atualizar os dados de colheita."
				);
				return;
			}

			Alert.alert('Feito', 'Dados atualizados com sucesso!');
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
					<Text style={styles.buttonText}>Atualizar Dados</Text>
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
		marginTop: 'auto',
		marginBottom: 10,
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