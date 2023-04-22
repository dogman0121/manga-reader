let selected = document.getElementById("chapters");
function selectSection(event){
    let target = event.target;
    
    if (target.tagName == "SPAN")
        target = target.closest("div");

    selected.style.borderBottom = 'none';
    target.style.borderBottom = '2px solid #FFD600';
    selected = target;
};

let chapters = document.getElementById("chapters");
chapters.addEventListener("click", selectSection);

let comments = document.getElementById("comments");
comments.addEventListener("click", selectSection);