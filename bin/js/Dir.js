var Dir = /** @class */ (function () {
    function Dir() {
    }
    Dir.opp = function (dir) {
        return (dir + 2) & 3;
    };
    Dir.dot = function (dirA, dirB) {
        var relDir = (dirB - dirA) & 3;
        switch (relDir) {
            case 0:
                return 1;
            case 2:
                return -1;
            default:
                return 0;
        }
    };
    Dir.x = function (dir) {
        switch (dir) {
            case Dir.R /* R */:
                return 1;
            case Dir.L /* L */:
                return -1;
            default:
                return 0;
        }
    };
    Dir.y = function (dir) {
        switch (dir) {
            case Dir.U /* U */:
                return 1;
            case Dir.D /* D */:
                return -1;
            default:
                return 0;
        }
    };
    Dir.R = 0;
    Dir.U = 1;
    Dir.L = 2;
    Dir.D = 3;
    return Dir;
}());
//# sourceMappingURL=Dir.js.map