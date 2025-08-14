export default ({ config }) => {
  
  const GOOGLE_MAPS_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "SUA_CHAVE_TEMP_DEV";
    
  return {
    ...config,
    name: "FarmTruck",
    slug: "farm-truck",
    version: "1.0.36",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Permitir que o $(PRODUCT_NAME) use sua localização."
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Permitir que o $(PRODUCT_NAME) use sua camera para ler o QrCode",
          microphonePermission: "Permitir que o $(PRODUCT_NAME) acesse seu microfone",
          recordAudioAndroid: true
        }
      ],
      [
        "expo-splash-screen",
        {
          resizeMode: "contain",
          backgroundColor: "#1A43C0",
          image: "./assets/splash.png"
        }
      ]
    ],
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      ...config.ios,
      buildNumber: "1.0.36",
      supportsTablet: true,
      bundleIdentifier: "com.patamarcelo.farmtruck",
      config: {
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
      },
      infoPlist: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPICategory: "NSPrivacyAccessedAPICategorySystemBootTime",
            NSPrivacyAccessedAPIUsageDescription: "This app requires access to system boot time to optimize performance."
          },
          {
            NSPrivacyAccessedAPICategory: "NSPrivacyAccessedAPICategoryDiskSpace",
            NSPrivacyAccessedAPIUsageDescription: "This app needs access to disk space to store and manage data efficiently."
          },
          {
            NSPrivacyAccessedAPICategory: "NSPrivacyAccessedAPICategoryFileTimestamp",
            NSPrivacyAccessedAPIUsageDescription: "Access to file timestamps is essential for managing files and ensuring data integrity."
          },
          {
            NSPrivacyAccessedAPICategory: "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPIUsageDescription: "Access to user defaults is required to store user preferences and settings."
          },
          {
            NSPrivacyAccessedAPICategory: "NSPrivacyAccessedAPICategorySystemBootTime",
            NSPrivacyAccessedAPIUsageDescription: "This app requires access to system boot time to optimize performance."
          },
          {
            NSPrivacyAccessedAPICategory: "NSPrivacyAccessedAPICategoryDiskSpace",
            NSPrivacyAccessedAPIUsageDescription: "This app needs access to disk space to store and manage data efficiently."
          },
          {
            NSPrivacyAccessedAPICategory: "NSPrivacyAccessedAPICategoryFileTimestamp",
            NSPrivacyAccessedAPIUsageDescription: "Access to file timestamps is essential for managing files and ensuring data integrity."
          },
          {
            NSPrivacyAccessedAPICategory: "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPIUsageDescription: "Access to user defaults is required to store user preferences and settings."
          }
        ],
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      ...config.android,
      package: "com.patamarcelo.farmtruck",
      versionCode: 36,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY
        }
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "075458d8-8b7f-45b4-87cb-83f54f03c491"
      }
    },
    runtimeVersion: "exposdk:46.0.0",
    updates: {
      url: "https://u.expo.dev/075458d8-8b7f-45b4-87cb-83f54f03c491"
    }
  };
};


