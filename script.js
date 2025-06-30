document.getElementById('caminhaoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const placa = document.getElementById('placa').value.trim();
  const status = document.getElementById('status').value;
  const capacidadeKg = parseInt(document.getElementById('capacidadeKg').value);
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);

  const caminhao = {
    placa,
    status,
    capacidadeKg,
    latitude,
    longitude,
  };

  const mensagemEl = document.getElementById('mensagem');
  mensagemEl.classList.remove('sucesso');

  try {
    const response = await fetch('http://localhost:8080/caminhao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caminhao),
    });

    if (response.ok) {
      mensagemEl.textContent = 'Caminhão cadastrado com sucesso!';
      mensagemEl.classList.add('sucesso');
      this.reset();
    } else {
      const errorText = await response.text();
      mensagemEl.textContent = 'Erro ao cadastrar caminhão: ' + errorText;
    }
  } catch (error) {
    console.error(error);
    mensagemEl.textContent = 'Erro de conexão com o servidor.';
  }
});
