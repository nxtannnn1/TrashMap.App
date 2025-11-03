// babel.config.js - Versão CORRIGIDA

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 1. Plugins normais, como o de alias
      [
        "module-resolver", // NOTA: Este plugin precisa de configuração (root/alias) para funcionar!
        {
          alias: {
            "@components": "./src/components", // Exemplo de alias
            // ... adicione seus próprios aliases aqui
          },
        },
      ],

      // 2. Plugin do Expo Router (corrigido o espaço)
      "expo-router/babel",

      // 3. O plugin do Reanimated DEVE ser o ÚLTIMO
      "react-native-reanimated/plugin",
    ],
  };
};
