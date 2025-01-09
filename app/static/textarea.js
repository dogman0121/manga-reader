const textAreas = document.getElementsByTagName("textarea");

for (let textarea of textAreas){
    registerResize(textarea);
}

// function createWrapper() {
//     const wrapper = document.createElement("div");
//     wrapper.style.position = "relative";
//
//     return wrapper;
// }
//
// function createMirrorBlock(){
//     const mirror = document.createElement("div");
//     mirror.classList.add("mirror-block");
//
//     mirror.style.visibility = "hidden";
//     mirror.style.zIndex = "-1";
//     mirror.style.whiteSpace = "pre-warp";
//     mirror.style.position = "absolute";
//
//     return mirror
// }

function registerResize(textarea) {
    if (!textarea)
        return null;

    textarea.style.overflow = "hidden";
    textarea.style.height = "auto";
    textarea.style.resize = "none";
    textarea.style.minHeight = "20px";

    textarea.addEventListener("input", function(event){
          if (event.target.value[event.target.value.length - 1] === "\n")
            event.target.value = event.target.value.slice(0, -1);
        });

    textarea.addEventListener("input", autoResize);
    textarea.addEventListener("resize", autoResize);
}

function autoResize(event){
    // document.querySelector(".mirror-block").textContent = this.value;
    this.style.height = `auto`;
    this.style.height = `${event.target.scrollHeight}px`;
}