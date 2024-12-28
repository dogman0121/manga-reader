let inputFile = document.querySelector("input[name='avatar']");
let previewImage = document.querySelector(".user-photo")
inputFile.addEventListener("change", function (event){
    let file = event.target.files[0];

    let img = new Image();
    img.onload = function() {
    }
    img.src = URL.createObjectURL(file);

    // previewImage.src = URL.createObjectURL(file);
    previewPhoto(URL.createObjectURL(file));
})