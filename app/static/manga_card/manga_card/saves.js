let save = document.querySelector(".saved");
save.addEventListener("click", debounce(saveTitle, 200));


function debounce(func, timeout){
    return function call(...args){
        let previousCall = this.lastCall;

        this.lastCall = Date.now();

        if (previousCall && (this.lastCall - previousCall) < timeout)
            clearTimeout(this.callTimeout);

        this.callTimeout = setTimeout(() => func(...args), timeout);
    }
}


function saveTitle() {
    if (save.querySelector(".stats-option__caption"))
        removeSave();
    else
        addSave();
}


function addSave(){
    fetch("../api/save", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title_id: title_id,
        }),
    })
        .then(response => response.json())
        .then(json => {
            if (json.status !== "ok")
                return null;

            let savedMessageRendered = new DOMParser().parseFromString(`
                <div class="stats-option__caption">
                    (сохранено)
                </div>
            `, "text/html").querySelector(".stats-option__caption");


            let savesCount = parseInt(save.querySelector(".stats-option__text").textContent);
            save.querySelector(".stats-option__text").textContent = (savesCount + 1).toString();

            save.append(savedMessageRendered);
        })
}

function removeSave(){
    fetch("../api/save", {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title_id: title_id,
        }),
    })
        .then(response => response.json())
        .then(json => {
            if (json.status !== "ok")
                return null;

            let count = parseInt(save.querySelector(".stats-option__text").textContent);
            save.querySelector(".stats-option__text").textContent = (count - 1).toString();
            save.querySelector(".stats-option__caption").remove();
        })
}


