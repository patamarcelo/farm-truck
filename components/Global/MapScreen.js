import MapView, {
	PROVIDER_GOOGLE,
	Callout,
	Marker,
	Polygon
} from "react-native-maps";
import { View, Text, StyleSheet, Platform } from "react-native";
// import Button from "../../components/ui/Button";
import IconButton from "../../components/ui/IconButton";

import { useState, useEffect, createRef, useRef } from "react";
import * as Haptics from "expo-haptics";

import * as Location from "expo-location";


import { newMapArr } from "./plot-helper";

import { Linking, Alert } from 'react-native';

import { useSelector } from "react-redux";
import { selectMapDataPlot, plantioDataFromServerSelector } from "../../store/redux/selector";





// API GET GEOPOINTS PLANTED
// http://127.0.0.1:8000/diamante/plantio/get_plantio_detail_map/

// http://127.0.0.1:8000/diamante/plantio/get_produtividade_plantio/

const MapScreen = ({ navigation, route }) => {
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);

	const [filteredFarmArr, setfilteredFarmArr] = useState([]);


	const [isPressed, setIsPressed] = useState(null);

	const mapPlotData = useSelector(selectMapDataPlot)
	const plantedData = useSelector(plantioDataFromServerSelector)

	const [propsToBottom, setPropsToBottom] = useState({});
	const [mapCoordsInit, setmapCoordsInit] = useState({
		latitude: "",
		latitudeDelta: null,
		longitude: '',
		longitudeDelta: null,
	});

	const refRBSheet = useRef();

	const mapRef = createRef();

	const { farmName, parcelas, onSelectLocation } = route?.params

	// console.log('data here:::', data)


	const [zoomLevel, setZoomLevel] = useState(0);
	const [mapRegion, setMapRegion] = useState(null);



	// Function to calculate zoom level from map's region
	const calculateZoomLevel = (region) => {
		const zoom = Math.log(360 / region.longitudeDelta) / Math.LN2;

		// Adjust zoom logic for Apple Maps
		if (Platform.OS === 'ios' && !region.provider) {
			return zoom - 2;  // Adjust zoom value to suit Apple Maps
		}

		return zoom;
	};

	const onRegionChangeComplete = (region) => {
		const newZoomLevel = calculateZoomLevel(region);
		setZoomLevel(newZoomLevel);
		setMapRegion(region);
	};

	useEffect(() => {
		if (mapPlotData.length > 0 && farmName) {
			const dataFromMap = newMapArr(mapPlotData)
			const filteredFarm = dataFromMap.filter((data) => data.farmName == farmName.replace('Fazenda', 'Projeto').replace('Cacique', 'Cacíque')).filter((data) => data.ativo === true)
			const onlyCoords = filteredFarm.map((data) => data.coords)
			// console.log('onlyCoords: ', onlyCoords)

			const getRegionForCoordinates = (coordinates) => {
				let minLat, maxLat, minLng, maxLng;

				// Loop through the coordinates to find min and max latitudes/longitudes
				coordinates.forEach(subArray => {
					subArray.forEach(coord => {
						// console.log('coords: ', coord)
						const { latitude, longitude } = coord;

						minLat = minLat !== undefined ? Math.min(minLat, latitude) : latitude;
						maxLat = maxLat !== undefined ? Math.max(maxLat, latitude) : latitude;
						minLng = minLng !== undefined ? Math.min(minLng, longitude) : longitude;
						maxLng = maxLng !== undefined ? Math.max(maxLng, longitude) : longitude;
					})
				});

				// Calculate the deltas (adding some padding)
				const latitudeDelta = (maxLat - minLat) * 1.2; // Adding 20% padding
				const longitudeDelta = (maxLng - minLng) * 1.2;

				// Return the region object that can be used in `animateToRegion`
				return {
					latitude: (maxLat + minLat) / 2, // Center latitude
					longitude: (maxLng + minLng) / 2, // Center longitude
					latitudeDelta: latitudeDelta,
					longitudeDelta: longitudeDelta
				};
			};
			const getMapCords = getRegionForCoordinates(onlyCoords)
			setmapCoordsInit(getMapCords)

			setfilteredFarmArr(filteredFarm)
		}
	}, [farmName]);


	useEffect(() => {

		const getLocationPermission = async () => {
			const { status } = await Location.getForegroundPermissionsAsync();

			if (status === 'denied') {
				Alert.alert(
					"Location Permission Required",
					"Location permission is denied. Would you like to open the app settings to enable location access?",
					[
						{
							text: "Cancel",
							style: "cancel"
						},
						{
							text: "Open Settings",
							onPress: () => Linking.openSettings() // Open settings if user agrees
						}
					],
					{ cancelable: true }
				);
				return;
			}

			if (status !== 'granted') {
				let { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== "granted") {
					setErrorMsg("Permission to access location was denied");
					return;
				}
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		};
		getLocationPermission()
	}, []);


	let text = "Waiting..";
	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = JSON.stringify(location);
	}

	const handleSetLocation = () => {
		// console.log(location, 'location')
		mapRef.current.animateToRegion({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421
		});
		setLatitude(location.coords.latitude);
		setLongitude(location.coords.longitude);
	};

	if (filteredFarmArr.length === 0) {
		return <Text>Loading..</Text>
	}

	const handleLineColor = (canpress, color) => {
		if (canpress) return 'green'
		return "rgba(245,245,245,0.2)"
	}

	const applyOpacity = (color, alpha = 0.5) => {
		if (color.startsWith('#')) {
			// Converte #RRGGBB para rgba()
			const r = parseInt(color.slice(1, 3), 16);
			const g = parseInt(color.slice(3, 5), 16);
			const b = parseInt(color.slice(5, 7), 16);
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		}

		if (color.startsWith('rgba')) {
			// Substitui a opacidade
			return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${alpha})`);
		}

		if (color.startsWith('rgb')) {
			// Converte rgb() para rgba()
			return color.replace(/rgb\(([^,]+),([^,]+),([^)]+)\)/, `rgba($1,$2,$3,${alpha})`);
		}

		// Cor desconhecida, retorna como está
		return color;
	};

	const getColor = (cultura, variedadeInside, isActive = true, colorInside = 'rgb(0,128,0)', isSelected = false) => {
		let baseColor;

		if (!isActive) {
			baseColor = "rgba(245,245,245,0.6)";
		} else if (cultura === 'Arroz') {
			baseColor = "rgba(251,191,112,1)";
		} else if (cultura === 'Soja') {
			baseColor = colorInside;
		} else if (variedadeInside === 'Mungo Preto') {
			baseColor = 'rgba(170,88,57,1.0)';
		} else if (variedadeInside === 'Mungo Verde') {
			baseColor = '#82202B';
		} else if (variedadeInside === 'Caupi') {
			baseColor = '#3F4B7D';
		} else {
			baseColor = "rgba(245,245,245,0.6)";
		}

		// Se estiver selecionado, aplique uma opacidade de 0.5
		if (isSelected) {
			return applyOpacity(baseColor, 0.5);
		}

		return baseColor;
	};
	if (mapCoordsInit.latitude !== null) {

		return (
			<View style={styles.container}>
				<MapView
					// provider={PROVIDER_GOOGLE}
					onRegionChangeComplete={onRegionChangeComplete}
					provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // Use Google Maps for Android, default (Apple Maps) for iOS
					ref={mapRef}
					showsUserLocation={true}
					// followsUserLocation={true}
					style={styles.map}
					initialRegion={{
						latitude: mapCoordsInit.latitude,
						longitude: mapCoordsInit.longitude,
						latitudeDelta: mapCoordsInit.latitudeDelta,
						longitudeDelta: mapCoordsInit.longitudeDelta,
						// latitude: filteredFarmArr[0]?.farmCenterGeo?.lat,
						// longitude: filteredFarmArr[0]?.farmCenterGeo?.lng,
						// latitudeDelta: 0.111098,
						// longitudeDelta: 0.076567
					}}
					mapType="satellite"
				>
					{
						filteredFarmArr.length > 0 && filteredFarmArr.map((coordArr, i) => {
							const cultura = coordArr?.cultura || ''
							const variedade = coordArr?.variedade || ''

							const isActive = coordArr?.ativo

							const canPressCheck = isActive && cultura.length > 3
							const selected = parcelas.find((parc) => parc.parcela.split(" ").join("") === coordArr.talhao.split(" ").join(""))?.selected
							const canPress = !selected && canPressCheck
							const isPressedHere = isPressed && isPressed === canPress?.parcela ? 1 : 0.6
							// console.log('can press data: ', canPress)
							// console.log('parcela', coordArr)
							return (
								<View key={i}>
									<Polygon
										// fillColor={canPress ? `rgba(251,191,112,${isPressedHere})` : "rgba(245,245,245,0.6)"}
										fillColor={getColor(cultura, variedade, isActive, 'rgb(0,128,0)', selected)}
										coordinates={coordArr.coords}
										// strokeColor={getColor(cultura, variedade, isActive)}
										strokeColor={handleLineColor(selected, coordArr.culturaColorLine)} // Set your desired border color here
										strokeWidth={2} // Set the border width (thickness)
										onPress={e => {
											if (canPress) {
												// console.log('Press Event',)
												Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
												setIsPressed(coordArr.talhao)
												const objToAdd =
												{
													"ciclo": coordArr?.ciclo,
													"colheita": coordArr?.colheita,
													"cultura": cultura,
													"id_plantio": coordArr?.idDjango,
													"parcela": coordArr?.talhao,
													"safra": coordArr?.safra,
													"variedade": variedade,
												}
												if (onSelectLocation) {
													onSelectLocation(objToAdd); // chama o handleGOBack da tela B
												}
												navigation.pop(2); // volta duas telas direto
											};
											// console.log('data to bottom', data)
											// setPropsToBottom(objToAdd)
										}
										}
										tappable={true}
									/>
									<Marker
										key={i + 'i'}  // Force re-render by using zoom level as key
										hideCallout={true}
										showCallout={true}
										tracksViewChanges={false}
										coordinate={{
											latitude: coordArr.talhaoCenterGeo.lat,
											longitude: coordArr.talhaoCenterGeo.lng
										}}
									>
										<Text>{coordArr.talhao}</Text>
										<Text style={{ fontSize: 8 }}>{coordArr.variedade}</Text>
									</Marker>

								</View>
							)
						})
					}
				</MapView>
				{
					!isPressed &&
					<>

						<View
							style={{
								width: 50,
								height: 50,
								backgroundColor: "transparent",
								position: "absolute",
								bottom: "10%",
								left: "80%",
								zIndex: 10,
								borderRadius: 50
							}}
						>
							<IconButton
								type={"paper"}
								icon="target-account"
								color={"grey"}
								size={28}
								onPress={handleSetLocation}
								btnStyles={{
									backgroundColor: "rgba(255,255,255,0.9)",
									borderRadius: 50,
									justifyContent: "center",
									alignItems: "center",
									height: 50,
									width: 50
								}}
							/>
							{/* <IconButton
							type={"awesome"}
							icon="filter"
							color={"grey"}
							size={22}
							onPress={handlerFarms}
							btnStyles={{
								backgroundColor: "rgba(255,255,255,0.9)",
								borderRadius: 50,
								justifyContent: "center",
								alignItems: "center",
								height: 50,
								width: 50
							}}
						/> */}
						</View>
					</>
				}

				<View
					style={{
						width: 50,
						height: 50,
						backgroundColor: "transparent",
						position: "absolute",
						top: "8%",
						right: "84%",
						zIndex: 10,
						borderRadius: 50
					}}
				>
					<IconButton
						type={""}
						icon="arrow-back-outline"
						color={"grey"}
						size={22}
						onPress={() => navigation.goBack()}
						btnStyles={{
							backgroundColor: "rgba(255,255,255,0.9)",
							borderRadius: 50,
							justifyContent: "center",
							alignItems: "center",
							height: 50,
							width: 50
						}}
					/>
				</View>

			</View>
		);
	}
};
const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	map: {
		flex: 1,
		width: "100%",
		height: "100%"
	}
});
export default MapScreen;
