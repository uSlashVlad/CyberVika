module.exports.range = function (min, max) {
    return _range(min, max);
}

module.exports.rangeInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.arrElem = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports.chance = function(chance) {
    let rnd = _range(0, 1);

    if (rnd <= chance) {
        return true;
    } else {
        return false;
    }
}

function _range(min, max) {
    return Math.random() * (max - min) + min;
}