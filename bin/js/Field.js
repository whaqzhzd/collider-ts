var Field = /** @class */ (function () {
    function Field(opts) {
        this.setPool = new Array();
        this.numEntries = 0;
        this.boxIter = new Iterator();
        this.diffIter = new DiffIterator();
        this.iter = new HitBoxIter();
        if (opts.cellWidth <= 0.0)
            throw new Error();
        this.cellWidth = opts.cellWidth;
        this.data = {};
    }
    Field.prototype.getIndexBounds = function (hitBox, bounds) {
        bounds.l = Arith.floor(-hitBox.getBoundEdgeComp(Dir.L, hitBox.startTime, hitBox.endTime) / this.cellWidth);
        bounds.b = Arith.floor(-hitBox.getBoundEdgeComp(Dir.D, hitBox.startTime, hitBox.endTime) / this.cellWidth);
        bounds.r = Arith.max(bounds.l, Arith.ceil(hitBox.getBoundEdgeComp(Dir.R, hitBox.startTime, hitBox.endTime) / this.cellWidth) - 1);
        bounds.t = Arith.max(bounds.b, Arith.ceil(hitBox.getBoundEdgeComp(Dir.U, hitBox.startTime, hitBox.endTime) / this.cellWidth) - 1);
    };
    Field.prototype.iteratorThree = function (region, groups, testId) {
        this.iter.init(region, groups, testId, this);
        return this.iter;
    };
    Field.prototype.getGridPeriod = function (hitBox) {
        var speed = hitBox.getMaxBoundEdgeVel();
        if (speed <= 0.0)
            return Infinity;
        else
            return this.cellWidth / speed;
    };
    Field.prototype.getNumEntries = function () { return this.numEntries; };
    Field.prototype.remove = function (hitBox, group, oldBox, newBox) {
        if (group < 0)
            return;
        var iter = this.iterator(oldBox, newBox);
        for (; !iter.isDone(); iter.next()) {
            this.removeFromCell(hitBox, iter.getX(), iter.getY(), group);
        }
    };
    Field.getKey = function (x, y, group) {
        if (x > Field.MAX_INDEX || x < -Field.MAX_INDEX)
            throw new Error();
        if (y > Field.MAX_INDEX || y < -Field.MAX_INDEX)
            throw new Error();
        if (group >= Field.SMALL_PRIME || group < 0)
            throw new Error();
        return group + (Field.SMALL_PRIME * x + Field.PRIME * y);
    };
    Field.prototype.removeFromCell = function (hitBox, x, y, group) {
        var key = Field.getKey(x, y, group);
        var oldSetObj = this.data[key];
        var res = ArrayUtil.remove(oldSetObj, hitBox);
        var newSetObj = res.arr;
        if (!res.flag)
            throw new Error();
        if (newSetObj == null)
            delete this.data[key];
        else if (newSetObj != oldSetObj)
            this.data[key] = newSetObj;
        this.numEntries--;
    };
    Field.prototype.add = function (hitBox, group, oldBox, newBox) {
        if (group < 0)
            return;
        var iter = this.iterator(newBox, oldBox);
        for (; !iter.isDone(); iter.next()) {
            this.addToCell(hitBox, iter.getX(), iter.getY(), group);
        }
    };
    Field.prototype.addToCell = function (hitBox, x, y, group) {
        var key = Field.getKey(x, y, group);
        var oldSetObj = this.data[key];
        var res = ArrayUtil.add(oldSetObj, hitBox);
        var newSetObj = res.arr;
        if (!res.flag)
            throw new Error();
        if (newSetObj != oldSetObj)
            this.data[key] = newSetObj;
        this.numEntries++;
    };
    Field.prototype.iterator = function (box, subBox) {
        if (subBox == null) {
            this.boxIter.init(box);
            return this.boxIter;
        }
        else {
            this.diffIter.init(box, subBox);
            return this.diffIter;
        }
    };
    Field.PRIME = 160481219;
    Field.SMALL_PRIME = 263;
    Field.MAX_INDEX = Math.floor(Field.PRIME / 2 - 1);
    return Field;
}());
//# sourceMappingURL=Field.js.map