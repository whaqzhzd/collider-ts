var FunctionEventt = /** @class */ (function () {
    function FunctionEventt(resolve) {
        resolve && (this.resolve = resolve);
    }
    FunctionEventt.prototype.resolve = function (collider) {
    };
    FunctionEventt.prototype.compareTo = function (o) {
        if (this.time > o.time)
            return 1;
        if (this.time == o.time)
            return this.id - o.id;
        return -1;
    };
    return FunctionEventt;
}());
//# sourceMappingURL=FunctionEvent.js.map