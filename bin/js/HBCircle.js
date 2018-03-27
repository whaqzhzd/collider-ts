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
var HBCircle = /** @class */ (function (_super) {
    __extends(HBCircle, _super);
    function HBCircle(collider) {
        return _super.call(this, collider) || this;
    }
    HBCircle.prototype.init = function () {
        this.startRad = 0.0;
        this.velRad = 0.0;
        _super.prototype.init.call(this);
    };
    HBCircle.prototype.markTransitionStart = function () {
        var time = this.collider.getTime();
        this.startRad = this.getRad(time);
        _super.prototype.markTransitionStart.call(this);
    };
    HBCircle.prototype.free = function () {
        this.collider.free(this);
        _super.prototype.free.call(this);
    };
    /**
     * Set the diameter.
     * @param diam Diameter.
     */
    HBCircle.prototype.setDiam = function (diam) {
        this.collider.altering(this);
        this.startRad = .5 * diam;
    };
    /**
     * Set the velocity of the diameter.
     * @param velDiam Velocity of the diameter.
     */
    HBCircle.prototype.setVelDiam = function (velDiam) {
        this.collider.altering(this);
        this.velRad = .5 * velDiam;
    };
    HBCircle.prototype.getRad = function (time) { return this.startRad + (time - this.startTime) * this.velRad; };
    /**
     * Get the diameter.
     * @return Diameter.
     */
    HBCircle.prototype.getDiam = function () { return 2 * this.getRad(this.collider.getTime()); };
    /**
     * Get the velocity of the diameter.
     * @return Velocity of the diameter.
     */
    HBCircle.prototype.getVelDiam = function () { return 2 * this.velRad; };
    HBCircle.prototype.getStartEdgeComp = function (edge) {
        return this.getStartPosComp(edge) + this.startRad;
    };
    HBCircle.prototype.getVelEdgeComp = function (edge) {
        return this.getVelComp(edge) + this.velRad;
    };
    HBCircle.prototype.getBoundEdgeComp = function (edge, startTime, endTime) {
        var base = this.getStartEdgeComp(edge);
        var vel = this.getVelEdgeComp(edge);
        var evalTime = (vel > 0.0) ? endTime : startTime;
        return base + vel * (evalTime - this.startTime);
    };
    HBCircle.prototype.isMoving = function () {
        return this.velX != 0.0 || this.velY != 0.0 || this.velRad != 0.0;
    };
    HBCircle.prototype.getMaxBoundEdgeVel = function () {
        var vel = 0.0;
        var absVelRad = Arith.abs(this.velRad);
        for (var dir = 0; dir < 2; dir++) {
            vel = Math.max(vel, Arith.abs(this.getVelComp(dir)) + absVelRad);
        }
        return vel;
    };
    return HBCircle;
}(HBPositioned));
//# sourceMappingURL=HBCircle.js.map