window.addEventListener("load", function (){
    const about = document.querySelector("#about");
    const lineHeight = parseFloat(window.getComputedStyle(about).lineHeight);

    if (parseFloat(window.getComputedStyle(about).height) > lineHeight * 4) {
        about.style.maxHeight = 4 * lineHeight + "px";

        let shown = false;
        const show = new Component("<div class='show-about'>Показать</div>");
        show.addEventListener("click", function () {
            if (shown) {
                about.style.maxHeight = 4 * lineHeight + "px";
                show.element.innerHTML = "Показать";
                shown = false;
            } else {
                about.style.maxHeight = "";
                show.element.innerHTML = "Скрыть";
                shown = true;
            }
        });
        about.after(show.render());
    }

})