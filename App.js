import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
import AppLoading from "expo-app-loading";

import { useNavigation } from "@react-navigation/native";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, StyleSheet } from "react-native";
import FormScreen from "./components/romaneio/Form";
import ModalRomaneioScreen from "./components/romaneio/ModalRomaneio";

import { createNavigationContainerRef } from "@react-navigation/native";

import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const width = Dimensions.get("window").width; //full width

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: "white",
				contentStyle: { backgroundColor: Colors.primary100 }
			}}
		>
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
				headerStyle: { backgroundColor: Colors.primary500 }
			}}
		>
			<Stack.Screen
				name="Romaneios"
				component={RomaneioScreen}
				options={{
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 },
					headerLeft: ({ tintColor }) => (
						<IconButton
							icon="arrow-back-sharp"
							color={tintColor}
							size={24}
							onPress={handleBack}
						/>
					)
				}}
			/>
		</Stack.Navigator>
	);
}

function HomeScrennStack({ route, navigation }) {
	const routeName = getFocusedRouteNameFromRoute(route);
	console.log("routeName", routeName);
	const context = useContext(AuthContext);

	const handleRefresh = () => {
		console.log("refresh data");
	};

	const addRomaneioandler = () => {
		console.log("add romaneio");
		navigation.navigate("Form");
	};

	const handleBack = () => {
		navigation.navigate("Welcome");
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			tabBarStyle: {
				backgroundColor: Colors.primary800,
				borderTopColor: "transparent"
			},
			headerLeft: ({ tintColor }) => (
				<IconButton
					icon="refresh"
					color={tintColor}
					size={24}
					onPress={handleRefresh}
				/>
			),
			headerRight: ({ tintColor }) => (
				<IconButton
					icon="add"
					color={tintColor}
					size={24}
					// onPress={context.logout}
					onPress={addRomaneioandler}
				/>
			)
		});
	}, [navigation]);

	useLayoutEffect(() => {
		if (routeName === "Form") {
			// setRouteName("Form");
			context.defineRouteName(routeName);
			navigation.setOptions({
				tabBarStyle: { display: "none" },
				headerLeft: ({ tintColor }) => (
					<IconButton
						icon="arrow-back-sharp"
						color={tintColor}
						size={24}
						onPress={handleBack}
					/>
				),
				headerRight: ({ tintColor }) => (
					<IconButton
						icon="home"
						color={tintColor}
						size={24}
						// onPress={context.logout}
						// onPress={refreshHandler}
					/>
				)
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
				headerLeft: ({ tintColor }) => (
					<IconButton
						icon="refresh"
						color={tintColor}
						size={24}
						onPress={handleRefresh}
					/>
				),
				headerRight: ({ tintColor }) => (
					<IconButton
						icon="add"
						color={tintColor}
						size={24}
						// onPress={context.logout}
						onPress={addRomaneioandler}
					/>
				)
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
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
			<Stack.Screen
				name="Form"
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
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
		</Stack.Navigator>
	);
}
function AuthenticatedStack(props) {
	const { context } = props;
	const navigation = useNavigation();

	return (
		<Tab.Navigator
			initialRouteName="inicio"
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: "white",
				// headerStyle: {
				// 	borderBottomColor: Colors.primary500
				// },
				tabBarActiveTintColor: "white",
				tabBarStyle: {
					backgroundColor: Colors.primary800,
					borderTopColor: "transparent"
				},
				// contentStyle: { backgroundColor: Colors.primary500 },
				initialRouteName: "inicio"
			}}
		>
			<Tab.Screen
				name="inicio"
				component={HomeScrennStack}
				options={({ route }) => ({
					title: "",
					tabBarLabel: "Home",
					headerShadowVisible: false, // applied here
					// title: "Início",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" color={color} size={size} />
					)
				})}
			/>
			<Tab.Screen
				name="RomaneiosTap"
				component={RomaneioStack}
				options={{
					title: "Romaneios",
					headerShown: false,
					tabBarLabel: "Romaneios",
					// tabBarStyle: { display: "none" },
					headerRight: ({ tintColor }) => (
						<IconButton
							icon="exit"
							color={tintColor}
							size={24}
							onPress={() => navigation.navigate("Welcome")}
						/>
					),
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="dump-truck"
							size={size}
							color={color}
						/>
					)
				}}
			/>
			{/* <Tab.Screen
				name="Usuário"
				component={UserScreen}
				options={{
					// headerRight: ({ tintColor }) => (
					// 	<IconButton
					// 		icon="exit"
					// 		color={tintColor}
					// 		size={24}
					// 		onPress={context.logout}
					// 	/>
					// ),
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5
							name="user-alt"
							size={size}
							color={color}
						/>
					)
				}}
			/> */}
		</Tab.Navigator>
	);
}

function Navigation() {
	const context = useContext(AuthContext);
	return (
		<NavigationContainer style={styles.rootContainer}>
			{!context.isAuth ? (
				<AuthStack />
			) : (
				<AuthenticatedStack context={context} />
			)}
		</NavigationContainer>
	);
}

const Root = () => {
	const context = useContext(AuthContext);
	const [isLoginIn, setIsLoginIn] = useState(true);
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

	if (isLoginIn) {
		return <AppLoading />;
	}

	return <Navigation />;
};

export default function App() {
	return (
		<>
			<StatusBar style="light" />
			<AuthContextprovider>
				<Root />
			</AuthContextprovider>
		</>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		width: width
	}
});
