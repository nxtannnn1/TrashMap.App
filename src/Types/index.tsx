// src/Types.ts

// 1. Definição de Geopoint (compatível com o Embeddable do Java)
export type Geopoint = {
  latitude: number;
  longitude: number;
};

// 2. Rota atualizada para bater com o Backend Kotlin
export type Rota = {
  id: string;
  nome: string;
  // O backend pode ou não mandar descrição, deixamos opcional
  descricao?: string;
  pontoDeColetaId: number;
  // AQUI ESTÁ O SEGREDO: Uma lista de coordenadas vinda do @ElementCollection
  coordenadas: Geopoint[];
};

// 3. MapMarker para os pontos fixos (Lixeiras/Ecopontos)
export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  titulo: string;
  descricao?: string;
};

// 4. Usuário (mantido do seu código)
export type Usuario = {
  id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
};

// 5. Definições de Navegação (mantidas)
export type RootStackParamList = {
  Home: undefined;
  Usuario: undefined;
  EditUsuario: undefined;
  Notification: undefined;
  Login: undefined;
  Cadastro: undefined;
};
