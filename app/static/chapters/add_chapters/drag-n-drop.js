class PagesSection extends Component {
    pages = [];
    addingPage = new AddingPagesPage();

    constructor(pages=[]) {
        super();
        this.pages = pages;
    }

    html(){
        return `
            <div class="pages__pages">
                {{ this.pages }}
                {{ this.addingPage }}
            </div>
        `
    }

    events(element) {
        this.addingPage.addEventListener("filesDragged", this.dispatchEvent.bind(this));
        this.addingPage.addEventListener("fileOpened", this.dispatchEvent.bind(this));
    }

    onInit(){
        let pages = this.element.querySelectorAll(".pages__page");

        for(let page of pages) {
            let tempPage = new Page();
            this.registerPageEvents(tempPage);

            tempPage.init(page);
            this.pages.push(tempPage);
        }

        let addPage = this.element.querySelector(".pages__add");
        this.addingPage.init(addPage);
    }

    addPage(fileName, url) {
        let page = new Page(fileName, url);
        this.registerPageEvents(page);

        let addPage = this.element.querySelector(".pages__add");
        this.pages.push(page);

        addPage.before(page.render());
    }

    onDeletePage(event){
        let ind = this.pages.indexOf(event.detail.page);
        this.pages.splice(ind, 1);
        let customEvent = new CustomEvent("pageDeleted", {detail: event.detail});
        this.dispatchEvent(customEvent);
    }

    async getFilesFromImages() {
        let files = [];
        for (let i = 0; i < this.pages.length; i++){
            await fetch(this.pages[i].url)
                .then(response => response.blob())
                .then(blob => {
                    let file = new File([blob], `${i+1}.jpeg`, {type:"image/jpeg"});
                    files.push(file);
                });
        }
        return files;
    }

    registerPageEvents(page){
        page.addEventListener("deleted", this.onDeletePage.bind(this));
        page.addEventListener("move", this.onMovePage.bind(this));
    }

    _getPageFromCords(x, y, currentPage){
        for(let page of this.pages){
            if (page === currentPage)
                continue;
            let pageCords = page.element.getBoundingClientRect();
            if ((pageCords.left <= x && x <= pageCords.right) && (pageCords.top <= y && y <= pageCords.bottom))
                return page;
        }
    }

    _pageInsertBefore(source, destination){
        if(source.element === destination.element.previousElementSibling)
            return;

        const sourceInd = this.pages.indexOf(source);
        const destinationInd = this.pages.indexOf(destination);

        let destinationCords;
        if (sourceInd < destinationInd)
            destinationCords = destination.element.previousElementSibling.getBoundingClientRect();
        else
            destinationCords = destination.element.getBoundingClientRect();


        source.x = (source.x - source.cords.left) + destinationCords.left;
        source.y = (source.y - source.cords.bottom) + destinationCords.bottom;
        source.cords = destinationCords;

        this._movePage(sourceInd, destinationInd, 1);
        destination.element.before(source.element);
        this.dispatchEvent(new CustomEvent("pagesSwitched",
            {detail: {"source": sourceInd, "destination": destinationInd, "flag": true}}));
    }

    _pageInsertAfter(source, destination){
        if (source.element === destination.element.nextElementSibling)
            return;

        const sourceInd = this.pages.indexOf(source);
        const destinationInd = this.pages.indexOf(destination);

        let destinationCords;
        if (sourceInd < destinationInd)
            destinationCords = destination.element.getBoundingClientRect();
        else
            destinationCords = destination.element.nextElementSibling.getBoundingClientRect();
        
        source.x = (source.x - source.cords.left) + destinationCords.left;
        source.y = (source.y - source.cords.bottom) + destinationCords.bottom;
        source.cords = destinationCords;

        this._movePage(sourceInd, destinationInd);
        destination.element.after(source.element);
        this.dispatchEvent(new CustomEvent("pagesSwitched",
            {detail: {"source": sourceInd, "destination": destinationInd, "flag": false}}));
    }

    _movePage(sourceInd, destinationInd, flag = 0){
        if (sourceInd < destinationInd){
            for(let i = sourceInd; i < destinationInd - flag; i++){
                let t = this.pages[i];
                this.pages[i] = this.pages[i+1];
                this.pages[i+1] = t;
            }
        }
        else{
            for(let i = sourceInd; i > destinationInd + !flag; i--){
                let t = this.pages[i];
                this.pages[i] = this.pages[i-1];
                this.pages[i-1] = t;
            }
        }
    }

    onMovePage(event){
        const page = this._getPageFromCords(event.detail.x, event.detail.y, event.detail.page);

        if (!page)
            return;

        const currentPage = event.detail.page;
        const cords = page.element.getBoundingClientRect();

        if (event.detail.x < (cords.left + cords.right)/2)
            this._pageInsertBefore(currentPage, page);
        else
            this._pageInsertAfter(currentPage, page);

        event.detail.page.moveAt(event.detail.x, event.detail.y);
    }

    clean() {
        this.pages = [];
        this.element.querySelectorAll(".pages__page").forEach((page) => page.remove());
    }
}

