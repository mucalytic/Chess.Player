var Player = (function () {
    function Player(dp) {
        this.map = {
            "b": "Yellow",
            "r": "Green",
            "g": "Blue",
            "d": "Dead",
            "w": "Red"
        };
        this.name = this.map[dp.charAt(0)];
    }
    return Player;
}());
var Piece = (function () {
    function Piece(dp) {
        this.map = {
            "R": "Rook",
            "P": "Pawn",
            "K": "King",
            "Q": "Queen",
            "B": "Bishop",
            "N": "Knight"
        };
        this.player = new Player(dp);
        this.name = this.map[dp.charAt(1)];
    }
    return Piece;
}());
var Square = (function () {
    function Square(m, n) {
        this.code = this.convert(m, n);
        this.m = m;
        this.n = n;
    }
    Square.prototype.convert = function (m, n) {
        return "" + String.fromCharCode(n + 97) + (n + 1);
    };
    return Square;
}());
var Board = (function () {
    function Board(datetime) {
        for (var m = 0; m < 14; m++) {
            for (var n = 0; n < 14; n++) {
                this.squares[m][n] = new Square(m, n);
            }
        }
        this.datetime = datetime;
    }
    return Board;
}());
var Factory = (function () {
    function Factory() {
    }
    Factory.prototype.process = function (changes) {
        for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
            var change = changes_1[_i];
            if (change.mutation.type === "childList" &&
                change.mutation.addedNodes.length === 1 &&
                change.mutation.target.attributes["data-square"]) {
                if (this.board.datetime !== change.datetime) {
                    this.board = new Board(change.datetime);
                }
                var dp = change.mutation.addedNodes[0].attributes["data-piece"].value;
                for (var m = 0; m < 14; m++) {
                    for (var n = 0; n < 14; n++) {
                        if (this.board.squares[m][n].code === dp) {
                            this.board.squares[m][n].piece = new Piece(dp);
                            break;
                        }
                    }
                }
            }
        }
    };
    return Factory;
}());
