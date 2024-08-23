let queue = 0;
let formData = new FormData();
// mode: 1 - добавить элемент в форму
// mode: 2 - усталовить значение элемента формы
// mode: 3 - удалить элемент из формы

function editCatalog(name, value, mode){
    queue++;
    switch (mode){
        case 1:
            formData.append(name, value);
            break;
        case 2:
            formData.set(name, value);
            break;
        case 3:
            let valuesWithName = formData.getAll(name);
            formData.delete(name);
            for (let attrValue of valuesWithName)
                if (attrValue !== value)
                    formData.append(name, attrValue);
            break;
        case 4:
            formData.delete(name);
    }
    let newSearch = "?" + (new URLSearchParams(formData)).toString();
    window.history.pushState(null, null, newSearch);
    setTimeout(function (){
        queue--;
        if (queue !== 0)
            return null;

        getTitles(formData, 1)
            .then((titles) => {
                let grid = document.querySelector(".catalog__grid");
                grid.innerHTML = "";
                catalogTitles = titles;
                for(let title of catalogTitles)
                    grid.innerHTML += createGridBlock(title, gridMode);
            });

    }, 2000);
}
