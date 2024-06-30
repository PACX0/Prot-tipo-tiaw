const LOGIN_URL = "index.html"; // Atualize para o novo caminho da página de login

// Objeto para o banco de dados de usuários baseado em JSON
var db_usuarios = {};

// Objeto para o usuário corrente
var usuarioCorrente = {};

// Função para gerar códigos randômicos a serem utilizados como código de usuário
function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Dados de usuários para serem utilizados como carga inicial
const dadosIniciais = {
    usuarios: [
        { id: generateUUID(), login: "admin", senha: "123", nome: "Administrador do Sistema", email: "admin@abc.com" },
        { id: generateUUID(), login: "user", senha: "123", nome: "Usuario Comum", email: "user@abc.com" }
    ]
};

// Inicializa o usuarioCorrente e banco de dados de usuários da aplicação de Login
function initLoginApp() {
    // Inicializa usuarioCorrente a partir de dados no sessionStorage, caso exista
    var usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }

    // Inicializa banco de dados de usuários
    var usuariosJSON = localStorage.getItem('db_usuarios');

    if (!usuariosJSON) {
        // Carrega os dados iniciais
        db_usuarios = dadosIniciais;
        localStorage.setItem('db_usuarios', JSON.stringify(dadosIniciais));
    } else {
        db_usuarios = JSON.parse(usuariosJSON);
    }
}

// Verifica se o login do usuário está ok e, se positivo, direciona para a página inicial
function loginUser(login, senha) {
    for (var i = 0; i < db_usuarios.usuarios.length; i++) {
        var usuario = db_usuarios.usuarios[i];

        if (login == usuario.login && senha == usuario.senha) {
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.login;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.nome = usuario.nome;
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
            return true;
        }
    }
    return false;
}

// Processa o formulário de login
function processaFormLogin(form) {
    event.preventDefault();
    var username = form.username.value;
    var password = form.password.value;

    var loginSuccess = loginUser(username, password);

    if (loginSuccess) {
        alert('Login bem-sucedido! Redirecionando...');
        window.location.href = 'painel.html';
    } else {
        alert('Usuário ou senha incorretos.');
    }
    return false;
}

// Adiciona um novo usuário
function addUser(username, fullname, email, password) {
    var newId = generateUUID();
    var newUser = {
        id: newId,
        login: username,
        nome: fullname,
        email: email,
        senha: password
    };

    db_usuarios.usuarios.push(newUser);
    localStorage.setItem('db_usuarios', JSON.stringify(db_usuarios));
}

// Função de logout do usuário
function logoutUser() {
    usuarioCorrente = {};
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
    window.location.href = LOGIN_URL; // Redireciona para index.html após logout
}

// Event listener para o formulário de registro
document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var username = document.getElementById('register-username').value;
    var fullname = document.getElementById('register-fullname').value;
    var email = document.getElementById('register-email').value;
    var password = document.getElementById('register-password').value;
    var confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem. Por favor, verifique.');
        return;
    }

    addUser(username, fullname, email, password);

    alert('Usuário cadastrado com sucesso!');
    $('#registerModal').modal('hide');
});

initLoginApp();
