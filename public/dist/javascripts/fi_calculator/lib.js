String.prototype.contains = function (it) {
    return this.indexOf(it) !== -1;
};

Math.sign = Math.sign || function sign(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
};

var deep_copy = function(string) {
    return JSON.parse(JSON.stringify(string))
};




var transformToAssocArray = function (prmstr) {
    var params = {};
    var prmarr = prmstr.substr(1).split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
};

Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var precise_round = function (num, decimals) {
    var t = Math.pow(10, decimals);
    return parseFloat((Math.round((num * t) + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals));
};


var round_interest_diff = function (a) {
    if (a > 0) {
        a = Math.ceil(a);
    }
    else if (a < 0) {
        a = Math.floor(a);

    }
    else {
        return a;
    }
};
var arraysEqual = function (a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};