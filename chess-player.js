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
    function Player() {
    }
    Player.create = function (dp) {
        switch (dp.charAt(0)) {
            case "w":
                return new Red();
            case "g":
                return new Blue();
            case "b":
                return new Yellow();
            case "r":
                return new Green();
            case "d":
                return new Dead();
            default:
                return undefined;
        }
    };
    return Player;
}());
var Red = (function (_super) {
    __extends(Red, _super);
    function Red() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Red";
        _this.turn = 1;
        return _this;
    }
    Red.prototype.transform = function (x, y, x1, y1) {
        return [x + x1, y + y1];
    };
    return Red;
}(Player));
var Blue = (function (_super) {
    __extends(Blue, _super);
    function Blue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Blue";
        _this.turn = 2;
        return _this;
    }
    Blue.prototype.transform = function (x, y, x1, y1) {
        return [x + y1, y - x1];
    };
    return Blue;
}(Player));
var Yellow = (function (_super) {
    __extends(Yellow, _super);
    function Yellow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Yellow";
        _this.turn = 3;
        return _this;
    }
    Yellow.prototype.transform = function (x, y, x1, y1) {
        return [x - x1, y - y1];
    };
    return Yellow;
}(Player));
var Green = (function (_super) {
    __extends(Green, _super);
    function Green() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Green";
        _this.turn = 4;
        return _this;
    }
    Green.prototype.transform = function (x, y, x1, y1) {
        return [x - y1, y + x1];
    };
    return Green;
}(Player));
var Dead = (function (_super) {
    __extends(Dead, _super);
    function Dead() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Dead";
        _this.turn = 0;
        return _this;
    }
    Dead.prototype.transform = function (x, y) {
        throw new Error("Not implemented");
    };
    return Dead;
}(Player));
var Vector = (function () {
    function Vector(x1, y1) {
        this.x1 = x1;
        this.y1 = y1;
    }
    return Vector;
}());
var Radius = (function () {
    function Radius(max) {
        this.counter = 0;
        this.max = max;
    }
    Radius.prototype.next = function () {
        if (!this.max || this.counter < this.max) {
            this.counter++;
            return {
                value: this.counter,
                done: false
            };
        }
        else {
            this.counter = 0;
            return {
                value: undefined,
                done: true
            };
        }
    };
    Radius.prototype.reset = function () {
        this.counter = 0;
    };
    return Radius;
}());
var Piece = (function () {
    function Piece(dp, code) {
        this.coords = Square.coords(code);
        this.player = Player.create(dp);
        this.dp = dp;
    }
    Piece.prototype.moved = function () {
        var moved = true;
        for (var i = 0; i < this.home.length; i++) {
            var m1 = this.home[i][0] - 6.5;
            var n1 = this.home[i][1] - 6.5;
            var _a = this.player.transform(6.5, 6.5, n1, m1), x2 = _a[0], y2 = _a[1];
            if (this.coords[1] === x2 &&
                this.coords[0] === y2) {
                moved = false;
                break;
            }
        }
        return moved;
    };
    Piece.create = function (dp, code) {
        switch (dp.charAt(1)) {
            case "R":
                return new Rook(dp, code);
            case "P":
                return new Pawn(dp, code);
            case "K":
                return new King(dp, code);
            case "Q":
                return new Queen(dp, code);
            case "B":
                return new Bishop(dp, code);
            case "N":
                return new Knight(dp, code);
            default:
                return undefined;
        }
    };
    return Piece;
}());
var Rook = (function (_super) {
    __extends(Rook, _super);
    function Rook() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Rook";
        _this.radius = new Radius();
        _this.home = [[0, 3], [0, 10]];
        return _this;
    }
    Rook.prototype.attack = function () {
        return [];
    };
    Rook.prototype.mobility = function () {
        return [[new Vector(function (r) { return r; }, function (_) { return 0; }), true],
            [new Vector(function (r) { return -r; }, function (_) { return 0; }), true],
            [new Vector(function (_) { return 0; }, function (r) { return r; }), true],
            [new Vector(function (_) { return 0; }, function (r) { return -r; }), true]];
    };
    return Rook;
}(Piece));
var Pawn = (function (_super) {
    __extends(Pawn, _super);
    function Pawn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Pawn";
        _this.radius = new Radius(1);
        _this.home = [[1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10]];
        return _this;
    }
    Pawn.prototype.attack = function () {
        return [[new Vector(function (_) { return 1; }, function (_) { return 1; }), true],
            [new Vector(function (_) { return -1; }, function (_) { return 1; }), true]];
    };
    Pawn.prototype.mobility = function () {
        return this.moved()
            ? [[new Vector(function (_) { return 0; }, function (_) { return 1; }), true]]
            : [[new Vector(function (_) { return 0; }, function (_) { return 1; }), true],
                [new Vector(function (_) { return 0; }, function (_) { return 2; }), true]];
    };
    return Pawn;
}(Piece));
var King = (function (_super) {
    __extends(King, _super);
    function King() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "King";
        _this.radius = new Radius(1);
        _this.home = _this.player instanceof Red ||
            _this.player instanceof Yellow
            ? [[0, 7]]
            : [[0, 6]];
        return _this;
    }
    King.prototype.attack = function () {
        return [];
    };
    King.prototype.mobility = function () {
        return [[new Vector(function (_) { return 1; }, function (_) { return 0; }), true],
            [new Vector(function (_) { return -1; }, function (_) { return 0; }), true],
            [new Vector(function (_) { return 0; }, function (_) { return 1; }), true],
            [new Vector(function (_) { return 0; }, function (_) { return -1; }), true],
            [new Vector(function (_) { return 1; }, function (_) { return 1; }), true],
            [new Vector(function (_) { return 1; }, function (_) { return -1; }), true],
            [new Vector(function (_) { return -1; }, function (_) { return 1; }), true],
            [new Vector(function (_) { return -1; }, function (_) { return -1; }), true]];
    };
    return King;
}(Piece));
var Queen = (function (_super) {
    __extends(Queen, _super);
    function Queen() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Queen";
        _this.radius = new Radius();
        _this.home = _this.player instanceof Red ||
            _this.player instanceof Yellow
            ? [[0, 6]]
            : [[0, 7]];
        return _this;
    }
    Queen.prototype.attack = function () {
        return [];
    };
    Queen.prototype.mobility = function () {
        return [[new Vector(function (r) { return r; }, function (_) { return 0; }), true],
            [new Vector(function (r) { return -r; }, function (_) { return 0; }), true],
            [new Vector(function (_) { return 0; }, function (r) { return r; }), true],
            [new Vector(function (_) { return 0; }, function (r) { return -r; }), true],
            [new Vector(function (r) { return r; }, function (r) { return r; }), true],
            [new Vector(function (r) { return r; }, function (r) { return -r; }), true],
            [new Vector(function (r) { return -r; }, function (r) { return r; }), true],
            [new Vector(function (r) { return -r; }, function (r) { return -r; }), true]];
    };
    return Queen;
}(Piece));
var Bishop = (function (_super) {
    __extends(Bishop, _super);
    function Bishop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Bishop";
        _this.radius = new Radius();
        _this.home = [[0, 5], [0, 8]];
        return _this;
    }
    Bishop.prototype.attack = function () {
        return [];
    };
    Bishop.prototype.mobility = function () {
        return [[new Vector(function (r) { return r; }, function (r) { return r; }), true],
            [new Vector(function (r) { return r; }, function (r) { return -r; }), true],
            [new Vector(function (r) { return -r; }, function (r) { return r; }), true],
            [new Vector(function (r) { return -r; }, function (r) { return -r; }), true]];
    };
    return Bishop;
}(Piece));
var Knight = (function (_super) {
    __extends(Knight, _super);
    function Knight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Knight";
        _this.radius = new Radius(1);
        _this.home = [[0, 4], [0, 9]];
        return _this;
    }
    Knight.prototype.attack = function () {
        return [];
    };
    Knight.prototype.mobility = function () {
        return [[new Vector(function (_) { return 2; }, function (_) { return 1; }), true],
            [new Vector(function (_) { return 2; }, function (_) { return -1; }), true],
            [new Vector(function (_) { return -2; }, function (_) { return 1; }), true],
            [new Vector(function (_) { return -2; }, function (_) { return -1; }), true],
            [new Vector(function (_) { return 1; }, function (_) { return 2; }), true],
            [new Vector(function (_) { return 1; }, function (_) { return -2; }), true],
            [new Vector(function (_) { return -1; }, function (_) { return 2; }), true],
            [new Vector(function (_) { return -1; }, function (_) { return -2; }), true]];
    };
    return Knight;
}(Piece));
var Square = (function () {
    function Square(m, n) {
        this.friends = [];
        this.enemies = [];
        this.m = m;
        this.n = n;
        return this;
    }
    Square.prototype.friendly = function () {
        return this.friends.length >= this.enemies.length;
    };
    Square.prototype.char = function (n) {
        return String.fromCharCode(n + 97);
    };
    Square.prototype.code = function () {
        return "" + this.char(this.n) + (this.m + 1);
    };
    Square.prototype.accessible = function () {
        return (this.m >= 3 && this.m <= 10 && this.n >= 0 && this.n <= 2) ||
            (this.m >= 0 && this.m <= 13 && this.n >= 3 && this.n <= 10) ||
            (this.m >= 3 && this.m <= 10 && this.n >= 11 && this.n <= 13);
    };
    Square.coords = function (code) {
        var m = parseInt(code.slice(1)) - 1;
        var n = code.charCodeAt(0) - 97;
        return [m, n];
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
    Board.prototype.square = function (code) {
        var c = Square.coords(code);
        return this.squares[c[0]][c[1]];
    };
    Board.prototype.valid = function (x, y) {
        return (x >= 0 && x <= 13 && y >= 0 && y <= 13);
    };
    return Board;
}());
var CountdownHelper = (function () {
    function CountdownHelper() {
        this.counter = 60;
        this.enabled = false;
        this.utterances = [60];
    }
    CountdownHelper.prototype.username = function () {
        return document.getElementById("four-player-username").innerText;
    };
    CountdownHelper.prototype.avatar = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node instanceof HTMLElement &&
                node.classList.contains("player-avatar")) {
                return node;
            }
        }
        return undefined;
    };
    CountdownHelper.prototype.current = function (mr) {
        return parseFloat(mr.oldValue.trim().split(":")[1]);
    };
    CountdownHelper.prototype.reset = function (mr) {
        if (mr.type === "childList" &&
            mr.target instanceof HTMLDivElement &&
            mr.target.classList.length === 0 &&
            mr.addedNodes.length === 1) {
            var modal = mr.addedNodes[0];
            if (modal instanceof HTMLElement &&
                modal.classList.contains("modal-container")) {
                var go = modal.querySelector(".game-over-container");
                if (go) {
                    this.utterances = [60];
                    this.counter = 60;
                }
            }
        }
    };
    CountdownHelper.prototype.words = function () {
        return this.counter <= 5
            ? this.counter.toString()
            : this.counter + " seconds left";
    };
    CountdownHelper.prototype.utterance = function () {
        return this.rate(new SpeechSynthesisUtterance(this.words()));
    };
    CountdownHelper.prototype.rate = function (utterance) {
        utterance.rate = 1.8;
        return utterance;
    };
    CountdownHelper.prototype.utter = function (mr) {
        if (this.enabled) {
            if (mr.type === "characterData") {
                var timer = mr.target.parentNode.parentNode;
                if (timer) {
                    if (timer instanceof HTMLElement &&
                        timer.classList.contains("player-clock-timer")) {
                        var avatar = this.avatar(timer.childNodes);
                        if (avatar) {
                            if (avatar instanceof HTMLAnchorElement) {
                                if (avatar.pathname === "/member/" + this.username()) {
                                    var c = this.current(mr);
                                    if (this.counter - c > 0 &&
                                        this.counter - c <= 1) {
                                        this.counter = c;
                                    }
                                    if (((this.counter <= 5 &&
                                        this.counter % 1 === 0) ||
                                        (this.counter > 5 &&
                                            this.counter % 5 === 0)) &&
                                        this.counter !== this.utterances[0]) {
                                        window.speechSynthesis.speak(this.utterance());
                                        this.utterances.unshift(this.counter);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    return CountdownHelper;
}());
var AnalysisHelper = (function () {
    function AnalysisHelper() {
        this.colours = ["red", "blue", "yellow", "green"];
        this.turn = 0;
    }
    AnalysisHelper.prototype.process = function (mr) {
        if (mr.type === "childList" &&
            mr.target instanceof HTMLElement &&
            mr.target.className.indexOf("board-") === 0) {
            this.board = new Board();
            this.name = this.me();
            this.create(mr);
            this.analyse();
            this.threats(mr);
        }
    };
    AnalysisHelper.prototype.create = function (mr) {
        var row = mr.addedNodes;
        if (row.length >= 14) {
            for (var m = 0; m < 14; m++) {
                for (var n = 0; n < 14; n++) {
                    var col = row[m].childNodes[n];
                    if (col instanceof HTMLElement) {
                        var node = this.piece(col.childNodes);
                        if (node) {
                            var ds = col.attributes["data-square"];
                            var dp = node.attributes["data-piece"];
                            if (ds && dp) {
                                var piece = Piece.create(dp.value, ds.value);
                                this.board.square(ds.value).piece = piece;
                            }
                        }
                    }
                }
            }
        }
    };
    AnalysisHelper.prototype.analyse = function () {
        for (var m = 0; m < 14; m++) {
            for (var n = 0; n < 14; n++) {
                var square = this.board.squares[m][n];
                var accessible = square.accessible();
                if (accessible) {
                    var piece = square.piece;
                    if (piece) {
                        if (!(piece.player instanceof Dead)) {
                            this.radius(piece, piece.mobility(), true, m, n);
                            this.radius(piece, piece.attack(), false, m, n);
                        }
                    }
                }
            }
        }
    };
    AnalysisHelper.prototype.threats = function (mr) {
        var row = mr.addedNodes;
        if (row.length >= 14) {
            for (var m = 0; m < 14; m++) {
                for (var n = 0; n < 14; n++) {
                    var node = row[m].childNodes[n];
                    var ds = node.attributes["data-square"];
                    if (ds && node instanceof HTMLElement) {
                        var square = this.board.square(ds.value);
                        var colour = this.colour(node, square.friendly());
                        node.style.backgroundColor = colour;
                        console.log("colour: %s", colour);
                    }
                }
            }
        }
    };
    AnalysisHelper.prototype.show = function () {
        for (var m = 0; m < 14; m++) {
            var row = ["|"];
            for (var n = 0; n < 14; n++) {
                var square = this.board.squares[m][n];
                if (square.accessible()) {
                    row.push(square.piece ? square.piece.dp : "[]");
                }
                else {
                    row.push("  ");
                }
            }
            row.push("|");
            var s = this.board.squares;
            console.log(row.join(" ") +
                "%O %O %O %O %O %O %O %O %O %O %O %O %O %O |", s[m][0], s[m][1], s[m][2], s[m][3], s[m][4], s[m][5], s[m][6], s[m][7], s[m][8], s[m][9], s[m][10], s[m][11], s[m][12], s[m][13]);
        }
    };
    AnalysisHelper.prototype.me = function () {
        var username = document.getElementById("four-player-username").innerText;
        var elements = document.body.getElementsByClassName("player-avatar");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element instanceof HTMLAnchorElement) {
                if (element.href.indexOf(username) !== -1) {
                    var parent_1 = element.parentElement;
                    for (var j = 0; j < parent_1.classList.length; j++) {
                        for (var k = 0; k < this.colours.length; k++) {
                            if (this.colours[k] === parent_1.classList[j]) {
                                return this.colours[k];
                            }
                        }
                    }
                }
            }
        }
        return undefined;
    };
    AnalysisHelper.prototype.colour = function (node, friendly) {
        var rgb;
        var bgc = window
            .getComputedStyle(node, null)
            .getPropertyValue("background-color");
        console.log(bgc);
        if (bgc.indexOf("#") === 0) {
            rgb = this.hexToRgb(bgc);
        }
        if (bgc.indexOf("rgb") === 0) {
            var vals = bgc
                .substring(4, bgc.length - 1)
                .split(", ");
            rgb = {
                r: parseInt(vals[0]),
                g: parseInt(vals[1]),
                b: parseInt(vals[2])
            };
        }
        ;
        if (friendly) {
            return "rgb(" + rgb.r + ", 255, " + rgb.b + ")";
        }
        else {
            return "rgb(255, " + rgb.g + ", " + rgb.b + ")";
        }
    };
    AnalysisHelper.prototype.hexToRgb = function (hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    AnalysisHelper.prototype.remaining = function (moves) {
        var remaining = 0;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i][1]) {
                remaining++;
            }
        }
        return remaining;
    };
    AnalysisHelper.prototype.radius = function (piece, vectors, noAttacks, m, n) {
        for (;;) {
            var radius = piece.radius.next();
            var remaining = this.remaining(vectors);
            if (radius.done || radius.value > 14 || remaining === 0) {
                piece.radius.reset();
                break;
            }
            for (var j = 0; j < vectors.length; j++) {
                this.vector(piece, vectors[j], noAttacks, m, n, radius.value);
            }
        }
    };
    AnalysisHelper.prototype.vector = function (piece, vector, noAttacks, m, n, radius) {
        if (vector[1]) {
            var x1 = vector[0].x1(radius);
            var y1 = vector[0].y1(radius);
            var _a = piece.player.transform(n, m, x1, y1), x2 = _a[0], y2 = _a[1];
            if (this.board.valid(x2, y2) &&
                this.board.squares[y2][x2].accessible()) {
                if (this.board.squares[y2][x2].piece) {
                    if (noAttacks) {
                        this.candidate(this.board.squares[y2][x2], piece);
                    }
                    vector[1] = false;
                }
                else {
                    this.candidate(this.board.squares[y2][x2], piece);
                }
            }
            else {
                vector[1] = false;
            }
        }
    };
    AnalysisHelper.prototype.candidate = function (square, piece) {
        if (this.name === piece.player.name.toLowerCase()) {
            square.friends.push(piece);
        }
        else {
            square.enemies.push(piece);
        }
    };
    AnalysisHelper.prototype.piece = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node instanceof HTMLElement &&
                node.className.indexOf("piece-") === 0) {
                return node;
            }
        }
        return undefined;
    };
    return AnalysisHelper;
}());
var DomWatcher = (function () {
    function DomWatcher() {
        this.analysis = new AnalysisHelper();
        this.countdown = new CountdownHelper();
        this.init = {
            characterDataOldValue: true,
            attributeOldValue: true,
            characterData: true,
            attributes: true,
            childList: true,
            subtree: true
        };
        this.createDocumentBodyObserverSubscription();
        this.observer.observe(document.body, this.init);
    }
    DomWatcher.prototype.createDocumentBodyObserverSubscription = function () {
        var _this = this;
        this.observer = new MutationObserver(function (mrs) {
            mrs.forEach(function (mr) {
                _this.countdown.reset(mr);
                _this.countdown.utter(mr);
                _this.analysis.process(mr);
            });
        });
    };
    return DomWatcher;
}());
var DomModifier = (function () {
    function DomModifier() {
        this.domWatcher = new DomWatcher();
        this.rightAlignStartButton();
        this.addStartAiButton();
    }
    DomModifier.prototype.addStartAiButton = function () {
        var _this = this;
        var btnNewGame = document.getElementsByClassName("btns-container")[0];
        if (btnNewGame instanceof HTMLElement) {
            btnNewGame.style.cssFloat = "right";
            var btnOn_1 = btnNewGame.cloneNode(true);
            if (btnOn_1 instanceof HTMLElement) {
                btnOn_1.style.cssFloat = "left";
                btnOn_1.style.marginRight = "12px";
                var anchorOn = btnOn_1.firstChild;
                if (anchorOn.nodeName === "A") {
                    if (anchorOn instanceof HTMLElement) {
                        anchorOn.innerText = "Start AI";
                        anchorOn.classList.remove("new-game-btn");
                    }
                }
                var btnOff_1 = btnOn_1.cloneNode(true);
                if (btnOff_1 instanceof HTMLElement) {
                    btnOff_1.style.display = "none";
                    var anchorOff = btnOff_1.firstChild;
                    if (anchorOff.nodeName === "A") {
                        if (anchorOff instanceof HTMLElement) {
                            anchorOff.innerText = "Stop AI";
                            anchorOff.style.color = "#b4b4b3";
                            anchorOff.style.borderBottom = "#272422";
                            anchorOff.style.backgroundColor = "#272422";
                            anchorOff.addEventListener("click", function () {
                                _this.domWatcher.countdown.enabled = false;
                                btnOff_1.style.display = "none";
                                btnOn_1.style.display = "block";
                            });
                        }
                    }
                    anchorOn.addEventListener("click", function () {
                        _this.domWatcher.countdown.enabled = true;
                        btnOff_1.style.display = "block";
                        btnOn_1.style.display = "none";
                    });
                }
                btnNewGame.parentNode.appendChild(btnOn_1);
                btnNewGame.parentNode.appendChild(btnOff_1);
            }
        }
        return this;
    };
    DomModifier.prototype.rightAlignStartButton = function () {
        var head = document.getElementsByTagName("head")[0];
        if (head instanceof HTMLElement) {
            var text = document.createTextNode(".btns-container { float: right; }");
            var style = document.createElement("style");
            if (style instanceof HTMLElement) {
                style.type = "text/css";
                style.appendChild(text);
            }
            head.appendChild(style);
        }
        return this;
    };
    return DomModifier;
}());
var modifier = new DomModifier();
