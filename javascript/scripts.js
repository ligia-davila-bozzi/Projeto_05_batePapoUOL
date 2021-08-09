const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status"

let new_message = { from: "", to: "Todos", text: "", type: "message" };

let messages;

function loadMessages() {
    const content = document.querySelector(".content");
    const last_message_before = document.querySelector(".message:last-child");
    content.innerHTML = "";

    for ( let i = 0; i<messages.length; i++) {
        if ( messages[i].type === "private_message" && (messages[i].to === new_message.from || messages[i].from === new_message.from) ) {
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

function updateStatus() {
    const request = axios.post(URL_STATUS, {name: new_message.from});
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

        if ( participants[i].name !== new_message.from ) {
            participants_list.innerHTML += `<div class="participant ${selected_class}" onclick="select(this)"><ion-icon class="person-icon" name="person-circle"></ion-icon><span class="name">${participants[i].name}</span><ion-icon class="check-icon" name="checkmark-sharp"></div>`
        }
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
    const login_screen = document.querySelector(".login-screen");
    login_screen.classList.add("hidden");

    const message_screen = document.querySelector(".content");
    message_screen.classList.remove("hidden");

    getMessages();
    updateStatus();
    getParticipantsList();
    setInterval(getMessages, 3000);
    setInterval(updateStatus, 5000);
    setInterval(getParticipantsList, 10000);
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

function login() {
    const user = document.querySelector(".login-screen input").value;

    if ( user !== "" ) {
        new_message.from = user;
        const request = axios.post(URL_PARTICIPANTS, {name: new_message.from});
        request.then(successfulLogin);
        request.catch(errorLogin);
    }
}

function errorSending() {
    alert("Você não está mais logado!");
    window.location.reload();
}

function sendMessage() {
    const input = document.querySelector(".bottom input");
    const text = input.value;

    if ( text !== "" ) {
        input.value = "";
        new_message.text = text;

        const request = axios.post(URL_MESSAGES, new_message);

        request.then(getMessages);
        request.catch(errorSending);
    }
}

function messageConfig() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("hidden");

    const body = document.querySelector("body");
    body.classList.toggle("lock-scroll");
}

function clearCheck(element) {
    const check = element.querySelector(".selected");
    check.classList.remove("selected");
}

function changeWarning() {
    const input_area = document.querySelector(".message-input");
    const warning = input_area.querySelector(".warning");

    if ( new_message.to !== "Todos" ) {
        input_area.classList.add("warning-text");
        warning.innerHTML = `Enviando para ${new_message.to}`;
        if ( new_message.type === "private_message" ) {
            warning.innerHTML += " (reservadamente)";
        }
    }
    else {
        input_area.classList.remove("warning-text");
        warning.innerHTML = "";
    }
}

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
    changeWarning();
}

document.onkeyup = function (e) {
    if ( e.which === 13 ) {
        sendMessage();
    }
}