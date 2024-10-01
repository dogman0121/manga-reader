let dragNDropZone = document.querySelector(".upload-zone");
let inputFile = document.querySelector("input[type='file']");
let submitButton = document.querySelector("input[type='submit']")
let form = document.querySelector("form");

if (dragNDropZone)
    addDragNDropEvents(dragNDropZone);

if (document.querySelector(".pages__pages")){
    let container = document.querySelector(".pages__pages");
    let addPage = container.querySelector(".pages__add");
    addDragNDropEvents(addPage);
    for (let i of container.querySelectorAll(".pages__page")){
        i.querySelector(".page__delete").addEventListener("click", function (event){
            event.target.closest(".pages__page").remove();
        });
    }
}


submitButton.addEventListener("click", async function (event){
    let dataTransfer = new DataTransfer();
    let images = document.querySelectorAll(".page__image");
    for (let i = 0; i < images.length; i++){
        await fetch(images[i].src)
            .then(response => response.blob())
            .then(blob => {
                let file = new File([blob], `${i+1}.jpeg`, {type:"image/jpeg"});
                dataTransfer.items.add(file);
            });
    }
    event.preventDefault();
    inputFile.files = dataTransfer.files;
    form.submit();
})


inputFile.addEventListener('change', function (event){
    extractFiles(event.target.files[0]);
    event.target.value = "";
})

function addDragNDropEvents(element){
    element.addEventListener("click", function (){
        inputFile.click();
    })

    element.addEventListener("dragover", function (event){
        event.preventDefault();
    });

    element.addEventListener("drop", function (event){
        event.preventDefault();

        let file = event.dataTransfer.files[0];
        extractFiles(file);
    });
}


function extractFiles(file){
    let container;
    if (document.querySelector(".pages__pages"))
        container = document.querySelector(".pages__pages");
    else
        container = createImagePreviewContainer();
    if (file.type === "application/x-zip-compressed"){
        let zip = JSZip();
        zip.loadAsync(file).
            then((zip) => {
                for(let i in zip.files){
                    zip.files[i].async("blob").
                        then((blob) => {
                            blankAddImage(container, createImage(blob));
                    })
                }
        })
    }
    else if (file.type === "image/png" || file.type === "image/jpeg"){
        blankAddImage(container, createImage(file));
    }

    if (!document.querySelector(".pages__pages"))
        showContainer(container);
}

function createImagePreviewContainer(){
    let blank = document.createElement("div");
    blank.classList.add("pages__pages");
    let addPage = document.createElement("div");
    addDragNDropEvents(addPage);
    addPage.classList.add("pages__add");
    blank.append(addPage);
    return blank;
}

function blankAddImage(blank, image){
    let page = new DOMParser().parseFromString(`
        <div class="pages__page">
            <img src="/static/chapters/add_chapters/images/close.svg" class="page__delete">
        </div>
    `, "text/html").querySelector(".pages__page");

    page.querySelector(".page__delete").addEventListener("click", function (){
        page.closest(".pages__page").remove();

        if (blank.childElementCount === 1){
            let uploadZone = new DOMParser().parseFromString(`
                <div class="upload-zone">
                    <p class="pages__text">Выберите .ZIP архивы или обычные изображения</p>
                </div>
            `, "text/html").querySelector(".upload-zone");
            addDragNDropEvents(uploadZone);
            blank.replaceWith(uploadZone);
        }
    })

    page.append(image);
    let addPage = blank.querySelector(".pages__add");
    addPage.before(page);
}

function createImage(blob){
    let item = document.createElement("img");
    item.src = URL.createObjectURL(blob);
    item.classList.add("page__image");
    return item;
}

function showContainer(container){
    let dropZone = document.querySelector(".upload-zone");
    dropZone.replaceWith(container);
}