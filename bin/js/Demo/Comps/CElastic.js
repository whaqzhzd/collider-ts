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
var CElastic = /** @class */ (function (_super) {
    __extends(CElastic, _super);
    function CElastic(x, y, diam, maxVel) {
        var _this = _super.call(this, Game.engine.makeCircle()) || this;
        _this.overlaps = new Array();
        var circ = _this.circ();
        circ.setPos(x, y);
        circ.setDiam(diam);
        circ.setVel(2 * maxVel * (.5 - Math.random()), 2 * maxVel * (.5 - Math.random()));
        // circ.setVel(maxVel, 0);
        circ.commit(Infinity);
        return _this;
    }
    CElastic.prototype.canInteract = function (other) {
        return other instanceof CElastic || other instanceof CTarget;
    };
    CElastic.prototype.interactsWithBullets = function () { return false; };
    CElastic.prototype.onCollide = function (other) {
        var otherCE;
        if (other instanceof CElastic)
            otherCE = other;
        if (otherCE != null && this.getId() > otherCE.getId())
            return;
        var success = this.elasticCollision(other);
        this.overlaps.push(other);
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
    CElastic.prototype.onSeparate = function (other) {
        var index = this.overlaps.indexOf(other);
        if (index != -1) {
            this.overlaps.splice(index, 1);
        }
    };
    CElastic.prototype.elasticCollision = function (other) {
        if (other instanceof CTarget) {
            var normal = other.hitBox.getNormal(this.hitBox);
            var success = this.elasticCollisionNum(normal.getUnitX(), normal.getUnitY(), 0, 0, Infinity);
            if (success)
                (other.hit());
            return success;
        }
        else if (other instanceof CElastic) {
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
    CElastic.prototype.elasticCollisionNum = function (nx, ny, v2x, v2y, m2) {
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
    CElastic.prototype.collideIteration = function (visitedSet) {
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
    return CElastic;
}(Component));
//# sourceMappingURL=CElastic.js.map