class Page extends Component {
    constructor(fileName, url) {
        super();
        this.fileName = fileName;
        this.url = url;
    }

    html(){
        return `
            <div class="pages__page">
                <img class="page__image" src="${this.url}">
                <img src="/static/chapters/add_chapters/images/close.svg" class="page__delete">
                <span>${this.fileName}.jpeg</span>
            </div>
        `
    }

    events(element) {
        this.element.querySelector(".page__delete").addEventListener("click", this.onDelete.bind(this));
        this.element.addEventListener("mousedown", this.onDragStart.bind(this));
        this.element.addEventListener("mouseup", this.onDragEnd.bind(this));
        this.element.ondragstart = () => {return false;};
    }

    onInit() {
        this.url = this.element.querySelector(".page__image").src;
        this.fileName = this.element.querySelector("span").textContent;
    }

    onDelete(){
        this.element.remove();
        this.dispatchEvent(new CustomEvent("deleted", {detail: {"page": this}}));
    }

    moveAt(x, y){
        this.element.style.transform = `translate3D(${x - this.x}px, ${y - this.y}px ,0px)`;
    }

    onDragStart(event){
        this.x = event.clientX;
        this.y = event.clientY;
        this.cords = this.element.getBoundingClientRect();
        this.element.onmousemove = this.onDrag.bind(this);
        this.element.style.zIndex = 1001;
        this.dispatchEvent(new CustomEvent("mousedown", {detail: {"page": this}}));
    }

    onDragEnd(event){
        this.element.style.transform = null;
        this.element.onmousemove = null;
        this.element.style.zIndex = null;
        this.dispatchEvent(new CustomEvent("mouseup", {detail: {"page": this}}));
    }

    onDrag(event){
        this.dispatchEvent(
            new CustomEvent("move",
                {detail: {"page": this, "x": event.clientX, "y": event.clientY}}
            )
        );
        this.moveAt(event.clientX, event.clientY);
    }
}

class NoPagesSection extends Component {
    html() {
        return `
            <div class="upload-zone">
                <p class="pages__text">Выберите .ZIP архивы или обычные изображения</p>
            </div>
        `
    }

    events(element) {
        this.element.addEventListener("click", this.onFormClick.bind(this));
        this.element.addEventListener("dragover", this.onDragOver);
        this.element.addEventListener("drop", this.onDrop.bind(this));
    }

    onDrop(event) {
        let files = event.dataTransfer?.files;
        let customEvent = new CustomEvent("filesDragged", {detail: {"files": files}});
        event.preventDefault();
        this.dispatchEvent(customEvent);
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onFormClick(event) {
        let customEvent = new CustomEvent("fileOpened");
        this.dispatchEvent(customEvent);
    }
}

class AddingPagesPage extends NoPagesSection {
    html(){
        return `
            <div class="pages__add"></div>
        `
    }
}

class PagesContainer extends Component{
    pagesSection = new PagesSection();
    noPagesSection = new NoPagesSection();
    chosenSection = this.noPagesSection;
    fileInput = new FileInput();

    constructor() {
        super();
    }

    html() {
        return `
            <div class="inputs-input pages__container">
                {{ this.noPagesSection }}
            </div>
        `
    }

    events(element) {
        this.noPagesSection.addEventListener("fileOpened", this.fileInput.open.bind(this.fileInput));
        this.noPagesSection.addEventListener("filesDragged", (e) => { this.fileInput.add(...e.detail.files) });
        this.pagesSection.addEventListener("fileOpened", this.fileInput.open.bind(this.fileInput));
        this.pagesSection.addEventListener("filesDragged", (e) => { this.fileInput.add(...e.detail.files) });
        this.pagesSection.addEventListener("pagesSwitched", this.onSwitchPage.bind(this));
        this.fileInput.addEventListener("fileAdded", this.onAddFile.bind(this));
        this.pagesSection.addEventListener("pageDeleted", this.onDeleteFile.bind(this));
    }

