changes
    .filter(o => o.mutation.type === "childList" &&
                 o.mutation.target.attributes["data-square"])
    .reduce((a, o) => {
        var n = o.mutation.addedNodes.length == 0
            ? o.mutation.removedNodes[0]
            : o.mutation.addedNodes[0];
        var c = {
            player: a.playerMap[n.attributes["data-piece"].value.charAt(0)],
            piece: a.pieceMap[n.attributes["data-piece"].value.charAt(1)],
            moved: o.mutation.addedNodes.length === 0 ? "from" : "to",
            square: o.mutation.target.attributes["data-square"].value
        };
        var group = a.groups.filter(x => x["group"] === o.datetime);
        if (group.length === 0) {
            a.groups.push({
                group: o.datetime,
                changes: [c]
            });
        } else {
            group[0].changes.push(c);
            group[0].changes = group[0].changes.sort(c => c.square);
        };
        return a;
    }, {
        groups: [],
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
    .groups;
