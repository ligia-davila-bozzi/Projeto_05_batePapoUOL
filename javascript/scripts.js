const URL_MENSAGENS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"

let mensagens;

function carregarMensagens() {
    const promise = axios.get(URL_MENSAGENS);

    promise.then(buscarMensagens);
}

function buscarMensagens(objeto) {
    mensagens = objeto.data;
    
    renderizarMensagens();
}

function renderizarMensagens(objeto) {
    const conteudo = document.querySelector(".conteudo");
    conteudo.innerHTML = "";

    const status = ``

    for ( let i = 0; i<mensagens.length; i++) {
        if ( mensagens[i].type === "status" ) {
            conteudo.innerHTML += `<div class="mensagem status"><span class="hora">(${mensagens[i].time})</span><span class="nome">${mensagens[i].from}</span> ${mensagens[i].text}</div>`
        }
        else if ( mensagens[i].type === "message" ) {
            conteudo.innerHTML += `<div class="mensagem"><span class="hora">(${mensagens[i].time})</span><span class="nome">${mensagens[i].from}</span> para <span class="nome">${mensagens[i].to}</span>: ${mensagens[i].text}</div>`
        }
        else {
            conteudo.innerHTML += `<div class="mensagem reservada"><span class="hora">(${mensagens[i].time})</span><span class="nome">${mensagens[i].from}</span> reservadamente para <span class="nome">${mensagens[i].to}</span>: ${mensagens[i].text}</div>`
        }
    }
}

carregarMensagens();

setInterval(carregarMensagens, 3000);