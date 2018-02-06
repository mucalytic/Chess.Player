"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chess_player_1 = require("./chess-player");
var DomModifier = (function () {
    function DomModifier() {
        this.countdownHelper = new chess_player_1.CountdownHelper();
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
    };
    return DomModifier;
}());
exports.DomModifier = DomModifier;
