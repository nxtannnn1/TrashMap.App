import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaInicio from './pages/home';
import PageCadastroRotas from './pages/pageCadastro';
import PageCadastroCaminhao from './pages/pageCadastroCaminhao';
import PageCadastroColeta from './pages/pageCadastroColeta';
import PageGerencRotas from './pages/pageGerenRotas';


import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/cadastro-rotas" element={<PageCadastroRotas />} />
        <Route path="/cadastro-caminhao" element={<PageCadastroCaminhao />} />
        <Route path="/cadastro-coleta" element={<PageCadastroColeta />} />
        <Route path="/gerenciamento-rotas" element={<PageGerencRotas />} />
      </Routes>
    </Router>
  );
}

export default App;
