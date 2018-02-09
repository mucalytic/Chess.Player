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
    Player.prototype.equals = function (player) {
        if (player === undefined) {
            return false;
        }
        else {
            return this.name === player.name;
        }
    };
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
        this.name = this.map[dp.charAt(1)];
        this.player = new Player(dp);
        this.dp = dp;
    }
    Piece.prototype.equals = function (piece) {
        if (piece === undefined) {
            return false;
        }
        else {
            return this.name === piece.name &&
                this.player.equals(piece.player);
        }
    };
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
        this.removed = new Board();
        this.added = new Board();
        this.datetime = datetime;
    }
    return Turn;
}());
var Change = (function () {
    function Change(from, to) {
        this.from = from;
        this.to = to;
    }
    return Change;
}());
var Factory = (function () {
    function Factory() {
        this.turns = [];
        this.changes = [];
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
                change.mutation.target.attributes["data-square"]) {
                var turn = this.turn(change.datetime);
                if (turn == null) {
                    turn = new Turn(change.datetime);
                    this.turns.push(turn);
                }
                var code = change.mutation.target.attributes["data-square"].value;
                if (change.mutation.addedNodes.length === 1) {
                    var dpa = change.mutation.addedNodes[0].attributes["data-piece"].value;
                    for (var m = 0; m < 14; m++) {
                        for (var n = 0; n < 14; n++) {
                            if (turn.added.squares[m][n].code === code) {
                                turn.added.squares[m][n].piece = new Piece(dpa);
                            }
                        }
                    }
                }
                if (change.mutation.removedNodes.length === 1) {
                    var dpr = change.mutation.removedNodes[0].attributes["data-piece"].value;
                    for (var m = 0; m < 14; m++) {
                        for (var n = 0; n < 14; n++) {
                            if (turn.removed.squares[m][n].code === code) {
                                turn.removed.squares[m][n].piece = new Piece(dpr);
                            }
                        }
                    }
                }
            }
        }
        return this;
    };
    Factory.prototype.analyse = function () {
        if (this.turns.length > 2) {
            for (var i = 1; i < this.turns.length; i++) {
                for (var m = 0; m < 14; m++) {
                    for (var n = 0; n < 14; n++) {
                        var from = this.turns[i].added.squares[m][n];
                        var to = this.turns[i - 1].added.squares[m][n];
                        if (from.piece !== undefined) {
                            if (!from.piece.equals(to.piece)) {
                                this.changes.push(new Change(from, to));
                            }
                        }
                    }
                }
            }
        }
        return this;
    };
    Factory.prototype.show = function (turns) {
        for (var i = 1; i < Math.min(this.turns.length, turns); i++) {
            console.log("When: " + this.turns[i].datetime);
            for (var m = 0; m < 14; m++) {
                var line = "[ ";
                for (var n = 0; n < 14; n++) {
                    var square = this.turns[i].added.squares[m][n];
                    if (square.piece === undefined) {
                        line += "[]";
                    }
                    else {
                        line += square.piece.dp;
                    }
                    line += " ";
                }
                line += "] | [ ";
                for (var n = 0; n < 14; n++) {
                    var square = this.turns[i].removed.squares[m][n];
                    if (square.piece === undefined) {
                        line += "[]";
                    }
                    else {
                        line += square.piece.dp;
                    }
                    line += " ";
                }
                line += "]";
                console.log(line);
            }
            console.log("");
        }
        return this;
    };
    return Factory;
}());
