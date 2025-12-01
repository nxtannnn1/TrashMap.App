import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importante para redirecionar sem recarregar
import { useAuth } from "../../context/AuthContext"; // Importe o hook
import "./login.css";
import elevadorImg from "../../assets/img/elevador-lacerda.jpeg";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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
    // Chama a função do contexto
    const resultado = await signIn(email, senha);
    setLoading(false);

    if (resultado.success) {
      navigate("/"); // Redireciona para a Home protegida
    } else {
      setErro(resultado.msg);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
      </div>
    </div>
  );
}
