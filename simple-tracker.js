var changesa = [];
var changesb = [];
var changesc = [];
var ukDate = function () {
    var d = new Date();
    var dt = d.getFullYear()
        + "-"
        + String("0" + d.getMonth()).slice(-2)
        + "-"
        + String("0" + d.getDate()).slice(-2)
        + " "
        + String("0" + d.getHours()).slice(-2)
        + ":"
        + String("0" + d.getMinutes()).slice(-2)
        + ":"
        + String("0" + d.getSeconds()).slice(-2);
    return dt;
};
var observer = new MutationObserver(function (mutations) {
    var count = 0;
    var dt = ukDate();
    mutations.forEach(function (m) {
        var oa = { mutation: m, datetime: ukDate() };
        changesa.push(oa);
        var ob = { mutation: m, datetime: dt };
        changesb.push(ob);
        var oc = { mutation: m, turn: count };
        changesc.push(oc);
    });
    count++;
});
observer.observe(document.getElementById("board"), {
    characterDataOldValue: true,
    attributeOldValue: true,
    characterData: true,
    attributes: true,
    childList: true,
    subtree: true
});
