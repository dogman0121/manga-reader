class SectionList extends Component {
    constructor(sections) {
        super();

        this.sections = sections;
        this.selectedSection = this.sections[0];
        this.currentContent = new State(this.sections[0].content)
    }

    html() {
        return `
            <div class="sections">
                <div class="sections__buttons sections-buttons">
                    {{ this.sections.map(section => section.button) }}
                </div>
                <section class="sections__content">
                    {{ this.currentContent }}
                </section>
            </div>
        `
    }

    addSection(sectionName, sectionPlaceholder, sectionContent){
        this.sections.add(new Section(sectionName, sectionPlaceholder, sectionContent));
    }

    events(element) {
        this.selectedSection.select();
        this.sections.forEach((section) => section.addEventListener("chooseSection", this.onChooseSection.bind(this)));
    }

    onChooseSection(event) {
        const section = event.detail.section;

        this.selectedSection.unselect();
        section.select();
        this.selectedSection = section;

        this.currentContent.set(this.selectedSection.content);
    }
}


class Section extends Component {
    constructor(name, placeholder, content) {
        super();

        this.name = name;
        this.button = new SectionButton(name, placeholder);
        this.content = new SectionContent(name, content);

        this.button.addEventListener("click", this.onClick.bind(this));
    }

    onClick(event){
        this.dispatchEvent(new CustomEvent("chooseSection", {detail: {section: this}}));
    }

    select() {
        this.button.element.classList.add("sections-buttons__item_active");
    }

    unselect() {
        this.button.element.classList.remove("sections-buttons__item_active");
    }
}

class SectionButton extends Component{
    constructor(sectionName, sectionPlaceholder) {
        super();

        this.sectionName = sectionName;
        this.sectionPlaceholder = sectionPlaceholder;
    }

    html() {
        return `
            <div class="sections-buttons__item" id=\"${ this.sectionName }\"-button">{{ this.sectionPlaceholder }}</div>
        `
    }

    events(element) {
        element.addEventListener("click", this.onClick.bind(this))
    }

    onClick(event) {
        this.dispatchEvent(new CustomEvent("click"));
    }
}

class SectionContent extends Component {
    constructor(sectionName, sectionContent) {
        super();

        this.sectionName = sectionName;
        this.sectionContent = sectionContent;
    }

    html() {
        return `
            <div id="${this.sectionName}" class="section">
                {{ this.sectionContent }}
            </div>
        `
    }
}
