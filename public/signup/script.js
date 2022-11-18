const submitBtn = document.getElementById("sign-up-btn");
const cancelBtn = document.getElementById("cancel-btn");

const errorP = document.getElementById("error-msg");

const usernameInp = document.getElementById("username");
const emailInp = document.getElementById("email");
const passwordInp = document.getElementById("psw");
const passwordConfirmInp = document.getElementById("psw-repeat");

const token = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1];
if (token) {
    location.href = "../..";
}

cancelBtn.addEventListener("click", () => {
    location.href = "../login";
});

submitBtn.addEventListener("click", async () => {
    if (passwordInp.value !== passwordConfirmInp.value) {
        errorP.innerText = "Entered passwords do not match."
        return;
    }

    const resp = await post("", {username: usernameInp.value, email: emailInp.value, password: passwordInp.value});
    const json = await resp.json()

    if (resp.status === 201) {
        errorP.innerText = "";
        document.cookie = `token=${json.token}; path=/`;
        document.cookie = `username=${usernameInp.value}; path=/`;
        location.href = "../../";
    } else {
        errorP.innerText = json.errors[0].msg === "Invalid value" ? "email must be a valid email address": json.errors[0].msg;
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