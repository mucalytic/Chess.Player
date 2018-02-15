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
                    console.log("countdown helper counter reset");
                    this.utterances = [60];
                    this.counter = 60;
                }
            }
        }
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
                                    if (this.counter % 5 === 0 &&
                                        this.counter !== this.utterances[0]) {
                                        var words = this.counter + " seconds left";
                                        var utterance = new SpeechSynthesisUtterance(words);
                                        utterance.rate = 1.8;
                                        window.speechSynthesis.speak(utterance);
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
var DomWatcher = (function () {
    function DomWatcher() {
        this.records = [];
        this.helper = new CountdownHelper();
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
                _this.helper.reset(mr);
                _this.helper.utter(mr);
                _this.records.push(mr);
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
                                _this.domWatcher.helper.enabled = false;
                                btnOff_1.style.display = "none";
                                btnOn_1.style.display = "block";
                            });
                        }
                    }
                    anchorOn.addEventListener("click", function () {
                        _this.domWatcher.helper.enabled = true;
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
