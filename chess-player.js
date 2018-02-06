var CountdownHelper = (function () {
    function CountdownHelper() {
        var elem = document.getElementsByClassName("clock")[0];
        if (elem instanceof HTMLElement) {
            this.clock = elem;
        }
    }
    CountdownHelper.prototype.start = function () {
        var _this = this;
        this.clock.addEventListener("DOMSubtreeModified", function () { return _this.utter(); });
    };
    CountdownHelper.prototype.stop = function () {
        var _this = this;
        this.clock.removeEventListener("DOMSubtreeModified", function () { return _this.utter(); });
    };
    CountdownHelper.prototype.utter = function () {
        var html = this.clock.innerHTML;
        var hs = html.split(":").map(function (s) { return parseFloat(s); });
        if (hs[0] !== 1 && hs[1] % 5 === 0) {
            var utterance = new SpeechSynthesisUtterance(hs[1] + " seconds left");
            utterance.rate = 1.8;
            window.speechSynthesis.speak(utterance);
        }
        console.log(JSON.parse(JSON.stringify(hs)));
    };
    return CountdownHelper;
}());
var DomModifier = (function () {
    function DomModifier() {
        this.countdownHelper = new CountdownHelper();
    }
    DomModifier.prototype.addStartAiButton = function () {
        var _this = this;
        var btnNg = document.getElementsByClassName("btns-container")[0];
        if (btnNg instanceof HTMLElement) {
            btnNg.style.cssFloat = "right";
            var btnAi = btnNg.cloneNode(true);
            if (btnAi instanceof HTMLElement) {
                btnAi.style.cssFloat = "left";
                btnAi.style.marginRight = "12px";
                var anchor = btnAi.firstChild;
                if (anchor.nodeName === "A") {
                    if (anchor instanceof HTMLElement) {
                        anchor.innerText = "Start AI";
                        anchor.classList.remove("new-game-btn");
                        anchor.addEventListener("click", function () { return _this.countdownHelper.start(); });
                    }
                }
                btnNg.parentNode.appendChild(btnAi);
            }
        }
        return this;
    };
    DomModifier.prototype.rightAlignStartButton = function () {
        var head = document.getElementsByTagName("head")[0];
        if (head instanceof HTMLElement) {
            var style = document.createElement("style");
            if (style instanceof HTMLElement) {
                style.type = "text/css";
                style.appendChild(document.createTextNode(".btns-container { float: right; }"));
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
