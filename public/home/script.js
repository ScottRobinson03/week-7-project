const messageInput = document.getElementById("message-content");
const submitButton = document.getElementById("submit-message-btn");
const messageUl = document.getElementById("message-display");
const signOutButton = document.getElementById("sign-out-btn");

const socket = io();

const messages = fetch("../messages")
    .then(resp => resp.json())
    .then(messages => messages.forEach(
        msg => displayMessage({author: msg.authorName, content: msg.content})
    )
).catch(err => console.log(err));

signOutButton.addEventListener("click", async () => {
    const resp = await fetch("../logout");
    if (resp.status !== 200) {
        console.log(await resp.json());
        return;
    }
    location.href = "../login"
    location.reload(); // needed to prevent accessing messages via back button
});

submitButton.addEventListener("click", () => {
    //displayMessage(messageInput.value);
    if (!messageInput.value) return;
    const messageAuthor = document.cookie.split('; ').find((row) => row.startsWith('username='))?.split('=')[1]
    socket.emit("chat message", {author: messageAuthor, content: messageInput.value});
    messageInput.value = "";
});

socket.on("chat message", msg => {
    displayMessage(msg);
});

function displayMessage(msg) {
    const li = document.createElement("li");
    li.classList.add("message-component");
    const clientUsername = document.cookie.split('; ').find((row) => row.startsWith('username='))?.split('=')[1];
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