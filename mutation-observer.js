var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        console.log(mutation.target.textContent.trim().split(":").map(function (s) { return parseFloat(s); }));
    });
})
.observe(document.getElementsByClassName("clock")[0], {
    characterData: true,
    attributes: true,
    childList: true,
    subtree: true
});
