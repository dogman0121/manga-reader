function calculateProgress(){
    const scrollHeight = window.scrollY || document.documentElement.scrollTop;
    const chapter = document.querySelector(`[data-id="${DATA.chapter.id}"]`);
    const chapterHeight = chapter.scrollHeight;

    const topCords = chapter.getBoundingClientRect().top + scrollHeight;

    if (scrollHeight - topCords < 0)
        return 0;
    else
        return (scrollHeight - topCords) / chapterHeight;
}

async function saveProgress() {
    const CHAPTER = parseInt(window.location.href.match(/\d+$/)[0]);
    const progress = await calculateProgress();

    if (DATA.user) {
        const response = await fetch("/api/progress", {
            method: "UPDATE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chapter: DATA.chapter.id,
                progress: progress
            })
        })

        if (!response.ok){
            const progressDict = JSON.parse(localStorage.getItem("progress")) || {};

            const newProgress = DATA.chapter;
            newProgress.progress = progress;
            delete newProgress.pages;

            progressDict[DATA.chapter.title_id] = newProgress;

            localStorage.setItem("progress", JSON.stringify(progressDict));
        }
    }
    else {
        const progressDict = JSON.parse(localStorage.getItem("progress")) || {};

        const newProgress = DATA.chapter;
        newProgress.progress = progress;
        delete newProgress.pages;

        progressDict[DATA.chapter.title_id] = newProgress;

        localStorage.setItem("progress", JSON.stringify(progressDict));
    }
}

function throttle(callee, timeout) {
    let timer = null

    return function perform(...args) {
        if (timer) return

        timer = setTimeout(() => {
            callee(...args)

            clearTimeout(timer)
            timer = null
        }, timeout)
    }
}

window.addEventListener("scroll", throttle(saveProgress, 1000));

window.addEventListener("load",async function(){
     const pageHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight);

     let progress;
     if (DATA.user) {
         try {
             const response = await fetch(`/api/progress?chapter=${CHAPTER}`);

             if (response.ok) {
                 const chapter = await response.json();
                 progress = await chapter.progress;
             }
             else {
                 const progressDict = JSON.parse(localStorage.getItem("progress")) || {};

                 const progressChapter = progressDict[DATA.chapter.title_id];

                 if (progressChapter && progressChapter.id === DATA.chapter.id) {
                     progress = progressChapter.progress;
                 }
                 else {
                     progress = 0;
                 }
             }
         }
         catch (e) {

         }
     }
     else {
         const progressDict = JSON.parse(localStorage.getItem("progress")) || {};

         const progressChapter = progressDict[DATA.chapter.title_id];

         if (progressChapter && progressChapter.id === DATA.chapter.id) {
             progress = progressChapter.progress;
         }
         else {
             progress = 0;
         }
     }

     window.scrollTo(0, pageHeight * progress);
})