[...Array(26).keys()]
    .map(i => {
        return {
            char: String.fromCharCode(97 + i),
            id: Math.floor(Math.random() * 4 + 1)
        };
    })
    .reduce((os, o) => {
        var group = os.filter(x => x["group"] === o.id);
        if (group.length === 0) {
            os.push({
                group: o.id,
                chars: [o.char]
            });
        } else {
             group[0].chars.push(o.char);
        };
        return os;
    }, []);
