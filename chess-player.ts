let item = Array.from(document.getElementsByClassName("clock"))[0];
item.addEventListener("DOMSubtreeModified", function () {
    var hs = item.innerHTML.split(":").map(s => parseInt(s));
    if (hs[0] !== 1 && hs[1] % 5 === 0) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(hs[1] + " seconds left"));
    }
});
