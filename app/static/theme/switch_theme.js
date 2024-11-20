let themeSwitcher = document.querySelector("input#hide-checkbox");

if (document.documentElement.hasAttribute("data-color-scheme")){
    const colorScheme = document.documentElement.getAttribute("data-color-scheme");

    if (colorScheme === "light")
        themeSwitcher.checked = true;
    else
        themeSwitcher.checked = false;
}

themeSwitcher.addEventListener("input", function (){
    if (themeSwitcher.checked)
        setColorScheme("light");
    else
        setColorScheme("dark");
})