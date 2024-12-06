const textAreas = document.getElementsByTagName("textarea");

for (let textarea of textAreas){
    registerResize(textarea);
}

function registerResize(textarea) {
    textarea.addEventListener("input", function(event){
          if (event.target.value[event.target.value.length - 1] === "\n")
            event.target.value = event.target.value.slice(0, -1);
        });


    textarea.addEventListener("input", autoResize);
    textarea.addEventListener("resize", autoResize);
}

function autoResize(event){
    event.target.style.height = ``;
    event.target.style.height = `${event.target.scrollHeight + 2}px`;
}