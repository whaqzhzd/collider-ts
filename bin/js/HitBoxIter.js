var HitBoxIter = /** @class */ (function () {
    function HitBoxIter() {
        this.boxIter = new Iterator();
        this.cellIter = new Array();
        this.testId = 0;
        this.i = 0;
    }
    HitBoxIter.prototype.init = function (region, groups, testId, field) {
        this.clear();
        if (groups.length == 0)
            return;
        this.boxIter.init(region);
        if (this.boxIter.isDone())
            return;
        this.field = field;
        this.testId = testId;
        this.groups = groups;
        this.initCellIter();
        this.searchNext();
        this.i = 0;
    };
    HitBoxIter.prototype.initCellIter = function () {
        var key = Field.getKey(this.boxIter.getX(), this.boxIter.getY(), this.groups[this.groupIndex]);
        this.cellIter = this.field.data[key]; // &&  (this.field.data[key] instanceof Array) && this.field.data[key].slice(0);
    };
    HitBoxIter.prototype.searchNext = function () {
        while (true) {
            this.i += 1;
            if (this.i > 100) {
                debugger;
            }
            var cellIter = this.cellIter;
            if (cellIter) {
                if (!(cellIter instanceof Array)) {
                    this.next = cellIter;
                    if (this.next.testMark(this.testId))
                        return;
                }
                for (var i = 0, l = cellIter.length; i < l; i++) {
                    this.next = cellIter[i];
                    if (this.next.testMark(this.testId))
                        return;
                }
            }
            this.groupIndex++;
            if (this.groupIndex >= this.groups.length) {
                this.groupIndex = 0;
                this.boxIter.next();
                if (this.boxIter.isDone()) {
                    this.clear();
                    return;
                }
            }
            this.initCellIter();
        }
    };
    HitBoxIter.prototype.clear = function () {
        // if (this.cellIter instanceof Array && this.cellIter.length > 0) debugger;
        // this.cellIter && (this.cellIter.length = 0);
        this.cellIter = null;
        this.groups = null;
        this.groupIndex = 0;
        this.next = null;
        this.field = null;
    };
    HitBoxIter.prototype.nextFunc = function () {
        if (this.next == null)
            throw new Error();
        var result = this.next;
        this.searchNext();
        return result;
    };
    HitBoxIter.prototype.iterator = function () { return this; };
    HitBoxIter.prototype.hasNext = function () { return this.next != null; };
    HitBoxIter.prototype.remove = function () { throw new Error(); };
    return HitBoxIter;
}());
//# sourceMappingURL=HitBoxIter.js.map