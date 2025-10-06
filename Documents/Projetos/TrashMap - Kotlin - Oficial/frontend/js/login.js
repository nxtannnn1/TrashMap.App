// login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const perfil = document.getElementById('perfil').value;
    const mensagemErro = document.getElementById('mensagem-erro');
    
    mensagemErro.textContent = '';
    
    // --- LÓGICA DE AUTENTICAÇÃO SIMULADA ---
    
    let isAutenticado = false;
    
    // Credenciais de ADMIN (simuladas)
    if (email === 'admin@app.com' && senha === '12345' && perfil === 'ADMIN') {
        isAutenticado = true;
        // 1. Armazena as informações de login no navegador (usando LocalStorage)
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userProfile', 'ADMIN');
        localStorage.setItem('userName', nome);

    } 
    // Credenciais de MODERADOR (simuladas)
    else if (email === 'mod@app.com' && senha === '12345' && perfil === 'MOD') {
        isAutenticado = true;
        // 1. Armazena as informações de login no navegador
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userProfile', 'MOD');
        localStorage.setItem('userName', nome);
    }
    
    // 2. Ação após a verificação
    if (isAutenticado) {
        alert(`Bem-vindo(a) ${nome}! Acesso concedido.`);
        
        // 3. Redireciona para o Painel SPA (index.html)
        window.location.href = 'index.html'; 
    } else {
        mensagemErro.textContent = 'Erro: Credenciais ou perfil incorretos. Tente novamente.';
    }
});