import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';

import { StatusBar } from "expo-status-bar";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import NewPassword from "./screens/NewPassword";
import WelcomeScreen from "./screens/WelcomeScreen";
import RomaneioScreen from "./screens/RomaneioScreen";
import UserScreen from "./screens/UserScreen";

import { Colors } from "./constants/styles";
import AuthContextprovider, { AuthContext } from "./store/auth-context";
import AuthContent from "./components/Auth/AuthContent";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

import IconButton from "./components/ui/IconButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, StyleSheet } from "react-native";
import FormScreen from "./components/romaneio/Form";
import ModalRomaneioScreen from "./components/romaneio/ModalRomaneio";

import { createNavigationContainerRef } from "@react-navigation/native";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/redux/store";

import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import { useDispatch } from "react-redux";
import { resetData } from "./store/redux/romaneios";

import { useSelector } from "react-redux";
import { plantioDataFromServerSelector } from "./store/redux/selector";

import { View, Text, Platform, Alert } from "react-native";
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";


const width = Dimensions.get("window").width; //full width

import { AntDesign } from "@expo/vector-icons";
import Splash from "./components/ui/Splash";
import DrawerHome from "./components/Drawer";
import ParcelasScreen from "./screens/ParcelasScreen";
import MapScreen from "./components/Global/MapScreen";

import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: "white",
				contentStyle: { backgroundColor: Colors.primary100 }
			}}
		>
			{/* <Stack.Screen
				name="SplashLogin"
				component={Splash}
				options={{
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/> */}

			<Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
			<Stack.Screen
				name="NewPassword"
				component={NewPassword}
				options={{
					presentation: "modal",
					title: "Redefinir a Senha",
					contentStyle: {
						backgroundColor: Colors.primary[900]
					}
				}}
			/>
		</Stack.Navigator>
	);
}

function RomaneioStack({ route, navigation }) {
	const routeName = getFocusedRouteNameFromRoute(route);

	const handleBack = () => {
		navigation.navigate("Welcome");
	};

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: "whitesmoke",

				headerShown: true, // Make sure the header is visible
				headerStyle: {
					backgroundColor: Colors.primary500,
					...(Platform.OS === 'ios' && { headerBlurEffect: 'regular' }), // Avoids crash on Android
				},
				headerTitleStyle: {
					// fontSize: 36, // Large title font size
					fontWeight: 'bold', // You can change this as needed
				},
				headerLargeTitle: true, // Enable large title for iOS
				headerTitleAlign: 'center', // Align title to the center

			}}
		>
			<Stack.Screen
				name="Romaneios"
				component={RomaneioScreen}
				options={{
					title: 'Romaneios',
					headerShadowVisible: false, // applied here
					contentStyle: { backgroundColor: Colors.primary500 }
					// headerLeft: ({ tintColor }) => (
					// 	<IconButton
					// 		icon="arrow-back-sharp"
					// 		color={tintColor}
					// 		size={24}
					// 		onPress={handleBack}
					// 	/>
					// )
				}}
			/>
			<Stack.Screen
				name="modalRomaneios"
				component={ModalRomaneioScreen}
				options={{
					presentation: "modal",
					title: "",
					headerShadowVisible: false, // applied here
					headerShown: Platform.OS === "ios" ? false : true,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
		</Stack.Navigator>
	);
}


