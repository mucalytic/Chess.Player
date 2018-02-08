var changes = [];
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
        var d = new Date();
        var dt = d.getFullYear()
            + "-"
            + String("0" + d.getMonth()).slice(-2)
            + "-"
            + String("0" + d.getDate()).slice(-2)
            + " "
            + String("0" + d.getHours()).slice(-2)
            + ":"
            + String("0" + d.getMinutes()).slice(-2)
            + ":"
            + String("0" + d.getSeconds()).slice(-2);
        var ob = { mutation: m, datetime: dt };
        changes.push(ob);
    });
});
observer.observe(document.getElementById("board"), {
    characterDataOldValue: true,
    attributeOldValue: true,
    characterData: true,
    attributes: true,
    childList: true,
    subtree: true
});
