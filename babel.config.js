module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 1. Module Resolver (Seus aliases)
      [
        "module-resolver",
        {
          alias: {
            "@": "./", // Garante que imports como @/src funcionem
            "@components": "./src/components",
          },
        },
      ],

      // 2. Dotenv (Configuração para ler o arquivo .env)
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
        },
      ],

      // 3. Reanimated (OBRIGATÓRIO SER O ÚLTIMO DA LISTA)
      "react-native-reanimated/plugin",
    ],
  };
};
