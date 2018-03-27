var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HitBoxPool = /** @class */ (function (_super) {
    __extends(HitBoxPool, _super);
    function HitBoxPool(newObject) {
        var _this = _super.call(this) || this;
        _this.newObject = newObject;
        return _this;
    }
    HitBoxPool.prototype.newObject = function () {
        throw new Error();
    };
    HitBoxPool.prototype.obtain = function () {
        return _super.prototype.obtain.call(this);
    };
    HitBoxPool.prototype.free = function (hitBox) {
        _super.prototype.free.call(this, hitBox);
    };
    return HitBoxPool;
}(Pool));
//# sourceMappingURL=HitBoxPool.js.map