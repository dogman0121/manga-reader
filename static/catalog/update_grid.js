let queue = 0;
let formData = new FormData();
// mode: 1 - добавить элемент в форму
// mode: 2 - удалить элемент из формы
// mode: 3 - усталовить значение элемента формы

function editCatalog(name, value, mode){
    queue++;
    switch (mode){
        case 1:
            formData.append(name, value);
            break;
        case 2:
            let valuesWithName = formData.getAll(name);
            formData.delete(name);
            for (let attrValue of valuesWithName)
                if (attrValue != value)
                    formData.append(name, attrValue);
            break;
        case 3:
            formData.set(name, value);
            break;
    }

    setTimeout(function (){
        queue--;
        if (queue !== 0)
            return null;

        getTitles(formData, 1)
            .then((titles) => {
                catalogTitles = titles;
            });



    }, 2000);
}