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
                return undefined;
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
        this.code = this.codegen(m, n);
        this.m = m;
        this.n = n;
        return this;
    }
    Square.coords = function (code) {
        var m = parseInt(code.slice(1)) - 1;
        var n = code.charCodeAt(0) - 97;
        return [m, n];
    };
    Square.prototype.char = function (n) {
        return String.fromCharCode(n + 97);
    };
    Square.prototype.codegen = function (m, n) {
        return "" + this.char(n) + (m + 1);
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
        for (var m = 0; m < 14; m++) {
            this.squares[m] = [];
            for (var n = 0; n < 14; n++) {
                this.squares[m][n] = new Square(m, n);
            }
        }
    }
    Board.prototype.square = function (code) {
        var c = Square.coords(code);
        return this.squares[c[0]][c[1]];
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
        for (var m = 0; m < 14; m++) {
            this.squares[m] = [];
            for (var n = 0; n < 14; n++) {
                this.squares[m][n] = new DiffSquare(m, n);
            }
        }
    }
    Diff.prototype.square = function (code) {
        var c = DiffSquare.coords(code);
        return this.squares[c[0]][c[1]];
    };
    return Diff;
}());
var Turn = (function () {
    function Turn(index) {
        this.diff = new Diff();
        this.added = new Board();
        this.removed = new Board();
        this.index = index;
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
    Factory.prototype.createAddedAndRemovedBoards = function (turn, mr) {
        var rro = mr.removedNodes;
        var aro = mr.addedNodes;
        if (aro.length >= 14 &&
            rro.length >= 14) {
            for (var m = 0; m < 14; m++) {
                for (var n = 0; n < 14; n++) {
                    var aco = aro[m].childNodes[n];
                    var rco = rro[m].childNodes[n];
                    if (aco instanceof HTMLElement &&
                        rco instanceof HTMLElement) {
                        var apn = this.piece(aco.childNodes);
                        var rpn = this.piece(rco.childNodes);
                        if (apn) {
                            var dp = apn.attributes["data-piece"];
                            var ds = aco.attributes["data-square"];
                            if (dp && ds) {
                                var pc = Piece.create(dp.value);
                                turn.added.square(ds.value).piece = pc;
                            }
                        }
                        if (rpn) {
                            var dp = rpn.attributes["data-piece"];
                            var ds = rco.attributes["data-square"];
                            if (dp && ds) {
                                var pc = Piece.create(dp.value);
                                turn.removed.square(ds.value).piece = pc;
                            }
                        }
                    }
                }
            }
        }
    };
    Factory.prototype.createDiffBoard = function (turn) {
        for (var m = 0; m < 14; m++) {
            for (var n = 0; n < 14; n++) {
                var rsq = turn.removed.squares[m][n];
                var asq = turn.added.squares[m][n];
                var dsq = turn.diff.squares[m][n];
                if (!rsq.piece && asq.piece) {
                    turn.diff.additions.push(asq);
                    dsq.piece = asq.piece;
                    dsq.change = "+";
                }
                if (rsq.piece && !asq.piece) {
                    turn.diff.removals.push(rsq);
                    dsq.piece = rsq.piece;
                    dsq.change = "-";
                }
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
            }
        }
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
            .subscribe(function (mrc) {
            var turn = new Turn(mrc[1]);
            _this.createAddedAndRemovedBoards(turn, mrc[0]);
            _this.createDiffBoard(turn);
            _this.turns.push(turn);
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
