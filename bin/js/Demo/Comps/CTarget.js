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
var CTarget = /** @class */ (function (_super) {
    __extends(CTarget, _super);
    function CTarget(hitBox) {
        var _this = _super.call(this, hitBox) || this;
        _this.hitTime = Infinity;
        return _this;
    }
    CTarget.prototype.isEnemy = function () { return false; };
    CTarget.prototype.hit = function () {
        this.hitTime = Game.engine.getTime();
    };
    CTarget.prototype.onCollide = function (other) { };
    CTarget.prototype.onSeparate = function (other) { };
    CTarget.prototype.canInteract = function (other) { return false; };
    CTarget.prototype.interactsWithBullets = function () { return true; };
    CTarget.LIT_TIME = .17;
    return CTarget;
}(Component));
//# sourceMappingURL=CTarget.js.map