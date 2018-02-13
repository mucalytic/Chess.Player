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
    function Square() {
    }
    Square.prototype.initFromCode = function (code) {
        this.n = parseInt(code.slice(1));
        this.m = code.charCodeAt(0);
        this.code = code;
        return this;
    };
    Square.prototype.initFromCoords = function (m, n) {
        this.code = "" + String.fromCharCode(n + 97) + (m + 1);
        this.m = m;
        this.n = n;
        return this;
    };
    return Square;
}());
var DiffSquare = (function (_super) {
    __extends(DiffSquare, _super);
    function DiffSquare() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DiffSquare;
}(Square));
var Board = (function () {
    function Board() {
        this.squares = [];
    }
    Board.prototype.add = function (sq) {
        this.squares[sq.m][sq.n] = sq;
    };
    return Board;
}());
var Diff = (function () {
    function Diff() {
        this.deaths = [];
        this.captures = [];
        this.removals = [];
        this.additions = [];
        this.squares = [];
    }
    Diff.prototype.add = function (sq) {
        this.squares[sq.m][sq.n] = sq;
    };
    return Diff;
}());
var Turn = (function () {
    function Turn(index) {
        this.index = index;
        this.diff = new Diff();
        this.added = new Board();
        this.removed = new Board();
    }
    return Turn;
}());
var Factory = (function () {
    function Factory() {
        this.turns = [];
    }
    Factory.prototype.piece = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node instanceof HTMLElement &&
                node.className.indexOf("piece-") === 0) {
                return node;
            }
        }
        return undefined;
    };
    Factory.prototype.process = function (changes) {
        var _this = this;
        Rx.Observable.fromArray(changes)
            .filter(function (mr) { return mr.type === "childList" &&
            mr.target instanceof HTMLElement &&
            mr.target.className.indexOf("board-") === 0; })
            .scan(function (mrc, mr) {
            var res = [mr, ++mrc[1]];
            return res;
        }, [undefined, 0])
            .forEach(function (mrc) {
            var mr;
            var index;
            mr = mrc[0], index = mrc[1];
            var turn = new Turn(index);
            _this.turns.push(turn);
            var aro = mr.addedNodes;
            var rro = mr.removedNodes;
            if (aro.length !== 0 && rro.length !== 0) {
                console.log("A");
                for (var m = 0; m < 14; m++) {
                    console.log("B");
                    for (var n = 0; n < 14; n++) {
                        console.log("C");
                        var aco = aro[m].childNodes[n];
                        var rco = rro[m].childNodes[n];
                        if (aco instanceof HTMLElement &&
                            rco instanceof HTMLElement) {
                            console.log("D");
                            var apn = _this.piece(aco.childNodes);
                            var rpn = _this.piece(rco.childNodes);
                            var asq = new Square().initFromCode(aco.dataset["square"]);
                            var rsq = new Square().initFromCode(rco.dataset["square"]);
                            var dsq = new DiffSquare().initFromCode(aco.dataset["square"]);
                            console.log("E");
                            if (apn) {
                                console.log("F");
                                asq.piece = Piece.create(apn.attributes["data-piece"].value);
                                console.log("G");
                            }
                            console.log("H");
                            if (rpn) {
                                console.log("I");
                                rsq.piece = Piece.create(rpn.attributes["data-piece"].value);
                                console.log("J");
                            }
                            console.log("K");
                            if (!rsq.piece && asq.piece) {
                                turn.diff.additions.push(asq);
                                dsq.piece = asq.piece;
                                dsq.change = "+";
                            }
                            console.log("L");
                            if (rsq.piece && !asq.piece) {
                                turn.diff.removals.push(rsq);
                                dsq.piece = rsq.piece;
                                dsq.change = "-";
                            }
                            console.log("M");
                            if (rsq.piece && asq.piece) {
                                if (rsq.piece.dp !== asq.piece.dp) {
                                    dsq.piece = asq.piece;
                                    if (asq.piece.player.name === "Dead") {
                                        turn.diff.deaths.push(asq);
                                        dsq.change = "x";
                                    }
                                    else {
                                        turn.diff.captures.push(asq);
                                        dsq.change = "*";
                                    }
                                }
                            }
                            console.log("N: %O", rsq);
                            turn.removed.add(rsq);
                            console.log("O");
                            turn.added.add(asq);
                            console.log("P");
                            turn.diff.add(dsq);
                            console.log("Q");
                        }
                    }
                }
            }
        });
        return this;
    };
    Factory.prototype.header = function (turn) {
        return "Index: " +
            turn.index +
            "; Additions: " +
            turn.diff.additions.length +
            "; Removals: " +
            turn.diff.removals.length +
            "; Captures: " +
            turn.diff.captures.length +
            "; Deaths: " +
            turn.diff.deaths.length;
    };
    Factory.prototype.show = function (turns) {
        for (var i = 1; i < Math.min(this.turns.length, turns); i++) {
            var turn = this.turns[i];
            console.group(this.header(turn));
            for (var m = 0; m < 14; m++) {
                var row = ["|"];
                for (var n = 0; n < 14; n++) {
                    var square = turn.added.squares[m][n];
                    row.push(square.piece ? square.piece.dp : "[]");
                }
                row.push("|");
                for (var n = 0; n < 14; n++) {
                    var square = turn.removed.squares[m][n];
                    row.push(square.piece ? square.piece.dp : "[]");
                }
                row.push("|");
                for (var n = 0; n < 14; n++) {
                    var square = turn.diff.squares[m][n];
                    row.push(square.piece ? square.piece.dp + square.change : "[ ]");
                }
                row.push("|");
                console.log(row.join(" "));
            }
            console.groupEnd();
        }
        return this;
    };
    return Factory;
}());
