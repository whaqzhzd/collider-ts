var HitBox = /** @class */ (function () {
    function HitBox(collider) {
        this.group = -2;
        this.changeId = 0;
        this.testId = -1;
        this.collider = collider;
    }
    HitBox.prototype.init = function () {
        this.startTime = this.collider.getTime();
        this.endTime = this.startTime;
        this.group = -1;
        this.setGroup(0);
    };
    HitBox.prototype.markTransitionStart = function () {
        this.startTime = this.collider.getTime();
        // console.log("更新时间",this)
        if (this.endTime < this.startTime) {
            throw new Error("updating HitBox late");
        }
        this.changeId++;
        this.endTime = -1;
    };
    HitBox.prototype.free = function () {
        this.owner = null;
        this.group = -2;
    };
    HitBox.prototype.isInitialized = function () {
        return this.group != -2;
    };
    HitBox.prototype.testMark = function (testId) {
        if (testId == this.testId)
            return false;
        this.testId = testId;
        return true;
    };
    HitBox.prototype.getChangeId = function () { return this.changeId; };
    HitBox.prototype.interactivityChange = function () { this.collider.altering(this, true); };
    HitBox.prototype.setGroup = function (group) {
        if (group < -1 || group >= HitBox.NUM_GROUPS) {
            throw new Error("invalid group:" + group);
        }
        this.collider.altering(this, true);
        this.group = group;
    };
    HitBox.prototype.commit = function (endTime) {
        var time = this.collider.getTime();
        if (endTime < time)
            throw new Error("endTime already passed");
        this.collider.altering(this);
        this.endTime = endTime;
    };
    HitBox.prototype.setOwner = function (obj) {
        this.owner = obj;
    };
    HitBox.prototype.getGroup = function () {
        return this.group;
    };
    HitBox.prototype.getOwner = function () {
        return this.owner;
    };
    HitBox.prototype.getTime = function () { return this.collider.getTime(); };
    HitBox.prototype.getNormal = function (dest) {
        return this.collider.getNormal(this, dest);
    };
    HitBox.prototype.getOverlap = function (other) {
        return this.collider.getNormal(this, other).overlap;
    };
    HitBox.prototype.overlaps = function (other) {
        return this.collider.getNormal(this, other).overlap > 0.0;
    };
    HitBox.NUM_GROUPS = 256;
    return HitBox;
}());
//# sourceMappingURL=HitBox.js.map