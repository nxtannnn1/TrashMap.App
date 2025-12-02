
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Valores pré-preenchidos para facilitar testes
  const [email, setEmail] = useState("admin1@trashmap.com");
  const [senha, setSenha] = useState("AdmTrashMap");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Enviando login para:", email); // Debug
      const resultado = await signIn(email, senha);
      
      if (resultado.success) {
        console.log("Login bem-sucedido!");
        navigate("/dashboard");
      } else {
        setErro(resultado.msg || "Credenciais inválidas");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Acesso Restrito</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu.email@exemplo.com"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="********"
            required
          />

          <button className="entrar-btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>

          {erro && <p className="erro">{erro}</p>}
        </form>
        
        {/* DEBUG: Mostra os valores atuais */}
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Debug: Email: {email} | Senha: {senha.replace(/./g, '*')}
        </div>
      </div>
    </div>
  );
}
