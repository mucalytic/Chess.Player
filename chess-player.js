var item = document.getElementsByClassName("clock")[0];
item.addEventListener("DOMSubtreeModified", function () {
    var html = item.innerHTML;
    var hs = html.split(":").map(function (s) { return parseFloat(s); });
    if (hs[0] !== 1 && hs[1] % 5 === 0) {
        var utterance = new SpeechSynthesisUtterance(hs[1] + " seconds left");
        utterance.rate = 1.8;
        window.speechSynthesis.speak(utterance);
    }
    console.log(html);
});
