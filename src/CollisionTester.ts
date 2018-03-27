class CollisionTester {
    private separateBuffer: number;
    private dummyRect: HBRect = new HBRect(null);
    private dummyPoint: HBCircle = new HBCircle(null);
    private dummyRect2: HBRect = new HBRect(null);
    private dummyCircle: HBCircle = new HBCircle(null);
    public normal: Normal = new Normal();


    public constructor(opts: ColliderOpts) {
        this.separateBuffer = opts.separateBuffer;
        if (this.separateBuffer <= 0.0) throw new Error();
    }

    public collideTime(a: HitBox, b: HitBox, startTime: number): number {
        let endTime = Arith.min(a.endTime, b.endTime);
        if (endTime <= startTime) return Infinity;
        if (!CollisionTester.boundBoxTest(a, b, startTime, endTime)) return Infinity;
        return this.getTime(a, b, startTime, endTime, true);
    }

    public separateTime(a: HitBox, b: HitBox, startTime: number): number {
        let endTime = Arith.min(a.endTime, b.endTime);
        if (endTime <= startTime) return Infinity;
        let aIsRect = a instanceof HBRect;
        let bIsRect = b instanceof HBRect;
        if (aIsRect && bIsRect) {
            let rect = a as HBRect,
                hw = rect.startHW,
                hh = rect.startHH;
            rect.startHW += this.separateBuffer;
            rect.startHH += this.separateBuffer;
            let result = this.getTime(a, b, startTime, endTime, false);
            rect.startHW = hw;
            rect.startHH = hh;
            return result;
        }
        else {
            let circ = (aIsRect ? b : a) as HBCircle,
                rad = circ.startRad;
            circ.startRad += this.separateBuffer;
            let result = this.getTime(a, b, startTime, endTime, false);
            circ.startRad = rad;
            return result;
        }
    }

    public normalFunc(src: HitBox, dst: HitBox, time: number): Normal {
        if (src instanceof HBRect) {
            if (dst instanceof HBRect) return this.rectRectNormal(src, dst, time);
            else return this.rectCircNormal(<HBRect>src, <HBCircle>dst, time);
        } else {
            if (dst instanceof HBRect) {
                let normal = this.rectCircNormal(dst, src as HBCircle, time);
                normal.x = - normal.x;
                normal.y = - normal.y;
                return normal;
            }
            else return this.circCircNormal(src as HBCircle, dst as HBCircle, time);
        }
    }

    private getTime(a: HitBox, b: HitBox, startTime: number, endTime: number, forCollide: boolean): number {
        let aIsRect = a instanceof HBRect;
        let bIsRect = b instanceof HBRect;
        let result;
        if (aIsRect) {
            if (bIsRect) result = CollisionTester.rectRectTime(<HBRect>a, <HBRect>b, startTime, endTime, forCollide);
            else result = this.rectCircTime(<HBRect>a, <HBCircle>b, startTime, endTime, forCollide);
        }
        else {
            if (bIsRect) result = this.rectCircTime(<HBRect>b, <HBCircle>a, startTime, endTime, forCollide);
            else result = CollisionTester.circCircTime(<HBCircle>a, <HBCircle>b, startTime, forCollide);
        }
        if (result >= endTime) result = Infinity;
        return result;
    }

    private rectCircTime(a: HBRect, b: HBCircle, startTime: number, endTime: number, forCollide: boolean): number {
        if (forCollide) return this.rectCircCollideTime(a, b, startTime, endTime);
        else return this.rectCircSeparateTime(a, b, startTime, endTime);
    }

    private static boundBoxTest(a: HitBox, b: HitBox, startTime: number, endTime: number): boolean {
        for (let dir = 0; dir < 4; dir++) {
            let overlap = a.getBoundEdgeComp(dir, startTime, endTime)
                + b.getBoundEdgeComp(Dir.opp(dir), startTime, endTime);
            if (overlap <= 0.0) return false;
        }
        return true;
    }

    private static rectRectTime(a: HBRect, b: HBRect, startTime: number, endTime: number, forCollide: boolean): number {
        let overlapStart = 0.0;
        let overlapEnd = 1.05 * (endTime - startTime);
        
        // let overlapEnd = endTime - startTime;

        for (let dir = 0; dir < 4; dir++) {
            let overlap = a.getEdgeComp(dir, startTime) + b.getEdgeComp(Dir.opp(dir), startTime);
            let overlapVel = a.getVelEdgeComp(dir) + b.getVelEdgeComp(Dir.opp(dir));
            if (overlap < 0.0) {
                if (!forCollide) return startTime;
                if (overlapVel <= 0.0) return Infinity;
                else overlapStart = Arith.max(overlapStart, - overlap / overlapVel);
            }
            else if (overlapVel < 0.0) {
                overlapEnd = Arith.min(overlapEnd, - overlap / overlapVel);
            }
            if (overlapStart >= overlapEnd) return forCollide ? Infinity : startTime;
        }

        return startTime + (forCollide ? overlapStart : overlapEnd);
    }

    private static circCircTime(a: HBCircle, b: HBCircle, startTime: number, forCollide: boolean): number {
        let sign = forCollide ? 1.0 : - 1.0;

        let netRad = a.getRad(startTime) + b.getRad(startTime);
        let distX = a.getX(startTime) - b.getX(startTime);
        let distY = a.getY(startTime) - b.getY(startTime);

        let coeffC = sign * (netRad * netRad - distX * distX - distY * distY);
        if (coeffC > 0.0) return startTime;

        let netRadVel = a.velRad + b.velRad;
        let distXVel = a.velX - b.velX;
        let distYVel = a.velY - b.velY;

        let coeffA = sign * (netRadVel * netRadVel - distXVel * distXVel - distYVel * distYVel);
        let coeffB = sign * 2.0 * (netRad * netRadVel - distX * distXVel - distY * distYVel);

        let result = Arith.quadRootAscending(coeffA, coeffB, coeffC);
        if (result >= 0.0) return startTime + result;
        else return Infinity;
    }

    private rectCircCollideTime(a: HBRect, b: HBCircle, startTime: number, endTime: number): number {
        this.dummyRect.dummyMimicCircle(b);
        let time = CollisionTester.rectRectTime(a, this.dummyRect, startTime, endTime, true);
        if (time >= endTime) return Infinity;

        for (let dir = 0; dir < 2; dir++) {
            let hiEdge = a.getEdgeComp(dir, time);
            let loEdge = - a.getEdgeComp(Dir.opp(dir), time);
            let bCoord = b.getPosComp(dir, time);
            if (bCoord > hiEdge) {
                this.dummyPoint.dummySetStartCoord(dir, hiEdge);
                this.dummyPoint.dummySetVelCoord(dir, a.getVelEdgeComp(dir));
            }
            else if (bCoord < loEdge) {
                this.dummyPoint.dummySetStartCoord(dir, loEdge);
                this.dummyPoint.dummySetVelCoord(dir, - a.getVelEdgeComp(Dir.opp(dir)));
            }
            else return time;
        }
        this.dummyPoint.startTime = time;
        return CollisionTester.circCircTime(this.dummyPoint, b, startTime, true);
    }

    private rectCircSeparateTime(a: HBRect, b: HBCircle, startTime: number, endTime: number): number {
        let normal = this.normalFunc(a, b, startTime);
        if (normal.overlap <= 0.0) return startTime;
        CollisionTester.mirrorr(a, this.dummyRect2, endTime);
        CollisionTester.mirrorc(b, this.dummyCircle, endTime);
        this.dummyRect2.startTime = 0.0;
        this.dummyCircle.startTime = 0.0;
        let result = this.rectCircCollideTime(this.dummyRect2, this.dummyCircle, 0.0, endTime - startTime);
        return Arith.max(startTime, endTime - result);
    }

    private static mirrorr(original: HBRect, mirror: HBRect, endTime: number) {
        CollisionTester.mirrorPos(original, mirror, endTime);
        mirror.startHW = original.getHW(endTime);
        mirror.startHH = original.getHH(endTime);
        mirror.velHW = - original.velHW;
        mirror.velHH = - original.velHH;
    }

    private static mirrorc(original: HBCircle, mirror: HBCircle, endTime: number): void {
        CollisionTester.mirrorPos(original, mirror, endTime);
        mirror.startRad = original.getRad(endTime);
        mirror.velRad = - original.velRad;
    }

    private static mirrorPos(original: HBPositioned, mirror: HBPositioned, endTime: number) {
        mirror.startX = original.getX(endTime);
        mirror.startY = original.getY(endTime);
        mirror.velX = - original.velX;
        mirror.velY = - original.velY;
    }

    private rectRectNormal(src: HBRect, dst: HBRect, time: number): Normal {
        let minDir = 0;
        let overlap = Infinity;
        for (let dir = 0; dir < 4; dir++) {
            let testOverlap = src.getEdgeComp(dir, time)
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
    }

    private circCircNormal(src: HBCircle, dst: HBCircle, time: number): Normal {
        let nx = dst.getX(time) - src.getX(time);
        let ny = dst.getY(time) - src.getY(time);
        let dist = Math.sqrt(nx * nx + ny * ny);
        if (dist == 0.0) {
            nx = 1.0;
            ny = 0.0;
        }
        else {
            let invNMag = 1.0 / dist;
            nx *= invNMag;
            ny *= invNMag;
        }
        this.normal.x = nx;
        this.normal.y = ny;
        this.normal.overlap = src.getRad(time) + dst.getRad(time) - dist;
        return this.normal;
    }

    private rectCircNormal(src: HBRect, dst: HBCircle, time: number): Normal {
        for (let dir = 0; dir < 2; dir++) {
            let dstCoord = dst.getPosComp(dir, time);
            let srcHi = src.getEdgeComp(dir, time);
            let srcLo = -src.getEdgeComp(Dir.opp(dir), time);
            if (dstCoord > srcHi) this.dummyPoint.dummySetStartCoord(dir, srcHi);
            else if (dstCoord < srcLo) this.dummyPoint.dummySetStartCoord(dir, srcLo);
            else {
                this.dummyRect.dummyMimicCircle(dst);
                return this.rectRectNormal(src, this.dummyRect, time);
            }
        }
        this.dummyPoint.velX = 0.0;
        this.dummyPoint.velY = 0.0;
        return this.circCircNormal(this.dummyPoint, dst, time);
    }
}