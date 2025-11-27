// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";

import Home from "./pages/Home";
import Caminhoes from "./pages/Caminhoes";
import Pontos from "./pages/Pontos";
import Enderecos from "./pages/Enderecos";
import Usuarios from "./pages/Usuarios";
import CadastroRota from "./pages/CadastroRota";
import SimulacaoCaminhao from "./pages/SimulacaoCaminhao"; // NOVO IMPORT
import Login from "./login/Login";

import "./App.css";

const GOOGLE_MAPS_KEY = "AIzaSyCBs_5rLELLShtl5MR3lnIqova7IBWDGZg";

// Proteção de rotas
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  const userProfile = localStorage.getItem("userProfile");
  if (!isLoggedIn || (userProfile !== "ADMIN" && userProfile !== "MODERADOR")) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_KEY}>
      <Router>
        <Routes>
          {/* Página de login */}
          <Route path="/login" element={<Login />} />

          {/* Painel protegido */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="container">
                  <nav className="sidebar">
                    <h2>TrashMap</h2>
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/caminhoes"; }}>Caminhões</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/pontos"; }}>Pontos de Coleta</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/enderecos"; }}>Endereços</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/usuarios"; }}>Usuários</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/cadastro-rota"; }}>Cadastrar Rota</a></li>
                      {/* NOVO ITEM NO MENU */}
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/simulacao-caminhao"; }}>🎮 Simulação Caminhão</a></li>
                      <li><a href="#" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Sair</a></li>
                    </ul>
                  </nav>

                  <main className="content" id="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/caminhoes" element={<Caminhoes />} />
                      <Route path="/pontos" element={<Pontos />} />
                      <Route path="/enderecos" element={<Enderecos />} />
                      <Route path="/usuarios" element={<Usuarios />} />
                      <Route path="/cadastro-rota" element={<CadastroRota />} />
                      {/* NOVA ROTA */}
                      <Route path="/simulacao-caminhao" element={<SimulacaoCaminhao />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </APIProvider>
  );
}

export default App;