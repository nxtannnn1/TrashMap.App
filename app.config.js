import "dotenv/config"; // Isso carrega as variáveis do .env para o process.env

export default {
  expo: {
    name: "TrashMap",
    slug: "TrashMap",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/logo.png",
    scheme: "trashmap",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      config: {
        // Agora usa a variável do .env
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
      bundleIdentifier: "com.anonymous.TrashMap", // Adicionado para consistência
    },
    android: {
      softwareKeyboardLayoutMode: "resize",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          // Agora usa a variável do .env
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      package: "com.anonymous.TrashMap",
    },
    web: {
      output: "static",
      favicon: "./src/assets/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: false,
      reactCompiler: true,
    },
    extra: {
      // Útil se você precisar acessar essas vars via Constants.expoConfig.extra no código
      apiUrl: process.env.REACT_APP_API_URL,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
};
