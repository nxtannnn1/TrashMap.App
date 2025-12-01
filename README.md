# 🌍 TrashMap

**TrashMap** é um sistema integrado de gestão e monitoramento de coleta de resíduos, projetado para conectar a administração da coleta com os cidadãos. O projeto é dividido em uma aplicação Mobile (para os usuários/cidadãos) e uma aplicação Desktop (painel administrativo), ambos alimentados por um Backend robusto.

---

## 🚀 Funcionalidades

### 📱 Mobile (App do Cidadão)
- **Autenticação:** Login e Cadastro de usuários seguros.
- **Mapa Interativo:** Visualização de rotas e pontos de coleta em tempo real (Google Maps).
- **Rotas e Favoritos:** Pesquisa de rotas de coleta e salvamento de locais favoritos.
- **Notificações:** Alertas sobre a coleta na região.
- **Perfil:** Gestão de dados do usuário.

### 💻 Desktop (Painel Administrativo)
- **Dashboard:** Visão geral do sistema.
- **Gestão de Frota:** Monitoramento e cadastro de caminhões.
- **Pontos de Coleta:** Gerenciamento visual dos pontos no mapa.
- **Gestão de Usuários:** Controle de perfis (Admin, Moderador, Cliente).
- **Endereços:** Administração de zonas de coleta.

---

## 🛠️ Tecnologias Utilizadas

### Mobile
- **React Native** com **Expo** (Managed Workflow)
- **TypeScript**
- **Expo Router** (Navegação baseada em arquivos)
- **React Native Maps** (Integração Google Maps)
- **Axios** (Comunicação com API)
- **Expo Secure Store** (Armazenamento seguro de tokens)

### Desktop (Web)
- **React.js**
- **@vis.gl/react-google-maps** (Integração Google Maps para Web)
- **CSS3** (Estilização responsiva)

### Backend
- **Kotlin** (API RESTful)

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão LTS recomendada)
- [Git](https://git-scm.com/)
- Um dispositivo físico (Android/iOS) ou Emulador configurado.
- Uma **Google Maps API Key** válida.

---
