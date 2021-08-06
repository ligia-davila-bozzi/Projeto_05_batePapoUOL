const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_USERS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status"

let user;

/*function login() {
    user = prompt("Qual é o seu nome?");

    const request = axios.post(URL_USERS, {name: user});
    request.then(loadMessages);
    request.catch(errorWarning);
}

function errorWarning(error) {
    if ( error.response.status === 400 ) {
        alert("Nome já em uso, tente outro nome!");
        login();
    }
    else {
        alert("Tente novmente!");
    }
}

login();

function sendStatus() {
    const request = axios.post(URL_STATUS, {name: user});
}

setInterval(sendStatus, 5000);*/

let messages;

function renderMessages() {
    const content = document.querySelector(".content");
    content.innerHTML = "";

    for ( let i = 0; i<messages.length; i++) {
        if ( messages[i].type === "private_message" && (messages[i].to === user || messages[i].from === user) ) {
            content.innerHTML += `<div class="message private"><span class="time">(${messages[i].time})</span><span class="name">${messages[i].from}</span> reservadamente para <span class="name">${messages[i].to}</span>: ${messages[i].text}</div>`
        }
        else if ( messages[i].type === "status" ) {
            content.innerHTML += `<div class="message status"><span class="time">(${messages[i].time})</span><span class="name">${messages[i].from}</span> ${messages[i].text}</div>`
        }
        else {
            content.innerHTML += `<div class="message"><span class="time">(${messages[i].time})</span><span class="name">${messages[i].from}</span> para <span class="name">${messages[i].to}</span>: ${messages[i].text}</div>`
        }
    }
}

function getMessages(object) {
    messages = object.data;
    
    renderMessages();
}

function loadMessages() {
    const promise = axios.get(URL_MESSAGES);

    promise.then(getMessages);
    promise.catch(function () {
        alert("Ocorreu algum erro, tente novamente!")
    })
}

setInterval(loadMessages, 3000);