var btnNg = document.getElementsByClassName("btns-container")[0];
if (btnNg instanceof HTMLElement) {
    var head = document.getElementsByTagName("head")[0];
    if (head instanceof HTMLElement) {
        var css = ".btns-container { float: right; }";
        var style = document.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }
    var btnAi = btnNg.cloneNode(true);
    if (btnAi instanceof HTMLElement) {
        btnAi.style.cssFloat = "left";
        btnAi.style.marginRight = "12px";
        var anchor = btnAi.firstChild;
        if (anchor.nodeName === "A") {
            if (anchor instanceof HTMLElement) {
                anchor.innerText = "Start AI";
                anchor.classList.remove("new-game-btn");
                anchor.addEventListener("click", function() {
                    var elem = document.getElementsByClassName("clock")[0];
                    if (elem instanceof HTMLElement) {
                        elem.addEventListener("DOMSubtreeModified", function() {
                            var html = elem.innerHTML;
                            var hs = html.split(":").map(function (s) { return parseFloat(s); });
                            if (hs[0] !== 1 && hs[1] % 5 === 0) {
                                var utterance = new SpeechSynthesisUtterance(hs[1] + " seconds left");
                                utterance.rate = 1.8;
                                window.speechSynthesis.speak(utterance);
                            }
                            console.log(JSON.parse(JSON.stringify(hs)));
                        });
                    }
                });
            }
        }
        btnNg.parentNode.appendChild(btnAi);
    }
}
