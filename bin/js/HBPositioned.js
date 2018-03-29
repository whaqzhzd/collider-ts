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
var HBPositioned = /** @class */ (function (_super) {
    __extends(HBPositioned, _super);
    function HBPositioned(collider) {
        return _super.call(this, collider) || this;
    }
    HBPositioned.prototype.init = function () {
        this.startX = 0.0;
        this.startY = 0.0;
        this.velX = 0.0;
        this.velY = 0.0;
        _super.prototype.init.call(this);
    };
    HBPositioned.prototype.markTransitionStart = function () {
        var time = this.collider.getTime();
        this.startX = this.getX(time);
        this.startY = this.getY(time);
        _super.prototype.markTransitionStart.call(this);
    };
    /**
     * Set the center x-coordinate.
     * @param x Center x-corrdinate.
     */
    HBPositioned.prototype.setX = function (x) {
        this.collider.altering(this);
        this.startX = x;
    };
    /**
     * Set the center y-coordinate.
     * @param y Center y-coordinate.
     */
    HBPositioned.prototype.setY = function (y) {
        this.collider.altering(this);
        this.startY = y;
    };
    /**
     * Set the velocity of the center x-coordinate.
     * @param velX Velocity of the center x-coordinate.
     */
    HBPositioned.prototype.setVelX = function (velX) {
        this.collider.altering(this);
        this.velX = velX;
    };
    /**
     * Set the velocity of the center y-coordinate.
     * @param velY Velocity of the center y-coordinate.
     */
    HBPositioned.prototype.setVelY = function (velY) {
        this.collider.altering(this);
        this.velY = velY;
    };
    /**
     * Set the center position.
     * @param x Center x-coordinate.
     * @param y Center y-coordinate.
     */
    HBPositioned.prototype.setPos = function (x, y) {
        this.collider.altering(this);
        this.startX = x;
        this.startY = y;
    };
    /**
     * Set the velocity of the center position.
     * @param velX Velocity of the center x-coordinate.
     * @param velY Velocity of the center y-coordinate.
     */
    HBPositioned.prototype.setVel = function (velX, velY) {
        this.collider.altering(this);
        this.velX = velX;
        this.velY = velY;
    };
    HBPositioned.prototype.getX = function (time) {
        if (time === void 0) { time = this.collider.getTime(); }
        return this.startX + (time - this.startTime) * this.velX;
    };
    HBPositioned.prototype.getY = function (time) {
        if (time === void 0) { time = this.collider.getTime(); }
        return this.startY + (time - this.startTime) * this.velY;
    };
    /**
     * Get the velocity of the center x-coordinate.
     * @return The velocity of the center x-coordinate.
     */
    HBPositioned.prototype.getVelX = function () {
        return this.velX;
    };
    /**
     * Get the velocity of the center y-coordinate.
     * @return The velocity of the center y-coordinate.
     */
    HBPositioned.prototype.getVelY = function () {
        return this.velY;
    };
    /*
    public getStartPosComp(dir: number): number {
        switch (dir) {
            case Dir.R: return this.startX;
            case Dir.U: return this.startY;
            case Dir.L: return -this.startX;
            case Dir.D: return -this.startY;
            default: throw new Error();
        }
    }
    */
    /*
    public getVelComp(dir: number) {
        switch (dir) {
            case Dir.R: return this.velX;
            case Dir.U: return this.velY;
            case Dir.L: return -this.velX;
            case Dir.D: return -this.velY;
            default: throw new Error();
        }
    }
    */
    HBPositioned.prototype.getStartPosComp = function (dir) {
        switch (dir) {
            case Dir.R: return this.startX;
            case Dir.U: return this.startY;
            case Dir.L: return -this.startX;
            case Dir.D: return -this.startY;
            default: throw new Error();
        }
    };
    HBPositioned.prototype.getVelComp = function (dir) {
        switch (dir) {
            case Dir.R: return this.velX;
            case Dir.U: return this.velY;
            case Dir.L: return -this.velX;
            case Dir.D: return -this.velY;
            default: throw new Error();
        }
    };
    HBPositioned.prototype.getPosComp = function (dir, time) {
        return this.getStartPosComp(dir) + (time - this.startTime) * this.getVelComp(dir);
    };
    HBPositioned.prototype.dummySetStartCoord = function (dir, value) {
        switch (dir) {
            case Dir.R:
                this.startX = value;
                return;
            case Dir.U:
                this.startY = value;
                return;
            default: throw new Error();
        }
    };
    HBPositioned.prototype.dummySetVelCoord = function (dir, value) {
        switch (dir) {
            case Dir.R:
                this.velX = value;
                return;
            case Dir.U:
                this.velY = value;
                return;
            default: throw new Error();
        }
    };
    return HBPositioned;
}(HitBox));
//# sourceMappingURL=HBPositioned.js.map