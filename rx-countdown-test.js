var CountdownHelper = (function () {
    function CountdownHelper() {
        this.counter = 60;
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
                    console.log("Reset happened");
                    this.utterances = [60];
                    this.counter = 60;
                }
            }
        }
    };
    CountdownHelper.prototype.utter = function (mr) {
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
    };
    return CountdownHelper;
}());
var DomManipulator = (function () {
    function DomManipulator() {
        this.src = "https://rawgit.com/Reactive-Extensions/RxJS/master/dist/rx.all.min.js";
        this.addScriptTags(this.src);
    }
    DomManipulator.prototype.addScriptTags = function (src) {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src === src) {
                return;
            }
        }
        var script = document.createElement("script");
        document.body.appendChild(script);
        script.src = src;
    };
    return DomManipulator;
}());
var DomWatcher = (function () {
    function DomWatcher() {
        this.records = [];
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
        this.subject = new Rx.Subject();
        this.observer = new MutationObserver(function (mrs) {
            mrs.forEach(function (mr) { return _this.subject.onNext(mr); });
        });
        this.subscription = this.subject
            .subscribe(function (mr) {
            _this.records.push(mr);
            _this.countdown.reset(mr);
            _this.countdown.utter(mr);
        }, function (ex) {
            console.log("Rx: Exception: %o", ex);
            _this.observer.disconnect();
        }, function () {
            console.log("Rx: Completed");
            _this.observer.disconnect();
        });
    };
    return DomWatcher;
}());
var manipulator = new DomManipulator();
