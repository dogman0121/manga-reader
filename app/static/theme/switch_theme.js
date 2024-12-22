let themeSwitcher = document.querySelector("input#hide-checkbox");

if (document.documentElement.hasAttribute("data-color-scheme")){
    const colorScheme = document.documentElement.getAttribute("data-color-scheme");

    if (themeSwitcher){
        if (colorScheme === "light")
            themeSwitcher.checked = true;
        else
            themeSwitcher.checked = false;
    }
}

if (themeSwitcher)
    themeSwitcher.addEventListener("input", function (){
        if (themeSwitcher.checked)
            setColorScheme("light");
        else
            setColorScheme("dark");
    })