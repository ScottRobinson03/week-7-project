const messageInput = document.getElementById("message-content");
const submitButton = document.getElementById("submit-message-btn");
const messageUl = document.getElementById("message-display");
const signOutButton = document.getElementById("sign-out-btn");

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
    displayMessage(messageInput.value);
});

function displayMessage(messageContent) {
    const li = document.createElement("li");
    li.classList.add("message-component", "own-message");
    
    const div = document.createElement("div");
    div.classList.add("message-container");

    const pUsername = document.createElement("p");
    pUsername.classList.add("username");
    // Get username from the username cookie
    const username = document.cookie.split('; ').find((row) => row.startsWith('username='))?.split('=')[1];
    pUsername.innerText = username;
    
    const pMessage = document.createElement("p");
    pMessage.classList.add("message-content");
    pMessage.innerText = messageContent;

    div.append(pUsername, pMessage);
    li.append(div);
    messageUl.append(li);

    li.scrollIntoView();
    messageInput.value = "";
}