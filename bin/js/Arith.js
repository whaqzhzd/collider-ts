var Arith = /** @class */ (function () {
    function Arith() {
    }
    Arith.quadRootAscending = function (a, b, c) {
        var det = b * b - 4 * a * c;
        if (det < 0.0)
            return NaN;
        if (b >= 0)
            return (2 * c) / (-b - Math.sqrt(det));
        else
            return (-b + Math.sqrt(det)) / (2 * a);
    };
    Arith.floor = function (value) {
        var result = (value | 0);
        if (value < 0.0 && value !== result)
            return result - 1;
        else
            return result;
    };
    Arith.ceil = function (value) {
        var result = (value | 0);
        if (value > 0.0 && value !== result)
            return result + 1;
        else
            return result;
    };
    Arith.min$double$double = function (a, b) {
        return (a < b) ? a : b;
    };
    Arith.max$double$double = function (a, b) {
        return (a > b) ? a : b;
    };
    Arith.min$int$int = function (a, b) {
        return (a < b) ? a : b;
    };
    Arith.min = function (a, b) {
        if (((typeof a === 'number') || a === null) && ((typeof b === 'number') || b === null)) {
            return Arith.min$int$int(a, b);
        }
        else if (((typeof a === 'number') || a === null) && ((typeof b === 'number') || b === null)) {
            return Arith.min$double$double(a, b);
        }
        else
            throw new Error('invalid overload');
    };
    Arith.max$int$int = function (a, b) {
        return (a > b) ? a : b;
    };
    Arith.max = function (a, b) {
        if (((typeof a === 'number') || a === null) && ((typeof b === 'number') || b === null)) {
            return Arith.max$int$int(a, b);
        }
        else if (((typeof a === 'number') || a === null) && ((typeof b === 'number') || b === null)) {
            return Arith.max$double$double(a, b);
        }
        else
            throw new Error('invalid overload');
    };
    Arith.abs = function (value) {
        if (value < 0.0)
            return -value;
        else
            return value;
    };
    return Arith;
}());
//# sourceMappingURL=Arith.js.map