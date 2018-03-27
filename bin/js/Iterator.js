var Iterator = /** @class */ (function () {
    function Iterator(box) {
        this.l = -1;
        this.r = -1;
        this.t = -1;
        box && this.init(box);
    }
    Iterator.prototype.init = function (box) {
        var b;
        if (box == null) {
            this.l = 0;
            this.r = 0;
            b = 0;
            this.t = -1;
        }
        else {
            this.l = box.l;
            this.r = box.r;
            b = box.b;
            this.t = box.t;
        }
        if (this.r < this.l)
            this.t = b - 1;
        this.x = this.l;
        this.y = b;
    };
    Iterator.prototype.isDone = function () {
        return this.y > this.t;
    };
    Iterator.prototype.next = function () {
        this.x++;
        if (this.x > this.r) {
            this.x = this.l;
            this.y++;
        }
    };
    Iterator.prototype.getX = function () { return this.x; };
    Iterator.prototype.getY = function () { return this.y; };
    return Iterator;
}());
//# sourceMappingURL=Iterator.js.map