    chooseSection(section) {
        if (this.chosenSection === section) {
            return null;
        }
        else {
            this.chosenSection.element.replaceWith(section.element);
            this.chosenSection = section;
        }
    }


    onInit(){
        let pages = this.element.querySelector(".pages__pages");
        let noPages = this.element.querySelector(".upload-zone");
        let fileInput = this.element.querySelector("input[type='file']");

        if (pages) {
            this.noPagesSection.render();
            this.chosenSection = this.pagesSection;
            this.pagesSection.init(pages);
            this.pagesSection.getFilesFromImages().then((files) => {this.fileInput.set(...files)});
        }
        else if (noPages) {
            this.pagesSection.render();
            this.chosenSection = this.noPagesSection;
            this.noPagesSection.init(noPages);
        }
        if (fileInput){
            this.fileInput.init(fileInput);
        }
    }

    onAddFile(event) {
        if (!this.pagesSection.pages.length)
            this.chooseSection(this.pagesSection);

        let file = event.detail.file;
        let url = URL.createObjectURL(file);
        let name = file.name;
        this.pagesSection.addPage(name, url);
    }

    onDeleteFile(event) {
        if (!this.pagesSection.pages.length)
            this.chooseSection(this.noPagesSection);

        let fileName = event.detail.page.fileName;
        this.fileInput.remove(fileName);
    }

    onSwitchPage(event){
        this.fileInput.moveFile(event.detail.source, event.detail.destination, event.detail.flag);
    }

    clean() {
        this.chooseSection(this.noPagesSection);
        this.fileInput.set([]);
        this.pagesSection.clean();
    }
}

class FileInput extends Component {
    files = [];

    html() {
        return `
            <input type="file">
        `
    }

    events() {
        this.element.addEventListener("change", this.onFileChange.bind(this));
    }

    add(...files){
        for(let file of files){
            switch (file.type){
                case "application/x-zip-compressed":
                    this.extractZip(file);
                    break;
                case "image/png":
                    this.files.push(file);
                    this.dispatchEvent(new CustomEvent("fileAdded", {detail: {"file": file}}));
                    break;
                case "image/jpeg":
                    this.files.push(file);
                    this.dispatchEvent(new CustomEvent("fileAdded", {detail: {"file": file}}));
                    break;
            }
        }
    }

    remove(fileName){
        for(let i = 0; i < this.files.length; i++){
            if (this.files[i].name === fileName)
                this.files.splice(i, 1);
        }
    }

    open() {
        this.element.click();
    }

    async extractZip(file){
        let files = [];
        await JSZip().loadAsync(file)
            .then(async (zip) => {
                for(let file in zip.files)
                    await zip.files[file].async("blob")
                        .then((blob) => {
                            files.push(new File([blob], file.substring(0, file.lastIndexOf(".")), {type: "image/jpeg"}));
                        })
                files = this.sortFiles(...files);
                this.add(...files);
            })
    }

    sortFiles(...files){
        files.sort(function (fileA, fileB){
            if (fileA === fileB)
                return 0;

            return fileA.name < fileB.name ? -1 : 1;
        })
        return files;
    }

    onFileChange(event){
        let files = this.element.files;
        this.add(...files);
        this.element.value = "";
    }

    prepare(){
        let dt = new DataTransfer()

        for(let i = 0; i < this.files.length; i++){
            let newFile = new File([this.files[i]], `${i+1}.jpeg`, {type: "image/jpeg"});
            dt.items.add(newFile);
        }
        this.element.files = dt.files;
    }

    set(...files) {
        this.files = files;
    }

    moveFile(sourceInd, destinationInd, flag = 0){
        if (sourceInd < destinationInd){
            for(let i = sourceInd; i < destinationInd - flag; i++){
                let t = this.files[i];
                this.files[i] = this.files[i+1];
                this.files[i+1] = t;
            }
        }
        else{
            for(let i = sourceInd; i > destinationInd + !flag; i--){
                let t = this.files[i];
                this.files[i] = this.files[i-1];
                this.files[i-1] = t;
            }
        }
    }
}

let pagesContainer = new PagesContainer();
pagesContainer.init(document.querySelector(".pages__container"));

let submitButton = document.querySelector("input[type='submit']");
let cleanButton = document.querySelector(".clean_button");

submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    pagesContainer.fileInput.prepare();

    let tome = document.querySelector("input[name='tome']")
    let chapter = document.querySelector("input[name='chapter']")
    if (tome.value && chapter.value)
        document.querySelector("form").submit();
})

cleanButton.addEventListener("click", function (){
    pagesContainer.clean();
})
