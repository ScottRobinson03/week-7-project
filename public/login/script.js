const usernameInp = document.getElementById("uname");
const passwordInp = document.getElementById("psw");
const submitButton = document.getElementById("submit-btn");
const signUpBtn = document.getElementById("sign-up-btn");

const errorP = document.getElementById("error-msg");

const token = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1];
if (token) {
    location.href = "../..";
}

signUpBtn.addEventListener("click", () => {
    location.href = "../signup";
});

submitButton.addEventListener("click", async () => {
    const resp = await post("", {username: usernameInp.value, password: passwordInp.value});
    const json = await resp.json();
    if (resp.status === 200) {
        errorP.innerText = "";
        document.cookie = `token=${json.token}; path=/`;

        const data = JSON.parse(atob(json.token.split(".")[1])).data;
        document.cookie = `username=${data._doc.username}; path=/`;

        location.href = "../../";
    } else {
        errorP.innerText = json.message;
    }
});

async function post(url, data, token) {
    return await fetch(
        url,
        {
            method: "POST",
            headers: {'Content-Type': "application/json", "Authorization": token},
            body: JSON.stringify(data)
        }
    );
}