const URL_MENSAGENS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_USUARIOS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status"

let usuario;

/*function entrar() {
    usuario = prompt("Qual é o seu nome?");

    const request = axios.post(URL_USUARIOS, {name: usuario});
    request.then(carregarMensagens);
    request.catch(tratarErroLogin);
}

function tratarErroLogin(erro) {
    if ( erro.response.status === 400 ) {
        alert("Tente outro nome!");
        entrar();
    }
    else {
        alert("Outro erro!");
    }
}

entrar();

function atualizarStatus() {
    const request = axios.post(URL_STATUS, {name: usuario});
}

setInterval(atualizarStatus, 5000);*/

let mensagens;

function renderizarMensagens(objeto) {
    const conteudo = document.querySelector(".conteudo");
    conteudo.innerHTML = "";

    for ( let i = 0; i<mensagens.length; i++) {
        if ( mensagens[i].type === "private_message" && mensagens[i].to === usuario ) {
            conteudo.innerHTML += `<div class="mensagem reservada"><span class="hora">(${mensagens[i].time})</span><span class="nome">${mensagens[i].from}</span> reservadamente para <span class="nome">${mensagens[i].to}</span>: ${mensagens[i].text}</div>`
        }
        else if ( mensagens[i].type === "status" ) {
            conteudo.innerHTML += `<div class="mensagem status"><span class="hora">(${mensagens[i].time})</span><span class="nome">${mensagens[i].from}</span> ${mensagens[i].text}</div>`
        }
        else {
            conteudo.innerHTML += `<div class="mensagem"><span class="hora">(${mensagens[i].time})</span><span class="nome">${mensagens[i].from}</span> para <span class="nome">${mensagens[i].to}</span>: ${mensagens[i].text}</div>`
        }
    }
}

function buscarMensagens(objeto) {
    mensagens = objeto.data;
    
    renderizarMensagens();
}

function carregarMensagens() {
    const promise = axios.get(URL_MENSAGENS);

    promise.then(buscarMensagens);
}

setInterval(carregarMensagens, 3000);