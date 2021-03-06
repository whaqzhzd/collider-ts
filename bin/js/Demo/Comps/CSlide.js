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
//碰撞反弹
var CSlide = /** @class */ (function (_super) {
    __extends(CSlide, _super);
    function CSlide(x, y, diam, maxVel) {
        var _this = _super.call(this, Game.engine.makeCircle()) || this;
        _this.overlaps = new Array();
        _this.overlaps1 = new Array();
        _this.stuckTime = -1;
        var circ = _this.circ();
        circ.setPos(x, y);
        circ.setDiam(diam);
        circ.setVel(maxVel, maxVel);
        circ.commit(Infinity);
        return _this;
    }
    CSlide.prototype.canInteract = function (other) {
        return other instanceof CElastic || other instanceof CTarget;
    };
    CSlide.prototype.interactsWithBullets = function () { return false; };
    CSlide.prototype.onCollide = function (other) {
        // let time = Game.engine.getTime();
        // if (this.stuckTime >= 0.0 && this.stuckTime < time) return;
        // if (this.stuckTime < 0.0) this.stuckTime = time;
        // let normal = this.hitBox.getNormal(other.hitBox);
        // // console.log(normal);
        // // console.log(this.hitBox.startX + (-normal.x * - normal.overlap), this.hitBox.startY + (-normal.y * - normal.overlap));
        // let x: number = this.hitBox.startX, y: number = this.hitBox.startY;
        // if (normal.x != 0) {
        //     if (normal.overlap < 0) {
        //         x = this.hitBox.startX + (-normal.x * - normal.overlap * 200);
        //     }
        // }
        // if (normal.y != 0) {
        //     if (normal.overlap < 0) {
        //         y = this.hitBox.startY + (-normal.y * - normal.overlap * 200);
        //     }
        // }
        // this.hitBox.setPos(x, y);
        // console.log(this.hitBox.startX, this.hitBox.startY);
        // this.overlaps.push(other);
        // this.hitBox.commit(Infinity);
        // if (this.stuckTime == time && this.hitBox.getOverlap(other.hitBox) > .1) {
        //     this.delete ();
        // }
        // else {
        //     this.hitBox.setVel(0.0, 0.0);
        //     this.hitBox.commit(Infinity);
        //     this.stuckTime = -1;
        // }
        // if (other instanceof CTarget) (<CTarget>other).hit();
        var otherCE;
        if (other instanceof CSlide)
            otherCE = other;
        if (otherCE != null && this.getId() > otherCE.getId())
            return;
        var success = this.elasticCollision(other);
        // console.log("碰撞到了,要停下来")
        this.overlaps.push(other);
        this.overlaps1.push(other);
        if (otherCE != null)
            otherCE.overlaps.push(this);
        if (!success)
            return;
        if (this.overlaps.length == 1 && (otherCE == null || otherCE.overlaps.length == 1))
            return;
        var visitedSet = [];
        for (var i = 0; i < 100; i++) {
            if (!this.collideIteration(visitedSet)) {
                if (i >= 15) {
                    console.log("WARNING: chained elastic collision took "
                        + (i + 1) + " iterations");
                }
                return;
            }
            visitedSet = [];
        }
        throw new Error("chained elastic collision not converging");
    };
    CSlide.prototype.onSeparate = function (other) {
        var index = this.overlaps.indexOf(other);
        if (index != -1) {
            this.overlaps.splice(index, 1);
        }
        /*
        for (let i = 0, length = this.overlaps.length; i < length; i++) {
            let node = this.overlaps[i];
            if (node != other) {
                continue;
            }
            let normal = this.hitBox.getNormal(node.hitBox);
            // if (normal.overlap == 0) normal.overlap = -0.5;

            this.hitBox.setPos(this.hitBox.startX + (-normal.x * - normal.overlap * 20), this.hitBox.startY + (-normal.y * - normal.overlap * 20));

            this.overlaps.splice(i, 1);
            i--; length--;
        }
        */
        this.hitBox.setVel(0, 0);
        this.hitBox.commit(Infinity);
        // console.log("onSeparatexxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    };
    CSlide.prototype.elasticCollision = function (other) {
        if (other instanceof CTarget) {
            var normal = other.hitBox.getNormal(this.hitBox);
            var success = this.elasticCollisionNum(normal.getUnitX(), normal.getUnitY(), 0, 0, Infinity);
            if (success)
                (other.hit());
            return success;
        }
        else if (other instanceof CSlide) {
            var circA = this.circ();
            var circB = other.circ();
            var n = circB.getNormal(circA);
            var v1x = circA.getVelX();
            var v1y = circA.getVelY();
            var v2x = circB.getVelX();
            var v2y = circB.getVelY();
            var result = this.elasticCollisionNum(n.getUnitX(), n.getUnitY(), v2x, v2y, Geom.area(circB)) ? 1 : 0;
            var r = other.elasticCollisionNum(-n.getUnitX(), -n.getUnitY(), v1x, v1y, Geom.area(circA)) ? 1 : 0;
            result = result | r;
            return result == 1 ? true : false;
        }
        throw new Error();
    };
    CSlide.prototype.elasticCollisionNum = function (nx, ny, v2x, v2y, m2) {
        var circ = this.circ();
        var m1 = Geom.area(circ);
        var v1x = circ.getVelX();
        var v1y = circ.getVelY();
        var normalRelVelComp = nx * (v2x - v1x) + ny * (v2y - v1y);
        if (normalRelVelComp <= 0.00001)
            return false;
        var massRatio;
        if (m2 == Infinity)
            massRatio = 1.0;
        else
            massRatio = m2 / (m1 + m2);
        var term = 2 * massRatio * normalRelVelComp;
        circ.setVel(v1x + term * nx, v1y + term * ny);
        circ.commit(Infinity);
        return true;
    };
    CSlide.prototype.collideIteration = function (visitedSet) {
        visitedSet.push(this);
        var changed = 0;
        for (var i = 0, l = this.overlaps.length; i < l; i++) {
            var index = visitedSet.indexOf(this.overlaps[i]);
            if (index != -1)
                continue;
            changed = changed | (this.elasticCollision(this.overlaps[i]) ? 1 : 0);
        }
        for (var j = 0, len = this.overlaps.length; j < len; j++) {
            if (this.overlaps[j] instanceof CElastic) {
                var index = visitedSet.indexOf(this.overlaps[j]);
                if (index != -1)
                    continue;
                changed = changed | (this.elasticCollision(this.overlaps[j]) ? 1 : 0);
            }
        }
        return changed == 1 ? true : false;
    };
    return CSlide;
}(Component));
//# sourceMappingURL=CSlide.js.map