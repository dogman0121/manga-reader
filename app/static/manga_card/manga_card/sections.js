function underLineSection(element) {
    let chosen = document.querySelector(".sections-buttons__item_active");

    if (chosen === element)
        return null;

    chosen.classList.remove("sections-buttons__item_active");

    element.classList.add("sections-buttons__item_active");
}


let sections = document.querySelector(".sections-buttons");

sections.addEventListener("click", (event) => {
    if (!event.target.classList.contains("sections-buttons__item"))
        return null;

    if (event.target.id === "chapters-button")
        chooseSection("chapters");
    if (event.target.id === "comments-button")
        chooseSection("comments");
    if (event.target.id === "info-button")
        chooseSection("info");
    underLineSection(event.target);
});

function selectSection(sectionName){
    document.querySelector(".section_selected").classList.remove("section_selected");
    if (sectionName === "chapters")
        document.querySelector("#chapters").classList.add("section_selected");
    if (sectionName === "comments")
        document.querySelector("#comments").classList.add("section_selected");
    if (sectionName === "info")
        document.querySelector("#info").classList.add("section_selected");
}

function chooseSection(sectionName){

    if (sectionName === "chapters"){
        selectSection("chapters");
    }

    if (sectionName === "comments") {
        if (!document.querySelector("#comments"))
            document.querySelector(".sections__content").append(new Section("comments", new TitleComment()).renderDOM());
        selectSection("comments");
    }

    if (sectionName === "info"){
        selectSection("info");
    }
}

class Section extends Component {
    constructor(sectionName, content) {
        super();
        this.content = content;
        this.sectionName = sectionName;
    }

    render () {
        return `
            <div id="${this.sectionName}" class="section">
                {{ this.content }}
            </div>
        `
    }
}