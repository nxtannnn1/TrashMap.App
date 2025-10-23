document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const perfil = document.getElementById('perfil').value;
    const mensagemErro = document.getElementById('mensagem-erro');
    
    mensagemErro.textContent = '';

    try {
        // Envia POST para o backend
        const response = await fetch('http://localhost:8080/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha,
                tipoUsuario: perfil  // deve bater com o enum do backend: ADMIN ou MODERADOR
            })
        });

        if (!response.ok) {
            throw new Error('Credenciais ou perfil incorretos');
        }

        // Recebe o DTO retornado pelo backend
        const data = await response.json();

        // Armazena informações no LocalStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userProfile', data.tipoUsuario);
        localStorage.setItem('userName', data.nome);

        alert(`Bem-vindo(a) ${data.nome}! Acesso concedido.`);
        window.location.href = 'index.html'; 

    } catch (error) {
        mensagemErro.textContent = `Erro: ${error.message}`;
    }
});
