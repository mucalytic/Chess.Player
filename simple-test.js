var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Player = (function () {
    function Player(dp) {
        switch (dp.charAt(0)) {
            case "w":
                this.name = "Red";
                break;
            case "g":
                this.name = "Blue";
                break;
            case "d":
                this.name = "Dead";
                break;
            case "r":
                this.name = "Green";
                break;
            case "b":
                this.name = "Yellow";
                break;
            default:
                this.name = undefined;
        }
    }
    return Player;
}());
var Vector = (function () {
    function Vector(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
    return Vector;
}());
var Radius = (function () {
    function Radius(max) {
        this.counter = 0;
        this.max = max;
    }
    Radius.prototype.next = function () {
        if (!this.max || (this.max && this.max >= ++this.counter)) {
            return {
                value: this.counter,
                done: false
            };
        }
        else {
            return {
                value: null,
                done: true
            };
        }
    };
    return Radius;
}());
var Piece = (function () {
    function Piece(dp) {
        this.player = new Player(dp);
        this.dp = dp;
    }
    Piece.create = function (dp) {
        switch (dp.charAt(1)) {
            case "R":
                return new Rook(dp);
            case "P":
                return new Pawn(dp);
            case "K":
                return new King(dp);
            case "Q":
                return new Queen(dp);
            case "B":
                return new Bishop(dp);
            case "N":
                return new Knight(dp);
            default:
                return null;
        }
    };
    return Piece;
}());
var Rook = (function (_super) {
    __extends(Rook, _super);
    function Rook(dp) {
        var _this = _super.call(this, dp) || this;
        _this.name = "Rook";
        _this.jump = false;
        _this.radius = new Radius();
        _this.mobility = [new Vector(function (x, r) { return x + r; }, function (y) { return y; }),
            new Vector(function (x, r) { return x - r; }, function (y) { return y; }),
            new Vector(function (x) { return x; }, function (y, r) { return y + r; }),
            new Vector(function (x) { return x; }, function (y, r) { return y - r; })];
        return _this;
    }
    return Rook;
}(Piece));
var Pawn = (function (_super) {
    __extends(Pawn, _super);
    function Pawn(dp) {
        var _this = _super.call(this, dp) || this;
        _this.name = "Pawn";
        _this.jump = false;
        _this.radius = new Radius(2);
        _this.mobility = [new Vector(function (x) { return x; }, function (y, r) { return y + r; })];
        return _this;
    }
    return Pawn;
}(Piece));
var King = (function (_super) {
    __extends(King, _super);
    function King(dp) {
        var _this = _super.call(this, dp) || this;
        _this.name = "King";
        _this.jump = false;
        _this.radius = new Radius(1);
        _this.mobility = [new Vector(function (x) { return x + 1; }, function (y) { return y; }),
            new Vector(function (x) { return x - 1; }, function (y) { return y; }),
            new Vector(function (x) { return x; }, function (y) { return y + 1; }),
            new Vector(function (x) { return x; }, function (y) { return y - 1; }),
            new Vector(function (x) { return x + 1; }, function (y) { return y + 1; }),
            new Vector(function (x) { return x + 1; }, function (y) { return y - 1; }),
            new Vector(function (x) { return x - 1; }, function (y) { return y + 1; }),
            new Vector(function (x) { return x - 1; }, function (y) { return y - 1; })];
        return _this;
    }
    return King;
}(Piece));
var Queen = (function (_super) {
    __extends(Queen, _super);
    function Queen(dp) {
        var _this = _super.call(this, dp) || this;
        _this.name = "Queen";
        _this.jump = false;
        _this.radius = new Radius();
        _this.mobility = [new Vector(function (x, r) { return x + r; }, function (y) { return y; }),
            new Vector(function (x, r) { return x - r; }, function (y) { return y; }),
            new Vector(function (x) { return x; }, function (y, r) { return y + r; }),
            new Vector(function (x) { return x; }, function (y, r) { return y - r; }),
            new Vector(function (x, r) { return x + r; }, function (y, r) { return y + r; }),
            new Vector(function (x, r) { return x + r; }, function (y, r) { return y - r; }),
            new Vector(function (x, r) { return x - r; }, function (y, r) { return y + r; }),
            new Vector(function (x, r) { return x - r; }, function (y, r) { return y - r; })];
        return _this;
    }
    return Queen;
}(Piece));
var Bishop = (function (_super) {
    __extends(Bishop, _super);
    function Bishop(dp) {
        var _this = _super.call(this, dp) || this;
        _this.name = "Bishop";
        _this.jump = false;
        _this.radius = new Radius();
        _this.mobility = [new Vector(function (x, r) { return x + r; }, function (y, r) { return y + r; }),
            new Vector(function (x, r) { return x + r; }, function (y, r) { return y - r; }),
            new Vector(function (x, r) { return x - r; }, function (y, r) { return y + r; }),
            new Vector(function (x, r) { return x - r; }, function (y, r) { return y - r; })];
        return _this;
    }
    return Bishop;
}(Piece));
var Knight = (function (_super) {
    __extends(Knight, _super);
    function Knight(dp) {
        var _this = _super.call(this, dp) || this;
        _this.name = "Knight";
        _this.jump = true;
        _this.radius = new Radius(1);
        _this.mobility = [new Vector(function (x) { return x + 2; }, function (y) { return y + 1; }),
            new Vector(function (x) { return x + 2; }, function (y) { return y - 1; }),
            new Vector(function (x) { return x - 2; }, function (y) { return y + 1; }),
            new Vector(function (x) { return x - 2; }, function (y) { return y - 1; }),
            new Vector(function (x) { return x + 1; }, function (y) { return y + 2; }),
            new Vector(function (x) { return x + 1; }, function (y) { return y - 2; }),
            new Vector(function (x) { return x - 1; }, function (y) { return y + 2; }),
            new Vector(function (x) { return x - 1; }, function (y) { return y - 2; })];
        return _this;
    }
    return Knight;
}(Piece));
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
var Variance = (function (_super) {
    __extends(Variance, _super);
    function Variance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.additions = [];
        _this.captures = [];
        _this.removals = [];
        _this.deaths = [];
        return _this;
    }
    Variance.prototype.addition = function (square) {
        for (var _i = 0, _a = this.additions; _i < _a.length; _i++) {
            var addition = _a[_i];
            if (addition.piece.dp === square.piece.dp) {
                return addition;
            }
        }
        return null;
    };
    Variance.prototype.removal = function (square) {
        for (var _i = 0, _a = this.removals; _i < _a.length; _i++) {
            var removal = _a[_i];
            if (removal.piece.dp === square.piece.dp) {
                return removal;
            }
        }
        return null;
    };
    return Variance;
}(Turn));
var Factory = (function () {
    function Factory() {
        this.turns = [];
        this.variances = [];
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
    Factory.prototype.variance = function (datetime) {
        for (var _i = 0, _a = this.variances; _i < _a.length; _i++) {
            var variance = _a[_i];
            if (variance.datetime === datetime) {
                return variance;
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
                if (!turn) {
                    turn = new Turn(change.datetime);
                    this.turns.push(turn);
                }
                var code = change.mutation.target.attributes["data-square"].value;
                if (change.mutation.addedNodes.length === 1) {
                    var dp = change.mutation.addedNodes[0].attributes["data-piece"].value;
                    for (var m = 0; m < 14; m++) {
                        for (var n = 0; n < 14; n++) {
                            if (turn.board.squares[m][n].code === code) {
                                turn.board.squares[m][n].piece = Piece.create(dp);
                            }
                        }
                    }
                }
            }
        }
        return this;
    };
    Factory.prototype.analyse = function () {
        if (this.turns.length > 1) {
            for (var i = 1; i < this.turns.length; i++) {
                var variance = new Variance(this.turns[i].datetime);
                for (var m = 0; m < 14; m++) {
                    for (var n = 0; n < 14; n++) {
                        var to = this.turns[i].board.squares[m][n];
                        var from = this.turns[i - 1].board.squares[m][n];
                        if (!from.piece && to.piece) {
                            variance.additions.push(to);
                            variance.board.squares[m][n].change = "+";
                            variance.board.squares[m][n].piece = to.piece;
                        }
                        if (from.piece && !to.piece) {
                            variance.removals.push(from);
                            variance.board.squares[m][n].change = "-";
                            variance.board.squares[m][n].piece = from.piece;
                        }
                        if (from.piece && to.piece) {
                            if (from.piece.dp !== to.piece.dp) {
                                variance.board.squares[m][n].piece = to.piece;
                                if (to.piece.player.name === "Dead") {
                                    variance.deaths.push(to);
                                    variance.board.squares[m][n].change = "x";
                                }
                                else {
                                    variance.captures.push(to);
                                    variance.board.squares[m][n].change = "*";
                                }
                            }
                        }
                    }
                }
                for (var _i = 0, _a = variance.removals; _i < _a.length; _i++) {
                    var removal = _a[_i];
                    var addition = variance.addition(removal);
                    if (!addition) {
                        variance.board.squares[removal.m][removal.n].piece = undefined;
                    }
                }
                for (var _b = 0, _c = variance.additions; _b < _c.length; _b++) {
                    var addition = _c[_b];
                    var removal = variance.removal(addition);
                    if (!removal) {
                        for (var m = 0; m < 14; m++) {
                            for (var n = 0; n < 14; n++) {
                                var piece = this.turns[i - 1].board.squares[m][n].piece;
                                if (piece && piece.dp === addition.piece.dp) {
                                    while (piece.radius.next()) {
                                        var tries = [];
                                        for (var _d = 0, _e = piece.mobility; _d < _e.length; _d++) {
                                            var vector = _e[_d];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                this.variances.push(variance);
            }
        }
        return this;
    };
    Factory.prototype.apply = function () {
        return this;
    };
    Factory.prototype.header = function (turn, variance) {
        return "When: " +
            turn.datetime +
            "                         " +
            "Additions: " +
            variance.additions.length +
            "     " +
            "Removals: " +
            variance.removals.length +
            "     " +
            "Captures: " +
            variance.captures.length +
            "     " +
            "Deaths: " +
            variance.deaths.length;
    };
    Factory.prototype.show = function (turns) {
        for (var i = 1; i < Math.min(this.turns.length, turns); i++) {
            var turn = this.turns[i];
            var variance = this.variance(turn.datetime);
            console.log(this.header(turn, variance));
            for (var m = 0; m < 14; m++) {
                var line = "[ ";
                for (var n = 0; n < 14; n++) {
                    var square = turn.board.squares[m][n];
                    if (!square.piece) {
                        line += "[]";
                    }
                    else {
                        line += square.piece.dp;
                    }
                    line += " ";
                }
                line += "]  |  [ ";
                for (var n = 0; n < 14; n++) {
                    var square = variance.board.squares[m][n];
                    if (!square.piece) {
                        line += "[ ]";
                    }
                    else {
                        line += square.piece.dp;
                        line += square.change;
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
