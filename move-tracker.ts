var squares = Array.prototype.slice.call(document.getElementsByTagName("div"))
    .filter(e => e.className.indexOf("square-") !== -1 && e.className.indexOf("blank-") === -1);

var playerMap = {
    "b": "Yellow",
    "r": "Green",
    "g": "Blue",
    "w": "Red"
};

var pieceMap = {
    "N": "Knight",
    "B": "Bishop",
    "Q" :"Queen",
    "K": "King",
    "P": "Pawn",
    "R": "Rook",
};

class Change {
    piece: string;
    player: string;
    change: string;
    square: string;

    constructor(mutation: MutationRecord) {
        this.square = mutation.target.parentNode.attributes["data-square"].value;
        if (mutation.oldValue == null) {
            const piece = mutation.target.attributes["data-piece"].value;
            this.player = playerMap[piece.charAt(0)];
            this.piece = pieceMap[piece.charAt(1)];
            this.change = "added";
        } else {
            this.change = "removed";
        }
    }
}

var observer = new MutationObserver(mutations => {
    mutations
        .filter(m => m.attributeName === "data-piece")
        .map(m => new Change(m))
        .forEach(c => console.log(c));
});

observer.observe(document.getElementById("board"), {
    attributeOldValue: true,
    attributes: true,
    subtree: true
});
