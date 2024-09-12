let save = document.querySelector(".saved");
save.addEventListener("click", saveEvent);

function saveEvent(){
    let save = document.querySelector(".saved");
    if (save.querySelector(".stats-option__caption")){
        let savesMessage = save.querySelector(".stats-option__caption");
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
            .then(status => {
                let saves = save.querySelector(".stats-option__text");
                let savesCount = parseInt(saves.textContent);
                saves.textContent = String(savesCount - 1);

                savesMessage.remove();
            })
        return null;
    }

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
            .then(status => {
                let savedMesageHtml = `
                    <div class="stats-option__caption">
                        (сохранено)
                    </div>
                `
                let savedMessageRendered = new DOMParser().parseFromString(savedMesageHtml, "text/html");
                let savesMessageElement = savedMessageRendered.querySelector(".stats-option__caption");

                let saves = save.querySelector(".stats-option__text");
                let savesCount = parseInt(saves.textContent);
                saves.textContent = String(savesCount + 1);

                save.append(savesMessageElement);
            })
}