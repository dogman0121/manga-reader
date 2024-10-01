let textareas = document.getElementsByTagName("textarea");

for (let textarea of textareas){
    textarea.style.height = ``;
    textarea.style.height = `${textarea.scrollHeight + 2}px`;

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