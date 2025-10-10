// ================================
// 1️⃣ Verificação de login
// ================================
(function checkAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');

    // Redireciona para login caso não esteja logado
    if (isLoggedIn !== 'true') {
        alert('Você precisa fazer login para acessar o painel.');
        window.location.href = 'login.html';
    }
})();

// ================================
// 2️⃣ Função para carregar controllers
// ================================
function loadController(name) {
    fetch(`controller/${name}.html`)
        .then(res => {
            if (!res.ok) throw new Error('Controller não encontrado');
            return res.text();
        })
        .then(html => {
            const main = document.getElementById('main-content');
            main.innerHTML = html;

            // Remove script antigo, se houver
            const oldScript = document.getElementById('controller-script');
            if (oldScript) oldScript.remove();

            // Carrega JS específico do controller
            const script = document.createElement('script');
            script.id = 'controller-script';
            script.src = `js/${name}.js`;
            document.body.appendChild(script);
        })
        .catch(err => {
            const main = document.getElementById('main-content');
            main.innerHTML = `<p>Erro ao carregar: ${err.message}</p>`;
        });
}
