var Pool = /** @class */ (function () {
    function Pool(newObject) {
        this.peak = 0;
        this.freeObjects = new Array();
        newObject && (this.newObject = newObject);
    }
    Pool.prototype.newObject = function () {
        throw new Error();
    };
    Pool.prototype.obtain = function () {
        return this.freeObjects.length == 0 ? this.newObject() : this.freeObjects.pop();
    };
    Pool.prototype.free = function (object) {
        if (object == null)
            throw new Error("object cannot be null.");
        this.freeObjects.push(object);
        this.peak = Math.max(this.peak, this.freeObjects.length);
        if (Object.hasOwnProperty.call(object, "reset")) {
            object.reset();
        }
    };
    Pool.prototype.freeAll = function (objects) {
        if (objects == null)
            throw new Error("object cannot be null.");
        var freeObjects = this.freeObjects;
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            if (object == null)
                continue;
            freeObjects.push(object);
            if (Object.hasOwnProperty.call(object, "reset")) {
                object.reset();
            }
        }
        this.peak = Math.max(this.peak, this.freeObjects.length);
    };
    Pool.prototype.clear = function () {
        this.freeObjects.length = 0;
    };
    Pool.prototype.getFree = function () {
        return this.freeObjects.length;
    };
    return Pool;
}());
//# sourceMappingURL=Pool.js.map