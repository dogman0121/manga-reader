function getTitles(formData, page=1) {
    let searchParams = new URLSearchParams(formData);
    searchParams.append("page", page);
    let queryParams = searchParams.toString();
    let query = "/catalog/get?" + queryParams;
    return fetch(query, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
}