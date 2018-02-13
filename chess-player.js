var CountdownHelper = (function () {
    function CountdownHelper() {
        var _this = this;
        this.options = {
            characterData: true,
            attributes: true,
            childList: true,
            subtree: true
        };
        this.record = [];
        this.username = document.getElementById("four-player-username").innerText;
        this.gameover = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                _this.record.push(mutation);
            });
        });
    }
    CountdownHelper.prototype.start = function () {
        this.reset();
        this.gameover.observe(document.body, this.options);
        console.log("observers started");
    };
    CountdownHelper.prototype.stop = function () {
        this.gameover.disconnect();
        console.log("observers stopped");
    };
    CountdownHelper.prototype.reset = function () {
        this.counter = 60;
        this.utterances = [60];
        console.log("counters reset");
    };
    return CountdownHelper;
}());
var DomModifier = (function () {
    function DomModifier() {
        this.src = "https://rawgit.com/Reactive-Extensions/RxJS/master/dist/rx.all.min.js";
        this.countdownHelper = new CountdownHelper();
    }
    DomModifier.prototype.addRx = function () {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src === this.src) {
                return this;
            }
        }
        var script = document.createElement("script");
        document.body.appendChild(script);
        script.src = this.src;
        return this;
    };
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
                                btnOn_1.style.display = "block";
                                btnOff_1.style.display = "none";
                                _this.countdownHelper.stop();
                            });
                        }
                    }
                    anchorOn.addEventListener("click", function () {
                        btnOff_1.style.display = "block";
                        btnOn_1.style.display = "none";
                        _this.countdownHelper.start();
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
var modifier = new DomModifier()
    .rightAlignStartButton()
    .addStartAiButton()
    .addRx();