function HomeScrennStack({ route, navigation }) {
	const routeName = getFocusedRouteNameFromRoute(route);
	// console.log("routeName", routeName);
	const context = useContext(AuthContext);
	const dispatch = useDispatch();

	const handleRefresh = () => {
		console.log("refresh data");
		dispatch(resetData());
	};

	const addRomaneioandler = () => {
		console.log("add romaneio");
		navigation.navigate("Form");
	};

	const handleBack = () => {
		navigation.navigate("Welcome");
	};

	useLayoutEffect(() => {
		if (routeName === "Form") {
			context.defineRouteName(routeName);
			navigation.setOptions({
				// headerLeft: ({ tintColor }) => (
				// 	<IconButton
				// 		icon="arrow-back-sharp"
				// 		color={tintColor}
				// 		size={24}
				// 		onPress={handleBack}
				// 	/>
				// )
				// headerRight: ({ tintColor }) => (
				// 	<IconButton
				// 		icon="home"
				// 		color={tintColor}
				// 		size={24}
				// 		// onPress={context.logout}
				// 		// onPress={refreshHandler}
				// 	/>
				// )
			});
		} else {
			navigation.setOptions({
				headerShown: true,
				tabBarStyle: { display: "flex" },
				tabBarStyle: {
					backgroundColor: Colors.primary800,
					borderTopColor: "transparent"
				}
			});
		}

		if (routeName === "Welcome") {
			context.defineRouteName(routeName);
			navigation.setOptions({
				// headerLeft: ({ tintColor }) => (
				// 	<IconButton
				// 		icon="refresh"
				// 		color={tintColor}
				// 		size={24}
				// 		onPress={handleRefresh}
				// 	/>
				// )
			});
		}
	}, [routeName, navigation]);

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 }
			}}
		>
			<Stack.Screen
				name="Welcome"
				component={WelcomeScreen}
				options={{
					// headerShown: false,
					title: "",
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
			{/* <Stack.Screen
				name="ModalRomaneio"
				component={ModalRomaneioScreen}
				options={{
					presentation: "modal",
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/> */}
		</Stack.Navigator>
	);
}
function AuthenticatedStack({ navigation }) {
	const dataColheita = useSelector(plantioDataFromServerSelector);
	const isObjectNotEmpty = (obj) => obj && Object.keys(obj).length > 0;
	const isNotEmpty = isObjectNotEmpty(dataColheita)
	const insets = useSafeAreaInsets();

	return (
		<>
			<Tab.Navigator
				screenOptions={{
					// 1) Dê altura fixa e trate o safe area (nada de variar por tela)
					tabBarStyle: {
						backgroundColor: Colors.primary800,
						borderTopColor: 'transparent',
						height: 60 + insets.bottom,
						paddingBottom: insets.bottom,  // impede “pulos” entre telas
					},

					// 2) Centralize o conteúdo do item (ícone+label) – sem marginTop
					tabBarItemStyle: {
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: 10,
					},

					// 3) Remova empurrões: não use marginTop; só ajuste tipografia
					tabBarIconStyle: {
						// nada de marginTop aqui
					},
					tabBarLabelStyle: {
						// nada de marginTop; só fonte
						fontSize: 12,
						includeFontPadding: false,   // Android: evita “empurrão” do texto
					},

					// 4) Mantenha comportamento estável
					tabBarHideOnKeyboard: true,    // evita teclado mexer na barra
					tabBarActiveTintColor: 'white',
					headerStyle: { backgroundColor: Colors.primary500 },
					headerTintColor: 'white',
				}}
			>
				<Tab.Screen
					name="inicio"
					component={HomeScrennStack}
					options={({ route }) => ({
						title: "",
						tabBarLabel: "Home",
						// tabBarShowLabel: false
						headerShadowVisible: false, // applied here
						// title: "Início",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="home" color={color} size={size} />
						)
					})}
				/>
				<Tab.Screen
					name="Add"
					component={FormScreen}
					options={({ route }) => ({
						title: "",
						presentation: "modal",
						tabBarLabel: "Adicionar",
						headerShadowVisible: false, // applied here
						contentStyle: { backgroundColor: Colors.primary500 },
						tabBarIcon: ({ color, size }) => (
							<AntDesign
								name="plus-circle"
								color={color}
								size={size}
							/>
						)
					})}
					listeners={({ navigation }) => ({
						tabPress: (e) => {
							e.preventDefault(); // Prevent default tab action

							// Use useSelector to get conditional logic
							const isAllowed = isNotEmpty
							if (isAllowed) {
								// Only navigate if the condition is met
								navigation.navigate("NewFormScreen");
							} else {
								// Optionally show a message if action is disabled
								Alert.alert('Atenção', 'Por favor atualizar os dados da colheita')
							}
						},
					})}
				/>
				<Tab.Screen
					name="RomaneiosTap"
					component={RomaneioStack}
					options={{
						title: "Romaneios",
						headerShown: false,
						tabBarLabel: "Romaneios",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="dump-truck"
								size={size}
								color={color}
							/>
						)
					}}
				/>
			</Tab.Navigator>
		</>
	);
}


