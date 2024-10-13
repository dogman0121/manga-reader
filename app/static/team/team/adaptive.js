window.addEventListener("resize", () => {
    if (window.innerWidth <= 700){
        adapt_team();
    }
});

function adapt_team(){
    const name = document.querySelector(".name");
    const about = document.querySelector(".about");
    const members = document.querySelector(".members");

    members.before(name);
    members.before(about);

    const links = document.querySelector(".links__list");
    for(let i of links.querySelectorAll(".link__text"))
        i.remove();

    name.after(links);

    const titles = document.querySelector(".titles");

    members.after(titles);

}