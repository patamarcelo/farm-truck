import MapView, {
	PROVIDER_GOOGLE,
	Callout,
	Marker,
	Polygon
} from "react-native-maps";
import { View, Text, StyleSheet, Platform, Pressable, Animated } from "react-native";
// import Button from "../../components/ui/Button";
import IconButton from "../../components/ui/IconButton";

import { useState, useEffect, createRef, useRef, useMemo } from "react";
import * as Haptics from "expo-haptics";

import * as Location from "expo-location";


import { newMapArr } from "./plot-helper";

import { Linking, Alert } from 'react-native';

import { useDispatch, useSelector } from "react-redux";

import { selectMapDataPlot, plantioDataFromServerSelector, selectCurrentCiclo } from "../../store/redux/selector";
import { setCurrentCiclo } from "../../store/redux/romaneios";





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

	const dispatch = useDispatch();
	const currentCiclo = useSelector(selectCurrentCiclo);


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

	// opacidade global dos polígonos
	const polygonFade = useRef(new Animated.Value(1)).current;
	const [polygonOpacity, setPolygonOpacity] = useState(1);




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

	// ciclos disponíveis (Number) a partir do próprio filteredFarmArr
	const numericCycles = useMemo(() => {
		return Array.from(
			new Set(
				filteredFarmArr
					.map(item => Number(item.ciclo))
					.filter(c => !Number.isNaN(c))
			)
		).sort((a, b) => a - b);
	}, [filteredFarmArr]);

	useEffect(() => {
		if (
			numericCycles.length > 0 &&
			(currentCiclo === null || currentCiclo === undefined)
		) {
			// define o primeiro ciclo da lista como padrão
			dispatch(setCurrentCiclo(numericCycles[0]));
		}
	}, [numericCycles, currentCiclo, dispatch]);


	useEffect(() => {
		if (!filteredFarmArr.length) return;

		// começa um pouco “apagado”
		polygonFade.setValue(0.3);

		const sub = polygonFade.addListener(({ value }) => {
			setPolygonOpacity(value);
		});

		Animated.timing(polygonFade, {
			toValue: 1,
			duration: 220,
			useNativeDriver: false, // estamos usando o valor em JS, não em estilo nativo
		}).start(() => {
			polygonFade.removeListener(sub);
		});

		return () => {
			polygonFade.removeListener(sub);
		};
	}, [currentCiclo, filteredFarmArr.length, polygonFade]);


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

	const getColor = (
		cultura,
		variedadeInside,
		isActive = true,
		colorInside = 'rgb(0,128,0)',
		isSelected = false,
		isHarvested = false,
		isPlantioFinalizado = false,
		globalOpacity = 1
	) => {
		let baseColor;

		if (!isActive) {
			baseColor = "rgba(245,245,245,1)";
		} else if (cultura === 'Arroz') {
			baseColor = "rgba(251,191,112,1)";
		} else if (cultura === 'Soja') {
			baseColor = colorInside; // normalmente "rgb(0,128,0)"
		} else if (variedadeInside === 'Mungo Preto') {
			baseColor = 'rgba(170,88,57,1.0)';
		} else if (variedadeInside === 'Mungo Verde') {
			baseColor = '#82202B';
		} else if (variedadeInside === 'Caupi') {
			baseColor = '#3F4B7D';
		} else {
			baseColor = "rgba(245,245,245,1)";
		}

		// 1) Selecionado → 0.5
		if (isSelected) {
			return applyOpacity(baseColor, 0.5 * globalOpacity);
		}

		// 3) Plantio finalizado (mas sem colheita) → mais apagado
		if (!isPlantioFinalizado) {
			return applyOpacity(baseColor, 0.3 * globalOpacity);
		}

		// 2) Colheita finalizada → cor sólida
		if (isHarvested) {
			return applyOpacity(baseColor, 0.4 * globalOpacity);
		}



		// 4) Default → 0.5
		return applyOpacity(baseColor, 0.8 * globalOpacity);
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
						filteredFarmArr.length > 0 &&
						filteredFarmArr
							.filter(item => currentCiclo == null || Number(item.ciclo) === currentCiclo)
							.filter((data) => data.ativo === true)
							.map((coordArr, i) => {
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
											fillColor={getColor(cultura, variedade, isActive, 'rgb(0,128,0)', selected, coordArr.colheita, coordArr.plantioFinalizado, polygonOpacity)}
											coordinates={coordArr.coords}
											// strokeColor={getColor(cultura, variedade, isActive)}
											strokeColor={handleLineColor(selected, coordArr.culturaColorLine)} // Set your desired border color here
											strokeWidth={2} // Set the border width (thickness)
											onPress={e => {
												// se já foi colhida, mostra alerta e não deixa seguir
												if (coordArr.colheita) {
													Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
													Alert.alert(
														'Colheita finalizada',
														`Colheita já finalizada na parcela ${coordArr?.talhao}.`
													);
													return;
												}
												// se plantio não foi finalizado, também bloqueia seleção
												if (!coordArr.plantioFinalizado) {
													Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
													Alert.alert(
														'Plantio Ainda não finalizado',
														`Plantio ainda não finalizado na parcela ${coordArr?.talhao}.`
													);
													return;
												}
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

				{/* Barra de filtro de ciclos no rodapé */}
				{numericCycles.length > 0 && (
					<View style={styles.cycleBar}>
						{numericCycles.map((option) => {
							const isSelected = option === currentCiclo;

							return (
								<Pressable
									key={option}
									onPress={() => dispatch(setCurrentCiclo(option))}
									style={[
										styles.cycleChip,
										isSelected && styles.cycleChipSelected,
									]}
								>
									<Text
										style={[
											styles.cycleChipText,
											isSelected && styles.cycleChipTextSelected,
										]}
									>
										{`Ciclo ${option}`}
									</Text>
								</Pressable>
							);
						})}
					</View>
				)}


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
	},
	cycleBar: {
		position: "absolute",
		bottom: 30,

		// novo comportamento
		right: "5%",      // encosta na direita
		width: "50%",     // ocupa metade da tela
		left: undefined,  // garante que não expanda para a esquerda

		flexDirection: "row",
		backgroundColor: "rgba(0,0,0,0.35)",
		borderRadius: 30,
		padding: 4,
		alignItems: "center",
		justifyContent: "space-between",
	},

	cycleChip: {
		flex: 1,
		marginHorizontal: 4,
		paddingVertical: 6,
		borderRadius: 26,
		backgroundColor: "rgba(255,255,255,0.25)",
		alignItems: "center",
	},
	cycleChipSelected: {
		backgroundColor: "rgba(255,255,255,0.95)",
	},
	cycleChipText: {
		fontSize: 12,
		color: "#F9FAFB",
		fontWeight: "500",
	},
	cycleChipTextSelected: {
		color: "#111827",
		fontWeight: "700",
	},
	mapWrapper: {
		flex: 1,
	},

});
export default MapScreen;
