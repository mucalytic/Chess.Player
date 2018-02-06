"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.CountdownHelper = CountdownHelper;
