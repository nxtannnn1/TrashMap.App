// Importa os tipos nativos
import { StackScreenProps } from "@react-navigation/stack";

// 1. Define a lista de telas e seus parâmetros
// Como suas telas não parecem receber parâmetros (ex: um ID de usuário),
// usamos 'undefined' para todas elas.
export type RootStackParamList = {
  Home: undefined;
  Usuario: undefined;
  EditUsuario: undefined;
  Notification: undefined;
  Login: undefined;
  Cadastro: undefined;
  // Se 'EditUsuario' precisasse de um ID, você faria:
  // EditUsuario: { userId: string };
};

// 2. Cria um tipo genérico para as props de tela
// Isso vai facilitar a vida nos seus arquivos de tela
export type AppScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
