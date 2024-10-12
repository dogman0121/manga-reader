const searchEl = document.querySelector(".search");
const searchInput = searchEl.querySelector(".search__input");
const searchResults = searchEl.querySelector(".search__results");
const searchResultsEmpty = searchEl.querySelector(".results__empty");
const searchFilters = searchEl.querySelector(".search__filters");
const searchCloseButton = searchEl.querySelector(".search__close_image");
let chosenSection = 'title';

searchEl.addEventListener("click", function (event){
    if (!event.target.closest(".search__container"))
        close();
})

searchCloseButton.addEventListener("click", close);

searchInput.addEventListener("input", (event) => {
    debounceSearch(event.target.value, chosenSection);
})

searchFilters.addEventListener("click", function (event){
    if (!event.target.classList.contains("search__filter"))
        return;
    if (event.target.classList.contains("search__filter_selected"))
        return;

    if (event.target.classList.contains("title")){
        chosenSection = 'title';
        searchFilters.querySelector(".team").classList.remove("search__filter_selected");
        searchFilters.querySelector(".title").classList.add("search__filter_selected");
    }
    else {
        chosenSection = 'team';
        searchFilters.querySelector(".title").classList.remove("search__filter_selected");
        searchFilters.querySelector(".team").classList.add("search__filter_selected");
    }
})

function open() {
    searchEl.classList.remove("hidden");
}

function close() {
    searchEl.classList.add("hidden");
}

function search(query, section=null) {
    fetch(`/search?q=${query}&p=${section}`)
        .then(response => response.json())
        .then(items => {
            searchResults.innerHTML = '';
            if (items.length === 0){
                searchResults.append(searchResultsEmpty)
                return;
            }
            searchResultsEmpty.remove()
            for (let item of items) {
                searchResults.innerHTML += renderSearchResult(item);
            }
        });
}

function renderSearchResult(item){
    let template;
    if (chosenSection === 'title'){
        template = `
            <a href="/manga/${item.id}" class="results__item item">
                <img class="item__poster" src="${item.poster}">
                <div class="item__info">
                    <span class="item__name">${item.name_russian}</span>
                    <span class="item__sub-name">${item.type.name} ${item.year}</span>
                </div>
            </a>
        `;
    }
    else if (chosenSection === 'team'){
        template = `
            <a href="/team/${item.id}" class="results__item item">
                <img class="item__poster" src="${item.poster}">
                <div class="item__info">
                    <span class="item__name">${item.name}</span>
                </div>
            </a>
        `;
    }
    return template;
}

function debounce(func, timeout){
    return function call(...args){
        let previousCall = this.lastCall;

        this.lastCall = Date.now();

        if (previousCall && (this.lastCall - previousCall) < timeout)
            clearTimeout(this.callTimeout);

        this.callTimeout = setTimeout(() => func(...args), timeout);
    }
}

let debounceSearch = debounce(search, 500);