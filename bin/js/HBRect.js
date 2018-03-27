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
var HBRect = /** @class */ (function (_super) {
    __extends(HBRect, _super);
    function HBRect(collider) {
        return _super.call(this, collider) || this;
    }
    HBRect.prototype.init = function () {
        this.startHW = 0.0;
        this.startHH = 0.0;
        this.velHW = 0.0;
        this.velHH = 0.0;
        _super.prototype.init.call(this);
    };
    HBRect.prototype.markTransitionStart = function () {
        var time = this.collider.getTime();
        this.startHW = this.getHW(time);
        this.startHH = this.getHH(time);
        _super.prototype.markTransitionStart.call(this);
    };
    HBRect.prototype.free = function () {
        this.collider.free(this);
        _super.prototype.free.call(this);
    };
    /**
     * Set the width.
     * @param width Width.
     */
    HBRect.prototype.setWidth = function (width) {
        this.collider.altering(this);
        this.startHW = .5 * width;
    };
    /**
     * Set the height.
     * @param height Height.
     */
    HBRect.prototype.setHeight = function (height) {
        this.collider.altering(this);
        this.startHH = .5 * height;
    };
    /**
     * Set the velocity of the width.
     * @param velWidth Velocity of the width.
     */
    HBRect.prototype.setVelWidth = function (velWidth) {
        this.collider.altering(this);
        this.velHW = .5 * velWidth;
    };
    /**
     * Set the velocity of the height.
     * @param velHeight Velocity of the height.
     */
    HBRect.prototype.setVelHeight = function (velHeight) {
        this.collider.altering(this);
        this.velHH = .5 * velHeight;
    };
    /**
     * Set the width and height.
     * @param width Width.
     * @param height Height.
     */
    HBRect.prototype.setDims = function (width, height) {
        this.collider.altering(this);
        this.startHW = .5 * width;
        this.startHH = height == void 0 ? this.startHW : .5 * height;
    };
    /**
     * Set the velocities of the width and height;
     * @param velWidth Velocity of the width.
     * @param velHeight Velocity of the height.
     */
    HBRect.prototype.setVelDims = function (velWidth, velHeight) {
        this.collider.altering(this);
        this.velHW = .5 * velWidth;
        this.velHH = velHeight == void 0 ? this.velHW : .5 * velHeight;
    };
    HBRect.prototype.getHW = function (time) {
        return this.startHW + (time - this.startTime) * this.velHW;
    };
    HBRect.prototype.getHH = function (time) {
        return this.startHH + (time - this.startTime) * this.velHH;
    };
    /**
     * Get the width.
     * @return Width.
     */
    HBRect.prototype.getWidth = function () { return 2 * this.getHW(this.collider.getTime()); };
    /**
     * Get the height.
     * @return Height.
     */
    HBRect.prototype.getHeight = function () { return 2 * this.getHH(this.collider.getTime()); };
    /**
     * Get the velocity of the width.
     * @return Velocity of the width.
     */
    HBRect.prototype.getVelWidth = function () { return 2 * this.velHW; };
    /**
     * Get the velocity of the height.
     * @return Velocity of the height.
     */
    HBRect.prototype.getVelHeight = function () { return 2 * this.velHH; };
    HBRect.prototype.getStartHDim = function (dir) {
        switch (dir) {
            case Dir.R:
            case Dir.L: return this.startHW;
            case Dir.U:
            case Dir.D: return this.startHH;
            default: throw new Error();
        }
    };
    HBRect.prototype.getVelHDim = function (dir) {
        switch (dir) {
            case Dir.R:
            case Dir.L: return this.velHW;
            case Dir.U:
            case Dir.D: return this.velHH;
            default: throw new Error();
        }
    };
    HBRect.prototype.getStartEdgeComp = function (edge) {
        return this.getStartPosComp(edge) + this.getStartHDim(edge);
    };
    HBRect.prototype.getVelEdgeComp = function (edge) {
        return this.getVelComp(edge) + this.getVelHDim(edge);
    };
    HBRect.prototype.getEdgeComp = function (edge, time) {
        return this.getStartEdgeComp(edge) + (time - this.startTime) * this.getVelEdgeComp(edge);
    };
    HBRect.prototype.getBoundEdgeComp = function (edge, startTime, endTime) {
        var base = this.getStartEdgeComp(edge);
        var vel = this.getVelEdgeComp(edge);
        var evalTime = (vel > 0.0) ? endTime : startTime;
        return base + vel * (evalTime - this.startTime);
    };
    HBRect.prototype.isMoving = function () {
        return this.velX != 0.0 || this.velY != 0.0 || this.velHW != 0.0 || this.velHH != 0.0;
    };
    HBRect.prototype.getMaxBoundEdgeVel = function () {
        var vel = 0.0;
        for (var dir = 0; dir < 2; dir++) {
            vel = Math.max(vel, Arith.abs(this.getVelComp(dir)) + Arith.abs(this.getVelHDim(dir)));
        }
        return vel;
    };
    HBRect.prototype.dummyMimicCircle = function (c) {
        this.startTime = c.startTime;
        this.startX = c.startX;
        this.startY = c.startY;
        this.startHW = c.startRad;
        this.startHH = c.startRad;
        this.velX = c.velX;
        this.velY = c.velY;
        this.velHW = c.velRad;
        this.velHH = c.velRad;
    };
    return HBRect;
}(HBPositioned));
//# sourceMappingURL=HBRect.js.map