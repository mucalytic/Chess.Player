var down = false;
var body = document.body;
var squares = body.querySelectorAll("div[class^='square-']");
var _loop_1 = function (s) {
    squares[s].addEventListener("mousedown", function (e) {
        if (e.target instanceof HTMLImageElement) {
            var found = false;
            for (var i = 0; i < e.target.classList.length; i++) {
                console.log(e.target.classList[i]);
                console.log(e.target.classList[i].indexOf("piece-"));
                if (e.target.classList[i].indexOf("piece-") === 0) {
                    found = true;
                    break;
                }
            }
            if (found) {
                console.log("found");
                var dp = e.target.attributes["data-piece"];
                var ds = squares[s].attributes["data-square"];
                if (dp && ds) {
                    console.log("down: %s %s", ds.value, dp.value);
                }
            }
            else {
                console.log("not found");
            }
        }
        down = true;
    }, false);
    squares[s].addEventListener("mouseenter", function (e) {
        if (down === true) {
            console.log("enter: %O", e);
        }
    }, false);
    squares[s].addEventListener("mouseup", function (e) {
        console.log("up: %O", e);
        down = false;
    }, false);
};
for (var s = 0; s < squares.length; s++) {
    _loop_1(s);
}
