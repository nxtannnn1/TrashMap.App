// // src/pages/CadastroRota.jsx
// import React, { useState, useEffect } from "react";
// import { API_BASE_URL } from "../config/api";

// export default function CadastroRota() {
//   const [pontos, setPontos] = useState([]);
//   const [pontoSelecionado, setPontoSelecionado] = useState("");
//   const [nomeRota, setNomeRota] = useState("");
//   const [coordenadas, setCoordenadas] = useState([]);
//   const [erro, setErro] = useState("");
//   const [sucesso, setSucesso] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Carrega os pontos de coleta do backend
//   useEffect(() => {
//     const fetchPontos = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/pontos-de-coleta`);
//         if (!res.ok) throw new Error("Erro ao carregar pontos");
//         const data = await res.json();
//         console.log("Pontos recebidos:", data); // para debug
//         setPontos(Array.isArray(data) ? data : []);
//       } catch (err) {
//         setErro("Não foi possível carregar os pontos de coleta.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPontos();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErro("");
//     setSucesso("");

//     if (!pontoSelecionado || !nomeRota || coordenadas.length === 0) {
//       setErro("Preencha todos os campos corretamente.");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE_URL}/rotas`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           pontoDeColetaId: Number(pontoSelecionado),
//           nome: nomeRota,
//           coordenadas: coordenadas,
//         }),
//       });

//       if (!res.ok) {
//         setErro("Erro ao cadastrar rota. Verifique os dados.");
//         return;
//       }

//       setSucesso("Rota cadastrada com sucesso!");
//       setNomeRota("");
//       setPontoSelecionado("");
//       setCoordenadas([]);
//     } catch (err) {
//       console.error(err);
//       setErro("Erro inesperado. Tente novamente.");
//     }
//   };

//   return (
//     <div className="cadastro-rota-container">
//       <h2>Cadastro de Rota</h2>

//       {loading ? (
//         <p>Carregando pontos de coleta...</p>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <label>Ponto de Coleta:</label>
//           <select
//             value={pontoSelecionado}
//             onChange={(e) => setPontoSelecionado(e.target.value)}
//           >
//             <option value="">Selecione</option>
//             {pontos.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.nome}
//               </option>
//             ))}
//           </select>

//           <label>Nome da Rota:</label>
//           <input
//             type="text"
//             value={nomeRota}
//             onChange={(e) => setNomeRota(e.target.value)}
//           />

//           <label>Coordenadas (Ex: -12.932,-38.507):</label>
//           <input
//             type="text"
//             placeholder="Latitude,Longitude"
//             onChange={(e) => {
//               const coords = e.target.value.split(",").map(Number);
//               if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
//                 setCoordenadas([{ latitude: coords[0], longitude: coords[1] }]);
//               } else {
//                 setCoordenadas([]);
//               }
//             }}
//           />

//           <button type="submit">Cadastrar</button>
//         </form>
//       )}

//       {erro && <p style={{ color: "red" }}>{erro}</p>}
//       {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
//     </div>
//   );
// }
