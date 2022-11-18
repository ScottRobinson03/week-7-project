const messageInput = document.getElementById("message-content");
const submitButton = document.getElementById("submit-message-btn");
const messageUl = document.getElementById("message-display");
const signOutButton = document.getElementById("sign-out-btn");

const socket = io();

const messages = fetch("../messages")
    .then(resp => resp.json())
    .then(messages => messages.forEach(
        msg => displayMessage({author: msg.authorName, content: msg.content, id: msg._id})
    )
).catch(err => console.log(err));

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (messageInput !== document.activeElement) return; // don't have the message input focused, so ignore
    if (e.keyCode !== 38) return; // key isn't the up arrow, so ignore

    let msgToEdit;
    for (let li of Array.from(messageUl.children).reverse()) {
        if (li.children[0].children[0].innerText === getCookie("username")) { // li.div.p-username
            msgToEdit = li;
            break
        }
    }
    if (!msgToEdit) return; // user hasn't sent any messages

    msgToEdit.scrollIntoView();

    const msgContentP = msgToEdit.children[0].children[1];

    const newContentInp = document.createElement("input");
    newContentInp.classList.add("message-content");
    newContentInp.value = msgContentP.innerText;

    document.activeElement.blur();

    newContentInp.addEventListener('focusout', () => {
        if (newContentInp.value === '') {
            // Delete the message
            socket.emit("delete message", {id: msgToEdit.id});
            return;
        }
        // Edit the message
        if (newContentInp.value === msgContentP.innerText) {
            // Content didn't change, so just set back to old p element
            newContentInp.blur();
            newContentInp.replaceWith(msgContentP);
            return;
        }
        socket.emit("edit message", {id: msgToEdit.id, newContent: newContentInp.value});
    });
    msgContentP.replaceWith(newContentInp);
    newContentInp.focus();
}

function displayMessage(msg) {
    const li = document.createElement("li");
    li.classList.add("message-component");
    li.id = msg.id;

    const clientUsername = getCookie("username");
    if (msg.author === clientUsername) {
        li.classList.add("own-message");
    }

    const div = document.createElement("div");
    div.classList.add("message-container");

    const pUsername = document.createElement("p");
    pUsername.classList.add("username");    
    pUsername.innerText = msg.author;
    
    const pMessage = document.createElement("p");
    pMessage.classList.add("message-content");
    pMessage.innerText = msg.content;

    div.append(pUsername, pMessage);
    li.append(div);
    messageUl.append(li);

    li.scrollIntoView();
}

async function signOut() {
    const resp = await fetch("../logout");
    if (resp.status !== 200) {
        console.log(await resp.json());
        return;
    }
    location.href = "../login"
    location.reload(); // needed to prevent accessing messages via back button
}

function getCookie(cookieName) {
    return document.cookie.split('; ').find((row) => row.startsWith(`${cookieName}=`))?.split('=')[1];
}

signOutButton.addEventListener("click", async () => {
    await signOut();
});

submitButton.addEventListener("click", () => {
    if (!messageInput.value) return;
    const messageAuthor = getCookie("username");
    socket.emit("chat message", {author: messageAuthor, content: messageInput.value});
    messageInput.value = "";
});

socket.on("user deleted", async username => {
    if (username === getCookie("username")) {
        await signOut();
    }
});

socket.on("chat message", msg => {
    displayMessage(msg);
});

socket.on("delete message", msg => {
    const liElement = document.getElementById(msg.id);
    liElement.blur();
    liElement.remove();
});

socket.on("edit message", msg => {
    const liElement = document.getElementById(msg.id);
    const oldElement = liElement.children[0].children[1] // li.div.p-content
    const newContentP = document.createElement("p");
    newContentP.classList.add("message-content");
    newContentP.innerText = msg.newContent;
    oldElement.replaceWith(newContentP);
});