import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

// Suas páginas
import Login from "./components/login/Login";
import PaginaInicio from "./pages/home";
import PageCadastroRotas from "./pages/pageCadastro";
import PageCadastroCaminhao from "./pages/pageCadastroCaminhao";
import PageCadastroColeta from "./pages/pageCadastroColeta";
import PageGerencRotas from "./pages/pageGerenRotas";
import PageGerenCaminhoes from "./pages/pageGerenCaminhoes";
import PageGerenPontoColeta from "./pages/pageGerenPontoColeta";
import PageSimulador from "./pages/pageSimulador";
import PageSimulacaoMulti from "./pages/pageSimulacaoMulti"; // NOVO IMPORT
import PageCadUsuario from "./pages/pageCadUsuario";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota Pública - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Redireciona raiz para login se não autenticado */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rotas Privadas (Protegidas) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <PaginaInicio />
              </PrivateRoute>
            }
          />

          <Route
            path="/cadastro-rotas"
            element={
              <PrivateRoute>
                <PageCadastroRotas />
              </PrivateRoute>
            }
          />
          <Route
            path="/cadastro-caminhao"
            element={
              <PrivateRoute>
                <PageCadastroCaminhao />
              </PrivateRoute>
            }
          />
          <Route
            path="/cadastro-coleta"
            element={
              <PrivateRoute>
                <PageCadastroColeta />
              </PrivateRoute>
            }
          />

          <Route
            path="/gerenciamento-rotas"
            element={
              <PrivateRoute>
                <PageGerencRotas />
              </PrivateRoute>
            }
          />
          <Route
            path="/gerenciamento-caminhoes"
            element={
              <PrivateRoute>
                <PageGerenCaminhoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/gerenciamento-pontos-coleta"
            element={
              <PrivateRoute>
                <PageGerenPontoColeta />
              </PrivateRoute>
            }
          />

          <Route
            path="/simulador"
            element={
              <PrivateRoute>
                <PageSimulador />
              </PrivateRoute>
            }
          />
          
          {/* NOVA ROTA ADICIONADA AQUI */}
          <Route
            path="/simulacao-multi"
            element={
              <PrivateRoute>
                <PageSimulacaoMulti />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/gerenciamento-usuario"
            element={
              <PrivateRoute>
                <PageCadUsuario />
              </PrivateRoute>
            }
          />

          {/* Rota de fallback para páginas não encontradas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;