var Collider = /** @class */ (function () {
    function Collider(opts) {
        var _this = this;
        this.time = 0.0;
        this.queue = new TreeSet(function (a, b) {
            return a.compareTo(b);
        });
        this.cEvent = new ColliderEvent();
        this.processedCollision = true;
        this.oldBounds = new IntBox();
        this.newBounds = new IntBox();
        this.nextEventId = 0;
        this.changeInteractivity = false;
        this.hitBoxRemoveBuffer = new Array();
        this.testId = 0;
        this.hitBoxesInUse = 0;
        this.numOverlaps = 0;
        this.i = 0;
        this.rectPool = new HitBoxPool(function () {
            return new HBRect(_this);
        });
        this.circlePool = new HitBoxPool(function () {
            return new HBCircle(_this);
        });
        this.reiteratePool = new HitBoxPool(function () {
            return new EReiterate();
        });
        this.collidePool = new Pool(function () {
            return new ECollide();
        });
        this.overlapSetPool = new Array();
        if (opts.interactTester == null)
            throw new Error();
        if (opts.maxForesightTime <= 0.0)
            throw new Error();
        this.field = new Field(opts);
        this.collisionTester = new CollisionTester(opts);
        this.interactTester = opts.interactTester;
        this.maxForesightTime = opts.maxForesightTime;
    }
    Collider.prototype.makeRect = function () {
        var hitBox = this.rectPool.obtain();
        hitBox.init();
        return hitBox;
    };
    Collider.prototype.makeCircle = function () {
        var hitBox = this.circlePool.obtain();
        hitBox.init();
        return hitBox;
    };
    Collider.prototype.stepToTime = function (newTime, inclusive) {
        if (inclusive === void 0) { inclusive = true; }
        if (newTime < this.time)
            throw new Error();
        this.processCurHBAndCollision();
        this.cEvent.clear();
        for (var evt = this.queue.first(); evt != null && (inclusive ? evt.time <= newTime : evt.time < newTime); evt = this.queue.first()) {
            this.queue.pollFirst();
            this.time = evt.time;
            // console.log("设置新的collider时间",evt);
            evt.resolve(this);
            if (this.cEvent.isInitialized())
                return this.cEvent;
            this.processCurHBAndCollision();
        }
        // console.log("设置新的collider时间",newTime);
        this.time = newTime;
        return null;
    };
    Collider.prototype.getTime = function () {
        return this.time;
    };
    Collider.prototype.peekNextEventTime = function () {
        this.processCurHBAndCollision();
        var evt = this.queue.first();
        if (evt == null)
            return Infinity;
        else
            return evt.time;
    };
    Collider.prototype.getNormal = function (source, dest) {
        return this.collisionTester.normalFunc(source, dest, this.time);
    };
    Collider.prototype.free = function (hitBox) {
        this.removeHitBoxReferences(hitBox);
        if (hitBox instanceof HBRect)
            this.rectPool.free(hitBox);
        else
            this.circlePool.free(hitBox);
    };
    Collider.prototype.removeHitBoxReferences = function (hitBox) {
        if (!this.processedCollision && this.cEvent.involves(hitBox)) {
            this.cEvent.clear();
            this.processedCollision = true;
        }
        this.altering(hitBox);
        this.field.remove(hitBox, this.oldGroup, this.oldBounds, null);
        var overlapSet = [].concat(hitBox.overlapSet);
        for (var i = 0, l = overlapSet.length; i < l; i++) {
            var b = overlapSet[i];
            var res = ArrayUtil.remove(b.overlapSet, hitBox);
            b.overlapSe = res.arr;
            if (!res.flag) {
                throw new Error();
            }
            this.numOverlaps--;
        }
        hitBox.overlapSet = null;
        this.curHitBox = null;
    };
    Collider.prototype.altering = function (hitBox, changeInteractivity) {
        if (changeInteractivity === void 0) { changeInteractivity = false; }
        if (!hitBox.isInitialized())
            throw new Error("cannot alter hitBox after freed");
        if (this.curHitBox == hitBox) {
            hitBox.endTime = -1;
            if (changeInteractivity)
                this.changeInteractivity = true;
            return;
        }
        if (this.curHitBox != null)
            this.processCurHBAndCollision();
        this.curHitBox = hitBox;
        this.changeInteractivity = changeInteractivity;
        this.field.getIndexBounds(hitBox, this.oldBounds);
        this.oldGroup = hitBox.getGroup();
        this.curHitBox.markTransitionStart();
    };
    Collider.prototype.queueFunc = function (event) {
        event.id = this.nextEventId;
        this.nextEventId++;
        this.queue.add(event);
    };
    Collider.prototype.freeEvent = function (evt) {
        if (evt instanceof ECollide) {
            this.collidePool.free(evt);
        }
        else {
            this.reiteratePool.free(evt);
        }
    };
    Collider.prototype.processCurHBAndCollision = function (checkReiterate) {
        if (checkReiterate === void 0) { checkReiterate = true; }
        this.processCollision();
        if (this.curHitBox == null)
            return;
        if (this.curHitBox.endTime < this.time)
            throw new Error("HitBox altered but HitBox.commit was not called");
        this.testId++;
        if (checkReiterate)
            this.checkForReiteration();
        var newGroup = this.curHitBox.getGroup();
        if (newGroup != this.oldGroup && !this.changeInteractivity)
            throw new Error();
        var overlapSet = [].concat(this.curHitBox.overlapSet);
        for (var i = 0, l = overlapSet.length; i < l; i++) {
            var b = overlapSet[i];
            if (!b)
                continue;
            if (!b.testMark(this.testId))
                throw new Error();
            if (newGroup < 0 || (this.changeInteractivity && !this.interactTester.canInteract(this.curHitBox, b))) {
                this.hitBoxRemoveBuffer.push(b);
            }
            else {
                this.checkForSeparation(this.curHitBox, b);
            }
        }
        var hitBoxRemoveBuffer = this.hitBoxRemoveBuffer;
        for (var j = 0, len = hitBoxRemoveBuffer.length; j < len; j++) {
            var b = hitBoxRemoveBuffer[j];
            var res = ArrayUtil.remove(this.curHitBox.overlapSet, b);
            this.curHitBox.overlapSet = res.arr;
            if (!res.flag)
                throw new Error();
            var res2 = ArrayUtil.remove(b.overlapSet, this.curHitBox);
            b.overlapSet = res2.arr;
            if (!res2.flag)
                throw new Error();
            this.numOverlaps--;
        }
        this.hitBoxRemoveBuffer.length = 0;
        this.field.getIndexBounds(this.curHitBox, this.newBounds);
        if (this.oldGroup == newGroup)
            this.field.remove(this.curHitBox, this.oldGroup, this.oldBounds, this.newBounds);
        else
            this.field.remove(this.curHitBox, this.oldGroup, this.oldBounds, null);
        var groupArr = null;
        if (newGroup >= 0)
            groupArr = this.interactTester.getInteractGroups(this.curHitBox);
        this.curHitBox.testMark(this.testId);
        this.i = 0;
        var oldHitbox;
        if (groupArr != null && groupArr.length > 0) {
            var iterator = this.field.iteratorThree(this.newBounds, groupArr, this.testId);
            while (iterator.hasNext()) {
                var otherHitbox = iterator.nextFunc();
                if (this.interactTester.canInteract(this.curHitBox, otherHitbox)) {
                    this.checkForCollision(this.curHitBox, otherHitbox);
                }
            }
        }
        if (this.oldGroup == newGroup)
            this.field.add(this.curHitBox, newGroup, this.oldBounds, this.newBounds);
        else
            this.field.add(this.curHitBox, newGroup, null, this.newBounds);
        this.curHitBox = null;
        this.changeInteractivity = false;
    };
    Collider.prototype.processCollision = function () {
        if (this.processedCollision)
            return;
        this.processedCollision = true;
        var a = this.cEvent.getFirst();
        var b = this.cEvent.getSecond();
        if (this.cEvent.isCollision()) {
            if (this.interactTester.canInteract(a, b)) {
                var res = ArrayUtil.add(a.overlapSet, b);
                a.overlapSet = res.arr;
                if (!res.flag)
                    throw new Error();
                var res2 = ArrayUtil.add(b.overlapSet, a);
                b.overlapSet = res2.arr;
                if (!res2.flag)
                    throw new Error();
                this.numOverlaps++;
                if (!this.cEvent.involves(this.curHitBox))
                    this.checkForSeparation(a, b);
            }
        }
        else {
            var res = ArrayUtil.remove(a.overlapSet, b);
            a.overlapSet = res.arr;
            if (!res.flag)
                throw new Error();
            var res2 = ArrayUtil.remove(b.overlapSet, a);
            b.overlapSet = res2.arr;
            if (!res2.flag)
                throw new Error();
            this.numOverlaps--;
            if (!this.cEvent.involves(this.curHitBox) && this.interactTester.canInteract(a, b)) {
                this.checkForCollision(a, b);
            }
        }
    };
    Collider.prototype.setCollision = function (a, b, collided) {
        this.cEvent.init(a, b, collided);
        this.processedCollision = false;
    };
    Collider.prototype.checkForReiteration = function () {
        if (!this.curHitBox.isMoving())
            return;
        var period = this.field.getGridPeriod(this.curHitBox);
        if (period > this.maxForesightTime)
            period = this.maxForesightTime;
        var firstReiterTime = this.time + period;
        if (firstReiterTime >= this.curHitBox.endTime)
            return;
        var event = this.reiteratePool.obtain();
        event.init(this.curHitBox, firstReiterTime, this.curHitBox.endTime, period);
        this.curHitBox.endTime = firstReiterTime;
        this.queueFunc(event);
    };
    Collider.prototype.checkForCollision = function (a, b) {
        var collideTime = this.collisionTester.collideTime(a, b, this.time);
        if (collideTime < Infinity) {
            // console.log("碰撞到了")
            var event_1 = this.collidePool.obtain();
            event_1.init(a, b, collideTime, true);
            this.queueFunc(event_1);
        }
    };
    Collider.prototype.checkForSeparation = function (a, b) {
        var collideTime = this.collisionTester.separateTime(a, b, this.time);
        if (collideTime < Infinity) {
            var event_2 = this.collidePool.obtain();
            event_2.init(a, b, collideTime, false);
            this.queueFunc(event_2);
        }
    };
    return Collider;
}());
//# sourceMappingURL=Collider.js.map