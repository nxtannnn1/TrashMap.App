// Este arquivo centraliza as definições de tipo do seu app.

export type Rota = {
  id: string; // Ex: "rota1"
  nome: string; // Ex: "Rota Calçada - Ribeira"
  descricao: string; // Ex: "Rota para coleta de recicláveis na região da Ribeira"
  cor: string; // Ex: "#34A853"
  largura: number; // Ex: 4
  pontosInicial: number; // Ex: Geopoint index1
  pontosFinal: number; // Ex: Geopoint index2
};

export type MapMarker = {
  id: string; // Ex: "marker1"
  latitude: number; // Ex: -23.55052
  longitude: number; // Ex: -46.633308
  titulo: string; // Ex: "Ponto de Coleta Caminho de Areia"
  descricao?: string; // Ex: "Ponto de coleta de recicláveis"
};

export type Usuario = {
  id: string; // Ex: "BR17BOZ0VSLUL413BR4Z1N0"
  nome: string; // Ex: "Leticia Silva Falcão"
  email: string; // Ex: "letsilva@gmail.com"
  senha: string; // Ex: "sunfoYFGSO$as#AMFAOl"
  endereco: string; // Ex: "Av. Caminho de Areia - 157"
  cidade: string; // Ex: "Salvador - BA"
};

// Define a estrutura de uma notificação vinda da API
export interface NotificationType {
  id: number;
  titulo: string;
  mensagem: string;
  tempo: string;
  iconName: string; // Se você quiser ser mais estrito, pode usar os tipos do Ionicons
  iconColor: string;
  iconBg: string;
  lido: boolean;
}
