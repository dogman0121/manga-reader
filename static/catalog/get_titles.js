function getTitles(formData, page=1) {
    formData.append("page", page);
    let searchParams = new URLSearchParams(formData);
    let queryParams = searchParams.toString();
    let query = "/get_catalog?" + queryParams;
    return fetch(query, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
}