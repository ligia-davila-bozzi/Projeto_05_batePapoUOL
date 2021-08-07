const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_USERS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status"

let user;

/*function login() {
    user = prompt("Qual é o seu nome?");

    const request = axios.post(URL_USERS, {name: user});
    request.then(loadMessages);
    request.catch(errorLogin);
}

function errorLogin(error) {
    if ( error.response.status === 400 ) {
        alert("Tente outro nome!");
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
    const last_message_before = document.querySelector(".message:last-child");
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

    const last_message_after = document.querySelector(".message:last-child");
    if ( last_message_before === null || last_message_after.innerHTML !== last_message_before.innerHTML ) {
        last_message_after.scrollIntoView();
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

function sendMessage() {
    const input = document.querySelector("input");
    const text = input.value;

    if ( text !== "" ) {
        input.value = "";
        const new_message = { from: user, to: "Todos", text, type: "message" };

        const request = axios.post(URL_MESSAGES, new_message);

        request.then(loadMessages);
        request.catch(errorSending);
    }
}

function errorSending() {
    alert("Você não está mais logado!");
    window.location.reload();
}

function messageConfig() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("hidden");

    const body = document.querySelector("body");
    body.classList.toggle("lock-scroll");
}