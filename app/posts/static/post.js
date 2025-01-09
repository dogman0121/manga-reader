window.onload = function () {
    const postId = new URL(window.location.href).searchParams.get("id");
    fetch("/api/posts?" + new URLSearchParams({id : postId}))
        .then(response => response.json())
        .then(post =>  {
            document.querySelector(".post").replaceWith(new Post(post, {size: "max"}).render());
        })
}