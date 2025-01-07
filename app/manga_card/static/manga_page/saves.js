const save = document.querySelector(".save-button");
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
    if (save.textContent === "Сохранено")
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
            title: DATA.title.id,
        }),
    })
        .then(response => response.json())
        .then(response => {
            if (response.status !== "ok")
                return null;

            save.textContent = "Сохранено";
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
            title: DATA.title.id,
        }),
    })
        .then(response => response.json())
        .then(response => {
            if (response.status !== "ok")
                return null;

            save.textContent = "Сохранить";
        })
}


