var DiffIterator = /** @class */ (function () {
    function DiffIterator(box, subBox) {
        this.l = -1;
        this.r = -1;
        this.t = -1;
        box && subBox && this.init(box, subBox);
    }
    DiffIterator.prototype.init = function (box, subBox) {
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
        if (subBox == null) {
            this.sl = 0;
            this.sr = 0;
            this.sb = 0;
            this.st = -1;
        }
        else {
            this.sl = subBox.l;
            this.sr = subBox.r;
            this.sb = subBox.b;
            this.st = subBox.t;
        }
        this.x = this.l - 1;
        this.y = b;
        this.next();
    };
    DiffIterator.prototype.isDone = function () {
        return this.y > this.t;
    };
    DiffIterator.prototype.next = function () {
        //x坐标迭代++
        this.x++;
        //如果x坐标大于右边界
        if (this.x > this.r) {
            //设置x坐标为左边界
            this.x = this.l;
            //y坐标迭代++
            this.y++;
        }
        //如果y坐标小于
        if (this.y < this.sb || this.y > this.st || this.x < this.sl || this.x > this.sr)
            return;
        if (this.sr >= this.r) {
            if (this.sl <= this.l)
                this.y = this.st + 1;
            else {
                this.x = this.l;
                this.y++;
            }
        }
        else {
            this.x = this.sr + 1;
        }
    };
    DiffIterator.prototype.getX = function () {
        return this.x;
    };
    DiffIterator.prototype.getY = function () {
        return this.y;
    };
    return DiffIterator;
}());
//# sourceMappingURL=DiffIterator.js.map