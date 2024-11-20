let themeSwitcher = document.querySelector("input#hide-checkbox");
themeSwitcher.addEventListener("input", function (){
    if (themeSwitcher.checked)
        setColorScheme("light")
    else
        setColorScheme("dark");
})

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("color-scheme") || "light";

    setColorScheme(savedTheme);
});

function setColorScheme(schemeName) {
    switch (schemeName){
        case "dark":
            document.documentElement.setAttribute("data-color-scheme", "dark");
            themeSwitcher.checked = false;
            localStorage.setItem("color-scheme", "dark");
            break;
        case "light":
            document.documentElement.setAttribute("data-color-scheme", "light");
            themeSwitcher.checked = true;
            localStorage.setItem("color-scheme", "light");
            break
    }
}