const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status"

let user;

function login() {
    user = prompt("Qual é o seu nome?");

    const request = axios.post(URL_PARTICIPANTS, {name: user});
    request.then(successfulLogin);
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

function updateStatus() {
    const request = axios.post(URL_STATUS, {name: user});
}

setInterval(updateStatus, 5000);

let messages;

function loadMessages() {
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

function updateMessages(object) {
    messages = object.data;
    
    loadMessages();
}

function getMessages() {
    const promise = axios.get(URL_MESSAGES);

    promise.then(updateMessages);
    promise.catch(function () {
        alert("Ocorreu algum erro, tente novamente!")
    })
}

setInterval(getMessages, 3000);

function sendMessage() {
    const input = document.querySelector("input");
    const text = input.value;

    if ( text !== "" ) {
        input.value = "";
        new_message.text = text;

        const request = axios.post(URL_MESSAGES, new_message);

        request.then(getMessages);
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

let participants;

function loadParticipantsList() {
    const participants_list = document.querySelector(".participants-list");
    participants_list.innerHTML = `<div class="participant" onclick="select(this)"><ion-icon class="person-icon" name="people"></ion-icon><span class="name">Todos</span><ion-icon class="check-icon" name="checkmark-sharp"></ion-icon></div>`;

    let selected_class;

    for ( let i = 0; i<participants.length; i++) {
        if ( participants[i].name === new_message.to )  {
            selected_class = "selected";
        }
        else {
            selected_class = "";
        }

        participants_list.innerHTML += `<div class="participant ${selected_class}" onclick="select(this)"><ion-icon class="person-icon" name="person-circle"></ion-icon><span class="name">${participants[i].name}</span><ion-icon class="check-icon" name="checkmark-sharp"></div>`
    }

    const checked = document.querySelector(".participant.selected");
    if ( checked === null ) {
        const first_participant = document.querySelector(".participant");
        first_participant.classList.add("selected");
        select(first_participant);
    }
}

function updateParticipantsList(list) {
    participants = list.data;

    loadParticipantsList()
}

function getParticipantsList() {
    const promise = axios.get(URL_PARTICIPANTS);

    promise.then(updateParticipantsList);
}

function successfulLogin() {
    getMessages();
    getParticipantsList();
}

setInterval(getParticipantsList, 10000);

let new_message = { from: user, to: "Todos", text: "", type: "message" }

function select(element) {
    const message_type = element.parentNode;
    clearCheck(message_type);

    if ( message_type.classList.contains("participants-list") ) {
        new_message.to = element.innerText;
    }
    else {
        new_message.type = element.querySelector("span").className;
    }

    element.classList.add("selected");
}

function clearCheck(element) {
    const check = element.querySelector(".selected");
    check.classList.remove("selected");
}