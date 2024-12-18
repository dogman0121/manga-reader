let pageHeight;

function saveProgress() {
    const scrollHeight = window.pageYOffset || document.documentElement.scrollTop;
    const progress = scrollHeight / pageHeight;
    fetch("/api/progress", {
        method: "UPDATE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: DATA.title.id,
            chapter: DATA.chapter.id,
            progress: progress
        })
    })
}

window.onload = function () {
     pageHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight);

    fetch(`/api/progress?title=${DATA.title.id}&chapter=${DATA.chapter.id}`)
        .then(response => response.json())
        .then(function (progress){
            const p = progress.progress;
            if (p)
                window.scrollTo(0, pageHeight * p);
        });

    setInterval(saveProgress, 10000);
}