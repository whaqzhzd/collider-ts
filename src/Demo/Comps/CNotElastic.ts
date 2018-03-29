//碰撞停止
class CNotElastic extends Component {
    private overlaps: Array<Component> = new Array<Component>();
    private stuckTime: number = -1;

    public constructor(x: number, y: number, diam: number, maxVel: number) {
        super(Game.engine.makeCircle());
        let circ = this.circ();
        circ.setPos(x, y);
        circ.setDiam(diam);
        // circ.setVel(2 * maxVel * (.5 - Math.random()), 2 * maxVel * (.5 - Math.random()));

        circ.setVel(maxVel, maxVel);
        circ.commit(Infinity);
    }

    public canInteract(other: Component): boolean {
        return other instanceof CElastic || other instanceof CTarget;
    }

    public interactsWithBullets(): boolean { return false; }

    public onCollide(other: Component) {
        let otherCE: CNotElastic
        if (other instanceof CNotElastic) otherCE = <CNotElastic>other;
        if (otherCE != null && this.getId() > otherCE.getId()) return;
        let success = this.elasticCollision(other);
        console.log("碰撞到了,要停下来")
        this.overlaps.push(other);
        if (otherCE != null) otherCE.overlaps.push(this);
        if (!success) return;
        if (this.overlaps.length == 1 && (otherCE == null || otherCE.overlaps.length == 1)) return;
        let visitedSet = [];
        for (let i = 0; i < 100; i++) {
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
    }

    public onSeparate(other: Component) {
        let index = this.overlaps.indexOf(other);
        if (index != -1) {
            this.overlaps.splice(index, 1)
        }

        this.hitBox.setVel(0.0, 0.0);
        this.hitBox.commit(Infinity);
    }

    private elasticCollision(other: Component): boolean {
        if (other instanceof CTarget) {
            let normal = other.hitBox.getNormal(this.hitBox);
            let success = this.elasticCollisionNum(normal.getUnitX(), normal.getUnitY(), 0, 0,
                Infinity);
            if (success) ((<CTarget>other).hit());
            return success;
        }
        else if (other instanceof CNotElastic) {
            let circA = this.circ();
            let circB = other.circ();
            let n = circB.getNormal(circA);
            let v1x = circA.getVelX();
            let v1y = circA.getVelY();
            let v2x = circB.getVelX();
            let v2y = circB.getVelY();
            let result = this.elasticCollisionNum(
                n.getUnitX(), n.getUnitY(), v2x, v2y, Geom.area(circB)) ? 1 : 0;
            let r = (<CNotElastic>other).elasticCollisionNum(
                -n.getUnitX(), -n.getUnitY(), v1x, v1y, Geom.area(circA)) ? 1 : 0;

            result = result | r;

            return result == 1 ? true : false;
        }
        throw new Error();
    }

    private elasticCollisionNum(nx: number, ny: number, v2x: number, v2y: number, m2: number): boolean {
        let circ = this.circ();
        let m1 = Geom.area(circ);
        let v1x = circ.getVelX();
        let v1y = circ.getVelY();

        let normalRelVelComp = nx * (v2x - v1x) + ny * (v2y - v1y);
        if (normalRelVelComp <= 0.00001) return false;
        let massRatio;
        if (m2 == Infinity) massRatio = 1.0;
        else massRatio = m2 / (m1 + m2);
        let term = 2 * massRatio * normalRelVelComp;

        // if (nx == 0 && ny != 0) {
        //     circ.setVel(v1x + term * nx, 0);
        // } else if (nx != 0 && ny == 0) {
        //     circ.setVel(0, v1y + term * ny);
        // } else {
        //     circ.setVel(v1x + term * nx, v1y + term * ny);
        // }
        circ.setVel(v1x + term * nx, v1y + term * ny);
        circ.commit(Infinity);
        return true;
    }

    private collideIteration(visitedSet: any[]): boolean {
        visitedSet.push(this);
        let changed = 0;
        for (let i = 0, l = this.overlaps.length; i < l; i++) {
            let index = visitedSet.indexOf(this.overlaps[i]);
            if (index != -1) continue;

            changed = changed | (this.elasticCollision(this.overlaps[i]) ? 1 : 0);
        }

        for (let j = 0, len = this.overlaps.length; j < len; j++) {
            if (this.overlaps[j] instanceof CElastic) {
                let index = visitedSet.indexOf(this.overlaps[j]);
                if (index != -1) continue;

                changed = changed | (this.elasticCollision(this.overlaps[j]) ? 1 : 0);
            }
        }
        return changed == 1 ? true : false;
    }
}