function DrawerNavigator() {
	return (
		<Drawer.Navigator
			screenOptions={{
				headerShown: false
			}}
			drawerContent={(props) => <DrawerHome {...props} />}
		>
			<Drawer.Screen name="WelcomeDrawer" component={AuthenticatedStack} />
			{/* Add other screens here */}
		</Drawer.Navigator>
	);
}

const NewAuthStack = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: "whitesmoke"
			}}
		>
			<Stack.Screen
				name="NewAuthStack"
				component={DrawerNavigator}
				options={{
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
			<Stack.Screen
				name="NewFormScreen"
				component={FormScreen}
				options={{
					// presentation: "modal",
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
			<Stack.Screen
				name="ModalRomaneio"
				component={ModalRomaneioScreen}
				options={{
					presentation: "modal",
					title: "",
					headerShadowVisible: false, // applied here
					headerShown: Platform.OS === "ios" ? false : true,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
			<Stack.Screen
				name="ParcelasScreenRoute"
				component={ParcelasScreen}
				options={{
					// presentation: "modal",
					title: "",
					headerShadowVisible: false, // applied here
					headerShown: Platform.OS === "ios" ? false : true,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
			<Stack.Screen
				name="MapScreen"
				component={MapScreen}
				options={{
					// presentation: "modal",
					title: "",
					headerShadowVisible: false, // applied here
					headerShown: Platform.OS === "ios" ? false : false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
		</Stack.Navigator>
	);
};

function Navigation() {
	const context = useContext(AuthContext);
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperProvider>
				<SafeAreaProvider>
					<NavigationContainer>
						{!context.isAuth ? <AuthStack /> : <NewAuthStack context={context} />}
					</NavigationContainer>
				</SafeAreaProvider>
			</PaperProvider>
		</GestureHandlerRootView>
	);
}

const Root = () => {
	const context = useContext(AuthContext);
	const [isLoginIn, setIsLoginIn] = useState(true);
	const [showNavigation, setShowNavigation] = useState(false);
	SplashScreen.preventAutoHideAsync();
	useEffect(() => {
		const fetchToken = async () => {
			const storedToken = await AsyncStorage.getItem("token");

			if (storedToken) {
				context.authenticate(storedToken);
			}

			setIsLoginIn(false);
		};

		fetchToken();
	}, []);

	useEffect(() => {
		if (isLoginIn) {
			setTimeout(() => {
				SplashScreen.hideAsync();
			}, 200);
		}
	}, [isLoginIn]);

	useEffect(() => {
		const Timer = context.isAuth ? 1000 : 1600;
		setTimeout(() => {
			setShowNavigation(true);
		}, Timer);
	}, [isLoginIn]);

	if (isLoginIn) {
		return null;
	}

	if (!showNavigation) {
		return <Splash logIng={context.isAuth} />;
	}

	if (showNavigation) {
		return (
			<View style={{ flex: 1, backgroundColor: Colors.primary500 }}>
				<Navigation />
			</View>
		);
	}
};

export default function App() {
	return (
		<>
			<StatusBar style="light" />
			<Provider store={store}>
				<PersistGate
					loading={<Text>Loading...</Text>}
					persistor={persistor}
				>
					<AuthContextprovider>
						<Root />
					</AuthContextprovider>
				</PersistGate>
			</Provider>
		</>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		width: width
	},
	rootTest: {
		flex: 1
	},
	addButton: {
		padding: 0,
		margin: 0,
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: "green",
		width: 60,
		height: 60,
		borderRadius: 50

		// elevation: 4,

		// shadowColor: "white",
		// shadowOpacity: 0.6,
		// shadowOffset: { width: 0, height: 2 },
		// shadowRadius: 8
	},
	buttonContainerResum: {
		position: "fixed",
		bottom: 77,
		right: 0,
		height: 0,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10,
		alignSelf: "center",
		borderRadius: 50
	},
	addIcon: {
		textAlign: "center"
	}
});
