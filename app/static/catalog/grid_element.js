function createGridBlock(title, type){
    let blockElement;
    let hostUrl = window.location.protocol;
    if (type === 1){
        blockElement = `
            <a class="catalog__link" href="/manga/${title.id}">
                <div class="catalog__item title title-square">
                    <img class="title-square__poster" src="/static/media/posters/${title.id}.jpg">
                    <span class="title-square__data">
                        <span class="title-square__type">${title.type.name}</span>
                        <span class="title-square__year">${title.year}</span>
                    </span>
                    <p class="title-square__name">${title.name_russian}</p>
                </div>
            </a>
        `;
    } else {
        blockElement = `
            <a class="catalog__link" href="/manga/${title.id}">
                <div class="catalog__item title title-rectangle">
                    <img class="title-rectangle__poster" src="/static/media/posters/${title.id}.jpg">
                    <div class="title-rectangle__data">
                        <span class="title-rectangle__status">${title.status.name}</span>
                        <span class="title-rectangle__name">${title.name_russian}</span>
                        <div class="title-rectangle__short-data">
                            <span class="title-rectangle__type">${title.type.name}</span>
                            <span class="title-rectangle__year">${title.year}</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }
    return blockElement;
}