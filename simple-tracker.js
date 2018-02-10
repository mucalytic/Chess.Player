var Watcher = (function () {
    function Watcher() {
        var _this = this;
        this.changes = [];
        this.observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                var d = new Date();
                var dt = _this.date(d) + " " + _this.time(d);
                _this.changes.push({ mutation: m, datetime: dt });
            });
        });
    }
    Watcher.prototype.dd = function (num) {
        return ("0" + num).slice(-2);
    };
    Watcher.prototype.date = function (dt) {
        return dt.getFullYear() + "-" + this.dd(dt.getMonth()) + "-" + this.dd(dt.getDate());
    };
    Watcher.prototype.time = function (dt) {
        return this.dd(dt.getHours()) + ":" + this.dd(dt.getMinutes()) + ":" + this.dd(dt.getSeconds());
    };
    Watcher.prototype.start = function () {
        this.observer.observe(document.getElementById("board"), {
            characterDataOldValue: true,
            attributeOldValue: true,
            characterData: true,
            attributes: true,
            childList: true,
            subtree: true
        });
    };
    return Watcher;
}());
var watcher = new Watcher().start();
