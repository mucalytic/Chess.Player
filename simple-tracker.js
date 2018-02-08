var changes = [];
var observer = new MutationObserver(function (mutations) {
    mutations
        .filter(m => m.type === "childList" &&
            m.target.attributes["data-square"])
        .map(m => {
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
            var n = m.addedNodes.length == 0
                ? m.removedNodes[0]
                : m.addedNodes[0];
            var c = {
                player: a.playerMap[n.attributes["data-piece"].value.charAt(0)],
                piece: a.pieceMap[n.attributes["data-piece"].value.charAt(1)],
                moved: m.addedNodes.length == 0 ? "from" : "to",
                square: m.target.attributes["data-square"].value
            };
            return c;
        })
        .forEach(c => changes.push({ change: c, datetime: dt }));
});
observer.observe(document.getElementById("board"), {
    characterDataOldValue: true,
    attributeOldValue: true,
    characterData: true,
    attributes: true,
    childList: true,
    subtree: true
});
