class EReiterate extends FunctionEventt {
    private hitBox: HitBox;
    private period: number;
    private endTime: number;
    private changeId: number;

    public init(hitBox: HitBox, startTime: number, endTime: number, period: number) {
        if (startTime >= endTime) throw new Error();
        this.hitBox = hitBox;
        this.time = startTime;
        this.endTime = endTime;
        this.period = period;
        this.changeId = hitBox.getChangeId();
    }

    public resolve(collider: Collider) {
        if (this.changeId == this.hitBox.getChangeId()) {
            let stepEndTime = collider.getTime() + this.period;
            if (this.endTime <= stepEndTime) {
                this.hitBox.commit(this.endTime);
            }
            else {
                this.hitBox.commit(stepEndTime);
                collider.processCurHBAndCollision(false);
                this.changeId = this.hitBox.getChangeId();
                this.time = stepEndTime;
                collider.queueFunc(this);
                return;
            }
        }
        this.hitBox = null;
        collider.freeEvent(this);
    }
}
