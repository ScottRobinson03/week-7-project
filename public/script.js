const messageInput = document.getElementById("message-content");
const submitButton = document.getElementById("submit-message-btn");
const messageUl = document.getElementById("message-display");

submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    displayMessage(messageInput.value);
});

function displayMessage(messageContent) {
    const li = document.createElement("li");
    li.classList.add("message-component", "own-message");
    
    const div = document.createElement("div");
    div.classList.add("message-container");

    const pUsername = document.createElement("p");
    pUsername.classList.add("username");
    pUsername.innerText = "Anonymous";
    
    const pMessage = document.createElement("p");
    pMessage.classList.add("message-content");
    pMessage.innerText = messageContent;

    div.append(pUsername, pMessage);
    li.append(div);
    messageUl.append(li);

    li.scrollIntoView();
    messageInput.value = "";
}