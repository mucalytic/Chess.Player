changes
    .filter(m => m.type === "childList" &&
                 m.target.attributes["data-square"])
    .reduce((a, m) => {
        var n = m.addedNodes.length == 0
            ? m.removedNodes[0]
            : m.addedNodes[0];
        var o = {
            player: a.playerMap[n.attributes["data-piece"].value.charAt(0)],
            piece: a.pieceMap[n.attributes["data-piece"].value.charAt(1)],
            moved: m.addedNodes.length == 0 ? "from" : "to",
            square: m.target.attributes["data-square"].value
        };
        a.changes.push(o);
        return a;
    }, {
        changes: [],
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
    });
