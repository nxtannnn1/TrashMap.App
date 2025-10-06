(function checkAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    
    // Se não estiver logado, redireciona de volta para a tela de login
    if (isLoggedIn !== 'true') {
        alert('Você precisa fazer login para acessar o painel.');
        // Substitua 'login.html' pelo nome do seu arquivo de login
        window.location.href = 'login.html'; 
    }
})();

function loadController(name) {
    fetch(`controller/${name}.html`)
        .then(res => {
            if (!res.ok) throw new Error('Controller não encontrado');
            return res.text();
        })
        .then(html => {
            const main = document.getElementById('main-content');
            main.innerHTML = html;

            // Remove scripts anteriores
            const oldScript = document.getElementById('controller-script');
            if (oldScript) oldScript.remove();

            // Carrega JS específico do controller
            const script = document.createElement('script');
            script.id = 'controller-script';
            script.src = `js/${name}.js`;
            document.body.appendChild(script);
        })
        .catch(err => {
            document.getElementById('main-content').innerHTML = `<p>Erro ao carregar: ${err.message}</p>`;
        });
}
