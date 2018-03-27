var ColliderProcess = /** @class */ (function () {
    function ColliderProcess(collider, listener) {
        if (collider == null || listener == null)
            throw new Error();
        if (collider instanceof ColliderOpts) {
            this.collider = new Collider(collider);
        }
        else {
            this.collider = collider;
        }
        this.listener = listener;
    }
    ColliderProcess.prototype.peekNextEventTime = function () {
        return this.collider.peekNextEventTime();
    };
    ColliderProcess.prototype.stepToTime = function (time) {
        var evt = this.collider.stepToTime(time, false);
        if (evt != null)
            throw new Error();
    };
    ColliderProcess.prototype.resolveEvent = function () {
        var time = this.collider.getTime();
        var evt = this.collider.stepToTime(time);
        if (evt != null) {
            if (evt.isCollision())
                this.listener.collision(evt);
            else if (evt.isSeparation())
                this.listener.separation(evt);
        }
    };
    return ColliderProcess;
}());
//# sourceMappingURL=ColliderProcess.js.map