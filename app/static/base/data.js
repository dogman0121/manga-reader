let DATA;
try {
    DATA = JSON.parse(document.querySelector(".DATA").textContent);
}
catch (e) {
    DATA = {};
}
