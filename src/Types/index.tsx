// Este arquivo centraliza as definições de tipo do seu app.

export type Rota = {
  id: string;
  nome: string;
  descricao: string;
  pontos?: number; // Adicionei 'pontos' que você tinha no seu CardRotas
  // Adicione outros campos que sua API retorna
};

export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  titulo: string;
  descricao?: string;
};

export type Usuario = {
  id: string; // Ex: "BR17BOZ0VSLUL413BR4Z1N0"
  nome: string; // Ex: "Leticia Silva Falcão"
  email: string; // Ex: "letsilva@gmail.com"
  endereco: string; // Ex: "Av. Caminho de Areia - 157"
  cidade: string; // Ex: "Salvador - BA"
  fotoUrl?: string; // URL da imagem de perfil
};

// Define a estrutura de uma notificação vinda da API
export type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tempo: string; // Ex: "16:45" ou "2h atrás"
  tipoIcone?: string; // Ex: "bulb-sharp", "alert-circle-sharp"
  corIcone?: string; // Ex: "#e4e70dff"
  corFundoIcone?: string; // Ex: "#ee8989ff"
};
