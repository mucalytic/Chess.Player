let down = false;
const body = document.body;
const squares = body.querySelectorAll("div[class^='square-']");
for (let s = 0; s < squares.length; s++) {
    squares[s].addEventListener("mousedown", e => {
        if (e.target instanceof HTMLImageElement) {
            let found = false;
            for (let i = 0; i < e.target.classList.length; i++) {
                console.log(e.target.classList[i]);
                console.log(e.target.classList[i].indexOf("piece-"));
                if (e.target.classList[i].indexOf("piece-") === 0) {
                    found = true;
                    break;
                }
            }
            if (found) {
                console.log("found");
                const dp = e.target.attributes["data-piece"];
                const ds = squares[s].attributes["data-square"];
                if (dp && ds) {
                    console.log("down: %s %s", ds.value, dp.value);
                }
            } else {
                console.log("not found");
            }
        }
        down = true;
    }, false);
    squares[s].addEventListener("mouseenter", e => {
        if (down === true) {
            console.log("enter: %O", e);
        }
    }, false);
    squares[s].addEventListener("mouseup", e => {
        console.log("up: %O", e);
        down = false;
    }, false);
}
