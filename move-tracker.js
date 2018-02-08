var squares = Array.prototype.slice.call(document.getElementsByTagName("div"))
    .filter(function (e) { return e.className.indexOf("square-") !== -1 && e.className.indexOf("blank-") === -1; });
var playerMap = {
    "b": "Yellow",
    "r": "Green",
    "g": "Blue",
    "w": "Red"
};
var pieceMap = {
    "N": "Knight",
    "B": "Bishop",
    "Q": "Queen",
    "K": "King",
    "P": "Pawn",
    "R": "Rook",
};
var Change = (function () {
    function Change(mutation) {
        this.square = mutation.target.parentNode.attributes["data-square"].value;
        if (mutation.oldValue == null) {
            var piece = mutation.target.attributes["data-piece"].value;
            this.player = playerMap[piece.charAt(0)];
            this.piece = pieceMap[piece.charAt(1)];
            this.change = "added";
        }
        else {
            this.change = "removed";
        }
    }
    return Change;
}());
var observer = new MutationObserver(function (mutations) {
    mutations
        .filter(function (m) { return m.attributeName === "data-piece"; })
        .map(function (m) { return new Change(m); })
        .forEach(function (c) { return console.log(c); });
});
observer.observe(document.getElementById("board"), {
    attributeOldValue: true,
    attributes: true,
    subtree: true
});
