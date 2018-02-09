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
        return "" + String.fromCharCode(n + 97) + (m + 1);
    };
    return Square;
}());
var Board = (function () {
    function Board() {
        this.squares = [];
        for (var m = 0; m < 14; m++) {
            this.squares[m] = [];
            for (var n = 0; n < 14; n++) {
                this.squares[m][n] = new Square(m, n);
            }
        }
    }
    return Board;
}());
var Turn = (function () {
    function Turn(datetime) {
        this.datetime = datetime;
        this.board = new Board();
    }
    return Turn;
}());
var Factory = (function () {
    function Factory() {
        this.turns = [];
    }
    Factory.prototype.turn = function (datetime) {
        for (var _i = 0, _a = this.turns; _i < _a.length; _i++) {
            var turn = _a[_i];
            if (turn.datetime === datetime) {
                return turn;
            }
        }
        return null;
    };
    Factory.prototype.process = function (changes) {
        for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
            var change = changes_1[_i];
            if (change.mutation.type === "childList" &&
                change.mutation.addedNodes.length === 1 &&
                change.mutation.target.attributes["data-square"]) {
                var turn = this.turn(change.datetime);
                if (turn == null) {
                    turn = new Turn(change.datetime);
                    this.turns.push(turn);
                }
                var dp = change.mutation.addedNodes[0].attributes["data-piece"].value;
                var code = change.mutation.target.attributes["data-square"].value;
                for (var m = 0; m < 14; m++) {
                    for (var n = 0; n < 14; n++) {
                        if (turn.board.squares[m][n].code === code) {
                            turn.board.squares[m][n].piece = new Piece(dp);
                            break;
                        }
                    }
                }
            }
        }
    };
    return Factory;
}());
