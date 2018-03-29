class Collider {
    private field: Field;
    private time: number = 0.0;
    private collisionTester: CollisionTester;
    private interactTester: InteractTester;
    private maxForesightTime: number;
    private queue: TreeSet<FunctionEventt> = new TreeSet<FunctionEventt>((a: FunctionEventt, b: FunctionEventt) => {
        return a.compareTo(b);
    });
    private cEvent: ColliderEvent = new ColliderEvent();
    private processedCollision: boolean = true;
    private curHitBox: HitBox;
    private oldBounds: IntBox = new IntBox();
    private newBounds: IntBox = new IntBox();
    private oldGroup: number;
    private nextEventId: number = 0;
    private changeInteractivity: boolean = false;
    private hitBoxRemoveBuffer: Array<HitBox> = new Array<HitBox>();
    private testId: number = 0;
    public hitBoxesInUse: number = 0;
    private numOverlaps: number = 0;
    private i: number = 0;
    private rectPool: HitBoxPool<HBRect> = new HitBoxPool<HBRect>(() => {
        return new HBRect(this);
    });
    private circlePool: HitBoxPool<HBCircle> = new HitBoxPool<HBCircle>(() => {
        return new HBCircle(this);
    });
    private reiteratePool: HitBoxPool<EReiterate> = new HitBoxPool<EReiterate>(() => {
        return new EReiterate();
    });
    private collidePool: Pool<ECollide> = new Pool<ECollide>(() => {
        return new ECollide();
    });
    private overlapSetPool: Array<HitBox> = new Array<HitBox>();

    public constructor(opts: ColliderOpts) {
        if (opts.interactTester == null) throw new Error();
        if (opts.maxForesightTime <= 0.0) throw new Error();
        this.field = new Field(opts);
        this.collisionTester = new CollisionTester(opts);
        this.interactTester = opts.interactTester;
        this.maxForesightTime = opts.maxForesightTime;
    }

    public makeRect(): HBRect {
        let hitBox = this.rectPool.obtain();
        hitBox.init();
        return hitBox;
    }

    public makeCircle(): HBCircle {
        let hitBox = this.circlePool.obtain();
        hitBox.init();
        return hitBox;
    }

    public stepToTime(newTime: number, inclusive: boolean = true): ColliderEvent {
        if (newTime < this.time) throw new Error();
        this.processCurHBAndCollision();
        this.cEvent.clear();

        for (let evt: FunctionEventt = this.queue.first();
            evt != null && (inclusive ? evt.time <= newTime : evt.time < newTime);
            evt = this.queue.first()) {
            this.queue.pollFirst();
            this.time = evt.time;
            evt.resolve(this);
            if (this.cEvent.isInitialized()) return this.cEvent;
            this.processCurHBAndCollision();
        }
        this.time = newTime;
        return null;
    }

    public getTime(): number {
        return this.time;
    }

    public peekNextEventTime(): number {
        this.processCurHBAndCollision();
        let evt = this.queue.first();
        if (evt == null) return Infinity;
        else return evt.time;
    }

    public getNormal(source: HitBox, dest: HitBox): Normal {
        return this.collisionTester.normalFunc(source, dest, this.time);
    }

    public free(hitBox: HBRect | HBCircle) {
        this.removeHitBoxReferences(hitBox);
        if (hitBox instanceof HBRect)
            this.rectPool.free(hitBox);
        else
            this.circlePool.free(hitBox);
    }

    private removeHitBoxReferences(hitBox: HitBox): void {
        if (!this.processedCollision && this.cEvent.involves(hitBox)) {
            this.cEvent.clear();
            this.processedCollision = true;
        }
        this.altering(hitBox);
        this.field.remove(hitBox, this.oldGroup, this.oldBounds, null);
        let overlapSet = [].concat(hitBox.overlapSet);
        for (let i = 0, l = overlapSet.length; i < l; i++) {
            let b = overlapSet[i];
            let res = ArrayUtil.remove(b.overlapSet, hitBox);
            b.overlapSe = res.arr;
            if (!res.flag) {
                throw new Error();
            }
            this.numOverlaps--;
        }
        hitBox.overlapSet = null;
        this.curHitBox = null;
    }

    public altering(hitBox: HitBox, changeInteractivity: boolean = false) {
        if (!hitBox.isInitialized()) throw new Error("cannot alter hitBox after freed");
        if (this.curHitBox == hitBox) {
            hitBox.endTime = -1;
            if (changeInteractivity) this.changeInteractivity = true;
            return;
        }
        if (this.curHitBox != null) this.processCurHBAndCollision();
        this.curHitBox = hitBox;
        this.changeInteractivity = changeInteractivity;
        this.field.getIndexBounds(hitBox, this.oldBounds);
        this.oldGroup = hitBox.getGroup();
        hitBox.markTransitionStart();
    }

    public queueFunc(event: FunctionEventt) {
        event.id = this.nextEventId;
        this.nextEventId++;
        this.queue.add(event);
    }

    public freeEvent(evt: EReiterate | ECollide) {
        if (evt instanceof ECollide) {
            this.collidePool.free(evt);
        } else {
            this.reiteratePool.free(evt);
        }
    }

    public processCurHBAndCollision(checkReiterate: boolean = true) {
        this.processCollision();
        if (this.curHitBox == null) return;
        if (this.curHitBox.endTime < this.time) throw new Error("HitBox altered but HitBox.commit was not called");
        this.testId++;
        if (checkReiterate) this.checkForReiteration();
        let newGroup = this.curHitBox.getGroup();
        if (newGroup != this.oldGroup && !this.changeInteractivity) throw new Error();

        let overlapSet = [].concat(this.curHitBox.overlapSet);
        for (let i = 0, l = overlapSet.length; i < l; i++) {
            let b = overlapSet[i];
            if (!b) continue;
            if (!b.testMark(this.testId)) throw new Error();
            if (newGroup < 0 || (this.changeInteractivity && !this.interactTester.canInteract(this.curHitBox, b))) {
                this.hitBoxRemoveBuffer.push(b);
            }
            else {
                this.checkForSeparation(this.curHitBox, b);
            }
        }

        let hitBoxRemoveBuffer = this.hitBoxRemoveBuffer;
        for (let j = 0, len = hitBoxRemoveBuffer.length; j < len; j++) {
            let b = hitBoxRemoveBuffer[j];
            let res = ArrayUtil.remove(this.curHitBox.overlapSet, b);
            this.curHitBox.overlapSet = res.arr;
            if (!res.flag) throw new Error();
            let res2 = ArrayUtil.remove(b.overlapSet, this.curHitBox);
            b.overlapSet = res2.arr;
            if (!res2.flag) throw new Error();
            this.numOverlaps--;
        }

        this.hitBoxRemoveBuffer.length = 0;
        this.field.getIndexBounds(this.curHitBox, this.newBounds);
        if (this.oldGroup == newGroup) this.field.remove(this.curHitBox, this.oldGroup, this.oldBounds, this.newBounds);
        else this.field.remove(this.curHitBox, this.oldGroup, this.oldBounds, null);

        let groupArr = null;
        if (newGroup >= 0) groupArr = this.interactTester.getInteractGroups(this.curHitBox);
        this.curHitBox.testMark(this.testId);
        this.i = 0;
        let oldHitbox;
        if (groupArr != null && groupArr.length > 0) {
            let iterator = this.field.iteratorThree(this.newBounds, groupArr, this.testId)
            while (iterator.hasNext()) {
                let otherHitbox = iterator.nextFunc();

                if (this.interactTester.canInteract(this.curHitBox, otherHitbox)) {
                    this.checkForCollision(this.curHitBox, otherHitbox);
                }
            }
        }

        if (this.oldGroup == newGroup) this.field.add(this.curHitBox, newGroup, this.oldBounds, this.newBounds);
        else this.field.add(this.curHitBox, newGroup, null, this.newBounds);
        this.curHitBox = null;
        this.changeInteractivity = false;
    }

    private processCollision(): void {
        if (this.processedCollision) return;
        this.processedCollision = true;
        let a = this.cEvent.getFirst();
        let b = this.cEvent.getSecond();
        if (this.cEvent.isCollision()) {
            if (this.interactTester.canInteract(a, b)) {
                let res = ArrayUtil.add(a.overlapSet, b);
                a.overlapSet = res.arr;
                if (!res.flag) throw new Error();

                let res2 = ArrayUtil.add(b.overlapSet, a);
                b.overlapSet = res2.arr;
                if (!res2.flag) throw new Error();
                this.numOverlaps++;
                if (!this.cEvent.involves(this.curHitBox)) this.checkForSeparation(a, b);
            }
        }
        else {
            let res = ArrayUtil.remove(a.overlapSet, b);
            a.overlapSet = res.arr;
            if (!res.flag) throw new Error();

            let res2 = ArrayUtil.remove(b.overlapSet, a);
            b.overlapSet = res2.arr;
            if (!res2.flag) throw new Error();

            this.numOverlaps--;
            if (!this.cEvent.involves(this.curHitBox) && this.interactTester.canInteract(a, b)) {
                this.checkForCollision(a, b);
            }
        }
    }

    public setCollision(a: HitBox, b: HitBox, collided: boolean) {
        this.cEvent.init(a, b, collided);
        this.processedCollision = false;
    }

    private checkForReiteration(): void {
        if (!this.curHitBox.isMoving()) return;
        let period = this.field.getGridPeriod(this.curHitBox);
        if (period > this.maxForesightTime) period = this.maxForesightTime;
        let firstReiterTime = this.time + period;
        if (firstReiterTime >= this.curHitBox.endTime) return;
        let event = this.reiteratePool.obtain();
        event.init(this.curHitBox, firstReiterTime, this.curHitBox.endTime, period);
        this.curHitBox.endTime = firstReiterTime;
        this.queueFunc(event);
    }

    private checkForCollision(a: HitBox, b: HitBox) {
        let collideTime = this.collisionTester.collideTime(a, b, this.time);
        if (collideTime < Infinity) {
            console.log("碰撞到了")
            let event = this.collidePool.obtain();
            event.init(a, b, collideTime, true);
            this.queueFunc(event);
        }
    }

    private checkForSeparation(a: HitBox, b: HitBox) {
        let collideTime = this.collisionTester.separateTime(a, b, this.time);
        if (collideTime < Infinity) {
            let event = this.collidePool.obtain();
            event.init(a, b, collideTime, false);
            this.queueFunc(event);
        }
    }
}