// Importa React e o hook useState para gerenciar o estado do componente

import React, { useState } from 'react';

// Arrays com as opções de categorias e disponibilidades
const categorias = ['Entrada', 'Prato Principal', 'Sobremesa', 'Bebida'];
const disponibilidades = ['Em estoque', 'Esgotado'];

// Define o componente funcional CadastroPrato, que recebe as funções onSubmit e onVoltar como props

function CadastroPrato({ onSubmit, onVoltar }) {
    // Estado inicial do formulário, com os campos do prato

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: categorias[0],
    disponibilidade: disponibilidades[0],
    imagem: ''
  });

    // Função que atualiza o estado conforme o usuário digita nos campos

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    // Função chamada ao submeter o formulário

  const handleSubmit = e => {
    e.preventDefault();
        // Validação básica: nome e preço são obrigatórios

    if (!form.nome || !form.preco) {

      alert('Nome e preço são obrigatórios!');
      return;
    }
        // Chama a função onSubmit recebida como prop, passando os dados do formulário

    onSubmit(form);
        // Exibe alerta de sucesso

    alert('Prato cadastrado com sucesso!');
    onVoltar();
  };

  return (
        // Formulário com estilo centralizado e largura máxima de 400px

    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Cadastrar Novo Prato</h2>
      <input name="nome" placeholder="Nome do Prato" value={form.nome} onChange={handleChange} required />
      <textarea name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} rows={3} />
      <input type="number" name="preco" placeholder="Preço (R$)" value={form.preco} onChange={handleChange} required />
      
      <select name="categoria" value={form.categoria} onChange={handleChange}>
        {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      
      <select name="disponibilidade" value={form.disponibilidade} onChange={handleChange}>
        {disponibilidades.map(disp => <option key={disp} value={disp}>{disp}</option>)}
      </select>

      <input name="imagem" placeholder="URL da Imagem do Prato" value={form.imagem} onChange={handleChange} />
      <div style={{ marginTop: 10 }}>
        <button type="submit">Salvar</button>
        <button type="button" onClick={onVoltar} style={{ marginLeft: 10 }}>Voltar</button>
      </div>
    </form>
  );
}

// Exporta o componente para ser utilizado em outras partes da aplicação

export default CadastroPrato;
