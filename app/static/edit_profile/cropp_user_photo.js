function previewPhoto(image_url) {
    let previewBlock = new DOMParser().parseFromString(`
        <div class="preview">
            <div class="preview__block">
                <img class="preview__photo" src="${image_url}">
            </div>
            <div class="preview__buttons">
                <button class="preview__cancel">Отмена</button>
                <button class="preview__submit">Сохранить</button>
            </div>
        </div>
    `, "text/html").querySelector(".preview");

    let cancelButton = previewBlock.querySelector(".preview__cancel");
    let submitButton = previewBlock.querySelector(".preview__submit");

    let cropper = new Cropper(previewBlock.querySelector(".preview__photo"), {
        viewMode: 1,
        dragMode: "move",
        cropBoxMovable: false,
        cropBoxResizable: false,
    });
    cropper.setAspectRatio(1);
    let modal = new Modal(previewBlock);

    cancelButton.addEventListener('click', function (){
        modal.close();
    })

    submitButton.addEventListener('click', function (){
        let croppedImage = cropper.getCroppedCanvas({
            width: 500,
            height: 500,
        })
        croppedImage.toBlob((blob) => {
            let userPhoto = document.querySelector(".avatar");
            userPhoto.src = URL.createObjectURL(blob);

            let fileInput = document.querySelector("input[type='file']");
            let dataTransfer = new DataTransfer();
            let file = new File([blob], 'image.png', {type:"image/png"});
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        })

        modal.close();
    })

    modal.open();
}