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
var EReiterate = /** @class */ (function (_super) {
    __extends(EReiterate, _super);
    function EReiterate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EReiterate.prototype.init = function (hitBox, startTime, endTime, period) {
        if (startTime >= endTime)
            throw new Error();
        this.hitBox = hitBox;
        this.time = startTime;
        this.endTime = endTime;
        this.period = period;
        this.changeId = hitBox.getChangeId();
    };
    EReiterate.prototype.resolve = function (collider) {
        if (this.changeId == this.hitBox.getChangeId()) {
            var stepEndTime = collider.getTime() + this.period;
            if (this.endTime <= stepEndTime) {
                this.hitBox.commit(this.endTime);
            }
            else {
                this.hitBox.commit(stepEndTime);
                collider.processCurHBAndCollision(false);
                this.changeId = this.hitBox.getChangeId();
                this.time = stepEndTime;
                collider.queueFunc(this);
                return;
            }
        }
        this.hitBox = null;
        collider.freeEvent(this);
    };
    return EReiterate;
}(FunctionEventt));
//# sourceMappingURL=EReiterate.js.map