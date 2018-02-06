var item = document.getElementsByClassName("clock")[0];
item.addEventListener("DOMSubtreeModified", () => {
    var html = item.innerHTML;
    var hs = html.split(":").map(s => parseFloat(s));
    if (hs[0] !== 1 && hs[1] % 5 === 0) {
        const utterance = new SpeechSynthesisUtterance(hs[1] + " seconds left");
        utterance.rate = 1.8;
        window.speechSynthesis.speak(utterance);
    }
    console.log(html);
});
