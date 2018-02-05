var item = document.getElementsByClassName("clock")[0];
item.addEventListener("DOMSubtreeModified", () => {
    var hs = item.innerHTML.split(":").map(s => parseFloat(s));
    if (hs[0] !== 1 && hs[1] % 5 === 0) {
        let utterance = new SpeechSynthesisUtterance(hs[1] + " seconds left");
        utterance.rate = 1.8;
        window.speechSynthesis.speak(utterance);
    }
});
