var CountdownHelper = (function () {
    function CountdownHelper() {
        var _this = this;
        this.options = {
            characterData: true,
            attributes: true,
            childList: true,
            subtree: true
        };
        this.countdown = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var target = mutation.target;
                if (target instanceof HTMLDivElement) {
                    console.log(target);
                    var c = parseFloat(target.innerText.trim().split(":")[1]);
                    if (_this.counter - c > 0 && _this.counter - c <= 1) {
                        _this.counter = c;
                    }
                    if (_this.counter % 5 === 0 &&
                        _this.counter !== _this.utterances[0]) {
                        var words = _this.counter + " seconds left";
                        var utterance = new SpeechSynthesisUtterance(words);
                        utterance.rate = 1.8;
                        window.speechSynthesis.speak(utterance);
                        _this.utterances.unshift(_this.counter);
                    }
                }
            });
        });
        this.gameover = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "childList" &&
                    mutation.addedNodes.length === 1) {
                    var node = mutation.addedNodes[0];
                    if (node instanceof HTMLElement) {
                        console.log(node);
                        if (node.classList.contains("game-over-container")) {
                            _this.reset();
                        }
                    }
                }
            });
        });
    }
    CountdownHelper.prototype.clock = function () {
        var name = document.getElementById("four-player-username").innerText;
        var avatars = document.getElementsByClassName("player-avatar");
        for (var i = 0; i < avatars.length; i++) {
            var avatar = avatars[i];
            if (avatar instanceof HTMLAnchorElement) {
                if (avatar.pathname === "/member/" + name) {
                    var clock = avatar.nextElementSibling;
                    if (clock instanceof HTMLDivElement) {
                        if (clock.classList.contains("clock")) {
                            console.log(clock);
                            return clock;
                        }
                    }
                }
            }
        }
        return null;
    };
    CountdownHelper.prototype.start = function () {
        this.reset();
        this.gameover.observe(document.body, this.options);
        this.countdown.observe(this.clock(), this.options);
        console.log("countdown observer started");
    };
    CountdownHelper.prototype.stop = function () {
        this.gameover.disconnect();
        console.log("countdown observer stopped");
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
        this.countdownHelper = new CountdownHelper();
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
new DomModifier()
    .rightAlignStartButton()
    .addStartAiButton();
