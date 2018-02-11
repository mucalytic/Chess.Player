var CountdownHelper = (function () {
    function CountdownHelper() {
        this.observer = new MutationObserver(function (mutations) {
            var counter = 59;
            mutations.forEach(function (mutation) {
                var c = parseFloat(mutation.target.textContent.trim().split(":")[1]);
                console.log("c:" + c +
                    ";counter:" + counter +
                    ";counter - c:" + (counter - c) +
                    ";counter - c > 0:" + (counter - c > 0) +
                    ";counter - c <= 1:" + (counter - c <= 1) +
                    ";counter - c > 0 && counter - c <= 1:" + (counter - c > 0 && counter - c <= 1));
                if (counter - c > 0 && counter - c <= 1) {
                    counter = c;
                    console.log("counter:" + counter);
                }
                if (counter % 5 === 0) {
                    var words = counter + " seconds left";
                    var utterance = new SpeechSynthesisUtterance(words);
                    utterance.rate = 1.8;
                    window.speechSynthesis.speak(utterance);
                    console.log("uttered:'" + words + "'");
                }
            });
        });
    }
    CountdownHelper.prototype.start = function () {
        this.observer.observe(document.getElementsByClassName("clock")[0], {
            characterData: true,
            attributes: true,
            childList: true,
            subtree: true
        });
    };
    CountdownHelper.prototype.stop = function () {
        this.observer.disconnect();
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
