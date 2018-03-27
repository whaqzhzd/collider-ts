var CollisionTester = /** @class */ (function () {
    function CollisionTester(opts) {
        this.dummyRect = new HBRect(null);
        this.dummyPoint = new HBCircle(null);
        this.dummyRect2 = new HBRect(null);
        this.dummyCircle = new HBCircle(null);
        this.normal = new Normal();
        this.separateBuffer = opts.separateBuffer;
        if (this.separateBuffer <= 0.0)
            throw new Error();
    }
    CollisionTester.prototype.collideTime = function (a, b, startTime) {
        var endTime = Arith.min(a.endTime, b.endTime);
        if (endTime <= startTime)
            return Infinity;
        if (!CollisionTester.boundBoxTest(a, b, startTime, endTime))
            return Infinity;
        return this.getTime(a, b, startTime, endTime, true);
    };
    CollisionTester.prototype.separateTime = function (a, b, startTime) {
        var endTime = Arith.min(a.endTime, b.endTime);
        if (endTime <= startTime)
            return Infinity;
        var aIsRect = a instanceof HBRect;
        var bIsRect = b instanceof HBRect;
        if (aIsRect && bIsRect) {
            var rect = a, hw = rect.startHW, hh = rect.startHH;
            rect.startHW += this.separateBuffer;
            rect.startHH += this.separateBuffer;
            var result = this.getTime(a, b, startTime, endTime, false);
            rect.startHW = hw;
            rect.startHH = hh;
            return result;
        }
        else {
            var circ = (aIsRect ? b : a), rad = circ.startRad;
            circ.startRad += this.separateBuffer;
            var result = this.getTime(a, b, startTime, endTime, false);
            circ.startRad = rad;
            return result;
        }
    };
    CollisionTester.prototype.normalFunc = function (src, dst, time) {
        if (src instanceof HBRect) {
            if (dst instanceof HBRect)
                return this.rectRectNormal(src, dst, time);
            else
                return this.rectCircNormal(src, dst, time);
        }
        else {
            if (dst instanceof HBRect) {
                var normal = this.rectCircNormal(dst, src, time);
                normal.x = -normal.x;
                normal.y = -normal.y;
                return normal;
            }
            else
                return this.circCircNormal(src, dst, time);
        }
    };
    CollisionTester.prototype.getTime = function (a, b, startTime, endTime, forCollide) {
        var aIsRect = a instanceof HBRect;
        var bIsRect = b instanceof HBRect;
        var result;
        if (aIsRect) {
            if (bIsRect)
                result = CollisionTester.rectRectTime(a, b, startTime, endTime, forCollide);
            else
                result = this.rectCircTime(a, b, startTime, endTime, forCollide);
        }
        else {
            if (bIsRect)
                result = this.rectCircTime(b, a, startTime, endTime, forCollide);
            else
                result = CollisionTester.circCircTime(a, b, startTime, forCollide);
        }
        if (result >= endTime)
            result = Infinity;
        return result;
    };
    CollisionTester.prototype.rectCircTime = function (a, b, startTime, endTime, forCollide) {
        if (forCollide)
            return this.rectCircCollideTime(a, b, startTime, endTime);
        else
            return this.rectCircSeparateTime(a, b, startTime, endTime);
    };
    CollisionTester.boundBoxTest = function (a, b, startTime, endTime) {
        for (var dir = 0; dir < 4; dir++) {
            var overlap = a.getBoundEdgeComp(dir, startTime, endTime)
                + b.getBoundEdgeComp(Dir.opp(dir), startTime, endTime);
            if (overlap <= 0.0)
                return false;
        }
        return true;
    };
    CollisionTester.rectRectTime = function (a, b, startTime, endTime, forCollide) {
        var overlapStart = 0.0;
        var overlapEnd = 1.05 * (endTime - startTime);
        for (var dir = 0; dir < 4; dir++) {
            var overlap = a.getEdgeComp(dir, startTime) + b.getEdgeComp(Dir.opp(dir), startTime);
            var overlapVel = a.getVelEdgeComp(dir) + b.getVelEdgeComp(Dir.opp(dir));
            if (overlap < 0.0) {
                if (!forCollide)
                    return startTime;
                if (overlapVel <= 0.0)
                    return Infinity;
                else
                    overlapStart = Arith.max(overlapStart, -overlap / overlapVel);
            }
            else if (overlapVel < 0.0) {
                overlapEnd = Arith.min(overlapEnd, -overlap / overlapVel);
            }
            if (overlapStart >= overlapEnd)
                return forCollide ? Infinity : startTime;
        }
        return startTime + (forCollide ? overlapStart : overlapEnd);
    };
    CollisionTester.circCircTime = function (a, b, startTime, forCollide) {
        var sign = forCollide ? 1.0 : -1.0;
        var netRad = a.getRad(startTime) + b.getRad(startTime);
        var distX = a.getX(startTime) - b.getX(startTime);
        var distY = a.getY(startTime) - b.getY(startTime);
        var coeffC = sign * (netRad * netRad - distX * distX - distY * distY);
        if (coeffC > 0.0)
            return startTime;
        var netRadVel = a.velRad + b.velRad;
        var distXVel = a.velX - b.velX;
        var distYVel = a.velY - b.velY;
        var coeffA = sign * (netRadVel * netRadVel - distXVel * distXVel - distYVel * distYVel);
        var coeffB = sign * 2.0 * (netRad * netRadVel - distX * distXVel - distY * distYVel);
        var result = Arith.quadRootAscending(coeffA, coeffB, coeffC);
        if (result >= 0.0)
            return startTime + result;
        else
            return Infinity;
    };
    CollisionTester.prototype.rectCircCollideTime = function (a, b, startTime, endTime) {
        this.dummyRect.dummyMimicCircle(b);
        var time = CollisionTester.rectRectTime(a, this.dummyRect, startTime, endTime, true);
        if (time >= endTime)
            return Infinity;
        for (var dir = 0; dir < 2; dir++) {
            var hiEdge = a.getEdgeComp(dir, time);
            var loEdge = -a.getEdgeComp(Dir.opp(dir), time);
            var bCoord = b.getPosComp(dir, time);
            if (bCoord > hiEdge) {
                this.dummyPoint.dummySetStartCoord(dir, hiEdge);
                this.dummyPoint.dummySetVelCoord(dir, a.getVelEdgeComp(dir));
            }
            else if (bCoord < loEdge) {
                this.dummyPoint.dummySetStartCoord(dir, loEdge);
                this.dummyPoint.dummySetVelCoord(dir, -a.getVelEdgeComp(Dir.opp(dir)));
            }
            else
                return time;
        }
        this.dummyPoint.startTime = time;
        return CollisionTester.circCircTime(this.dummyPoint, b, startTime, true);
    };
    CollisionTester.prototype.rectCircSeparateTime = function (a, b, startTime, endTime) {
        var normal = this.normalFunc(a, b, startTime);
        if (normal.overlap <= 0.0)
            return startTime;
        CollisionTester.mirrorr(a, this.dummyRect2, endTime);
        CollisionTester.mirrorc(b, this.dummyCircle, endTime);
        this.dummyRect2.startTime = 0.0;
        this.dummyCircle.startTime = 0.0;
        var result = this.rectCircCollideTime(this.dummyRect2, this.dummyCircle, 0.0, endTime - startTime);
        return Arith.max(startTime, endTime - result);
    };
    CollisionTester.mirrorr = function (original, mirror, endTime) {
        CollisionTester.mirrorPos(original, mirror, endTime);
        mirror.startHW = original.getHW(endTime);
        mirror.startHH = original.getHH(endTime);
        mirror.velHW = -original.velHW;
        mirror.velHH = -original.velHH;
    };
    CollisionTester.mirrorc = function (original, mirror, endTime) {
        CollisionTester.mirrorPos(original, mirror, endTime);
        mirror.startRad = original.getRad(endTime);
        mirror.velRad = -original.velRad;
    };
    CollisionTester.mirrorPos = function (original, mirror, endTime) {
        mirror.startX = original.getX(endTime);
        mirror.startY = original.getY(endTime);
        mirror.velX = -original.velX;
        mirror.velY = -original.velY;
    };
    CollisionTester.prototype.rectRectNormal = function (src, dst, time) {
        var minDir = 0;
        var overlap = Infinity;
        for (var dir = 0; dir < 4; dir++) {
            var testOverlap = src.getEdgeComp(dir, time)
                + dst.getEdgeComp(Dir.opp(dir), time);
            if (testOverlap < overlap) {
                overlap = testOverlap;
                minDir = dir;
            }
        }
        this.normal.x = Dir.x(minDir);
        this.normal.y = Dir.y(minDir);
        this.normal.overlap = overlap;
        return this.normal;
    };
    CollisionTester.prototype.circCircNormal = function (src, dst, time) {
        var nx = dst.getX(time) - src.getX(time);
        var ny = dst.getY(time) - src.getY(time);
        var dist = Math.sqrt(nx * nx + ny * ny);
        if (dist == 0.0) {
            nx = 1.0;
            ny = 0.0;
        }
        else {
            var invNMag = 1.0 / dist;
            nx *= invNMag;
            ny *= invNMag;
        }
        this.normal.x = nx;
        this.normal.y = ny;
        this.normal.overlap = src.getRad(time) + dst.getRad(time) - dist;
        return this.normal;
    };
    CollisionTester.prototype.rectCircNormal = function (src, dst, time) {
        for (var dir = 0; dir < 2; dir++) {
            var dstCoord = dst.getPosComp(dir, time);
            var srcHi = src.getEdgeComp(dir, time);
            var srcLo = -src.getEdgeComp(Dir.opp(dir), time);
            if (dstCoord > srcHi)
                this.dummyPoint.dummySetStartCoord(dir, srcHi);
            else if (dstCoord < srcLo)
                this.dummyPoint.dummySetStartCoord(dir, srcLo);
            else {
                this.dummyRect.dummyMimicCircle(dst);
                return this.rectRectNormal(src, this.dummyRect, time);
            }
        }
        this.dummyPoint.velX = 0.0;
        this.dummyPoint.velY = 0.0;
        return this.circCircNormal(this.dummyPoint, dst, time);
    };
    return CollisionTester;
}());
//# sourceMappingURL=CollisionTester.js.map