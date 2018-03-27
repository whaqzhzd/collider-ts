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
var CBounds = /** @class */ (function (_super) {
    __extends(CBounds, _super);
    function CBounds() {
        var _this = _super.call(this, Game.engine.makeRect()) || this;
        var rect = _this.rect();
        rect.setPos(.5 * GameEngine.SCREEN_WIDTH, .5 * GameEngine.SCREEN_HEIGHT);
        rect.setDims(GameEngine.SCREEN_WIDTH + 2 * CBounds.PAD, GameEngine.SCREEN_HEIGHT + 2 * CBounds.PAD);
        rect.commit(Infinity);
        return _this;
    }
    CBounds.prototype.onCollide = function (other) { };
    CBounds.prototype.onSeparate = function (other) { };
    CBounds.prototype.canInteract = function (other) { return false; };
    CBounds.prototype.interactsWithBullets = function () { return true; };
    CBounds.PAD = 80;
    return CBounds;
}(Component));
//# sourceMappingURL=CBounds.js.map