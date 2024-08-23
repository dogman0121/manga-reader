let save = document.querySelector(".saved");
save.addEventListener("click", saveEvent);

function saveEvent(){
    let save = document.querySelector(".saved");
    if (save.querySelector(".stats-option__caption")){
        let savesMessage = save.querySelector(".stats-option__caption");
        fetch("../api/delete_save", {
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
            .then(saves => {
                let savesCount = save.querySelector(".stats-option__text");
                savesCount.textContent = saves.saves;

                savesMessage.remove();
            })
        return null;
    }

    fetch("../api/add_save", {
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
            .then(saves => {
                let savedMesageHtml = `
                    <div class="stats-option__caption">
                        (сохранено)
                    </div>
                `
                let savedMessageRendered = new DOMParser().parseFromString(savedMesageHtml, "text/html");
                let savesMessageElement = savedMessageRendered.querySelector(".stats-option__caption");

                let savesCount = save.querySelector(".stats-option__text");
                savesCount.textContent = saves.saves;

                save.append(savesMessageElement);
            })
}