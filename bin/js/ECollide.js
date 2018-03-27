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
var ECollide = /** @class */ (function (_super) {
    __extends(ECollide, _super);
    function ECollide() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ECollide.prototype.init = function (a, b, time, collided) {
        this.a = a;
        this.b = b;
        this.idA = a.getChangeId();
        this.idB = b.getChangeId();
        this.time = time;
        this.collided = collided;
    };
    ECollide.prototype.resolve = function (collider) {
        if (this.a.getChangeId() == this.idA && this.b.getChangeId() == this.idB) {
            collider.setCollision(this.a, this.b, this.collided);
        }
        this.a = null;
        this.b = null;
        collider.freeEvent(this);
    };
    return ECollide;
}(FunctionEventt));
//# sourceMappingURL=ECollide.js.map