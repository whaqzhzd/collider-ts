var ColliderEvent = /** @class */ (function () {
    function ColliderEvent() {
    }
    ColliderEvent.prototype.init = function (a, b, collided) {
        if (a == null || b == null)
            throw new Error();
        this.a = a;
        this.b = b;
        this.collided = collided;
    };
    ColliderEvent.prototype.clear = function () {
        this.a = null;
        this.b = null;
    };
    ColliderEvent.prototype.isInitialized = function () { return this.a != null; };
    ColliderEvent.prototype.involves = function (hitBox) { return this.a == hitBox || this.b == hitBox; };
    ColliderEvent.prototype.getTime = function () { return this.a.getTime(); };
    ColliderEvent.prototype.isCollision = function () { return this.collided; };
    ColliderEvent.prototype.isSeparation = function () { return !this.collided; };
    ColliderEvent.prototype.getFirst = function () { return this.a; };
    ColliderEvent.prototype.getSecond = function () { return this.b; };
    ColliderEvent.prototype.getOther = function (hitBox) {
        if (this.a == hitBox)
            return this.b;
        else if (this.b == hitBox)
            return this.a;
        else
            throw new Error();
    };
    return ColliderEvent;
}());
//# sourceMappingURL=ColliderEvent.js.map