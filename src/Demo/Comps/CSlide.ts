
//碰撞反弹
class CSlide extends Component {
    private overlaps: Array<Component> = new Array<Component>();
    public overlaps1: Array<Component> = new Array<Component>();
    private stuckTime: number = -1;

    public constructor(x: number, y: number, diam: number, maxVel: number) {
        super(Game.engine.makeCircle());
        let circ = this.circ();
        circ.setPos(x, y);
        circ.setDiam(diam);
        circ.setVel(maxVel, maxVel);
        circ.commit(Infinity);
    }

    public canInteract(other: Component): boolean {
        return other instanceof CElastic || other instanceof CTarget;
    }

    public interactsWithBullets(): boolean { return false; }

    public onCollide(other: Component) {

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


        let otherCE: CSlide
        if (other instanceof CSlide) otherCE = <CSlide>other;
        if (otherCE != null && this.getId() > otherCE.getId()) return;
        let success = this.elasticCollision(other);
        // console.log("碰撞到了,要停下来")
        this.overlaps.push(other);
        this.overlaps1.push(other);
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
    }

    private elasticCollision(other: Component): boolean {
        if (other instanceof CTarget) {
            let normal = other.hitBox.getNormal(this.hitBox);
            let success = this.elasticCollisionNum(normal.getUnitX(), normal.getUnitY(), 0, 0,
                Infinity);
            if (success) ((<CTarget>other).hit());
            return success;
        }
        else if (other instanceof CSlide) {
            let circA = this.circ();
            let circB = other.circ();
            let n = circB.getNormal(circA);
            let v1x = circA.getVelX();
            let v1y = circA.getVelY();
            let v2x = circB.getVelX();
            let v2y = circB.getVelY();
            let result = this.elasticCollisionNum(
                n.getUnitX(), n.getUnitY(), v2x, v2y, Geom.area(circB)) ? 1 : 0;
            let r = (<CSlide>other).elasticCollisionNum(
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