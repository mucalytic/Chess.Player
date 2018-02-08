var groups = [];
var observer = new MutationObserver(mutations => {
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
            return { mutation: m, datetime: dt };
        })
        .reduce((u, o) => {
            var n = o.mutation.addedNodes.length == 0
                  ? o.mutation.removedNodes[0]
                  : o.mutation.addedNodes[0];
            var c = {
                player: u.playerMap[n.attributes["data-piece"].value.charAt(0)],
                piece: u.pieceMap[n.attributes["data-piece"].value.charAt(1)],
                moved: o.mutation.addedNodes.length === 0 ? "from" : "to",
                square: o.mutation.target.attributes["data-square"].value
            };
            var group = groups.filter(g => g["group"] === o.datetime);
            if (group.length === 0) {
                groups.push({
                    group: o.datetime,
                    changes: [c]
                });
            } else {
                group[0].changes.push(c);
                group[0].changes = group[0].changes.sort((c1, c2) =>
                    c1.square > c2.square ? 1 : c1.square < c2.square ? -1 : 0);
            };
            return u;
        }, {
            pieceMap: {
                "R": "Rook",
                "P": "Pawn",
                "K": "King",
                "Q": "Queen",
                "B": "Bishop",
                "N": "Knight"
            },
            playerMap: {
                "b": "Yellow",
                "r": "Green",
                "g": "Blue",
                "w": "Red"
            }
        })
        .forEach(_ => {});
});
observer.observe(document.getElementById("board"), {
    characterDataOldValue: true,
    attributeOldValue: true,
    characterData: true,
    attributes: true,
    childList: true,
    subtree: true
});
