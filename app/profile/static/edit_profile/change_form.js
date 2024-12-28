let general = document.querySelector(".general-section");
let generalForm = document.querySelector(".general-settings");
general.addEventListener("click", function (){
    password.classList.remove("section-button_selected")
    general.classList.add("section-button_selected");
    passwordForm.hidden = true;
    generalForm.hidden = null;
    let url = new URL(window.location.href);
    url.searchParams.set("section", "general");
    window.history.pushState(null, null, url.toString());
});

let password = document.querySelector(".password-section");
let passwordForm = document.querySelector(".change-password");

password.addEventListener("click", function (){
    general.classList.remove("section-button_selected")
    password.classList.add("section-button_selected");
    generalForm.hidden = true;
    passwordForm.hidden = null;
    let url = new URL(window.location.href);
    url.searchParams.set("section", "password");
    window.history.pushState(null, null, url.toString());
});

document.querySelector(".change-photo-button").onclick = (event) => {
    document.querySelector("input[type='file']#avatar").click();
    event.preventDefault();
}