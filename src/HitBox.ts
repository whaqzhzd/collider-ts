abstract class HitBox {
    public static NUM_GROUPS = 256;

    public startTime: number;
    public endTime: number;
    public collider: Collider;
    public overlapSet: any;

    private group: number = -2;
    private changeId: number = 0;
    private testId: number = -1;
    private owner: any;

    public constructor(collider: Collider) {
        this.collider = collider;
    }

    public init() {
        this.startTime = this.collider.getTime();
        this.endTime = this.startTime;

        this.group = -1;
        this.setGroup(0);
    }

    public markTransitionStart() {
        this.startTime = this.collider.getTime();
        if (this.endTime < this.startTime) {
            throw new Error("updating HitBox late");
        }
        this.changeId++;
        this.endTime = -1;
    }

    public free() {
        this.owner = null;
        this.group = -2;
    }

    public isInitialized(): boolean {
        return this.group != -2;
    }

    public testMark(testId: number): boolean {
        if (testId == this.testId) return false;
        this.testId = testId;
        return true;
    }

    public getChangeId() { return this.changeId; }

    public interactivityChange() { this.collider.altering(this, true); }

    public setGroup(group: number) {
        if (group < -1 || group >= HitBox.NUM_GROUPS) {
            throw new Error("invalid group:" + group);
        }
        this.collider.altering(this, true);
        this.group = group;
    }

    public commit(endTime: number) {
        let time = this.collider.getTime();
        if (endTime < time) throw new Error("endTime already passed");
        this.collider.altering(this);
        this.endTime = endTime;
    }

    public setOwner(obj: any) {
        this.owner = obj;
    }

    public getGroup() {
        return this.group;
    }

    public getOwner() {
        return this.owner;
    }

    public getTime() { return this.collider.getTime(); }

    public getNormal(dest: HitBox): Normal {
        return this.collider.getNormal(this, dest);
    }

    public getOverlap(other: HitBox) {
        return this.collider.getNormal(this, other).overlap;
    }

    public overlaps(other: HitBox): boolean {
        return this.collider.getNormal(this, other).overlap > 0.0;
    }

    abstract isMoving(): boolean;
    abstract getBoundEdgeComp(edge: number, startTime: number, endTime: number): number;
    abstract getMaxBoundEdgeVel(): number;
}
