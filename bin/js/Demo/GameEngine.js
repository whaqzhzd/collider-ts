var GameEngine = /** @class */ (function () {
    function GameEngine() {
        this.comps = new Array();
        this.events = new TreeSet();
        this.clear();
    }
    GameEngine.prototype.clear = function () {
        this.processes = new ContProcesses();
        var opts = new ColliderOpts();
        opts.cellWidth = 22.0;
        opts.separateBuffer = .1;
        opts.maxForesightTime = 2.0;
        opts.interactTester = new CompInteractTester();
        this.collider = new Collider(opts);
        this.comps.length = 0;
        this.events.clear();
        this.bounds = null;
        this.processes.addProcess(new ColliderProcess(this.collider, new MyColliderListener()));
        this.processes.addProcess(new EventProcess(this));
    };
    GameEngine.prototype.makeRect = function () { return this.collider.makeRect(); };
    GameEngine.prototype.makeCircle = function () { return this.collider.makeCircle(); };
    GameEngine.prototype.addEvent = function (event) {
        this.events.add(event);
    };
    GameEngine.prototype.addComp = function (comp) {
        var success = this.comps.push(comp);
        if (!success)
            throw new Error();
        if (comp instanceof CBounds) {
            if (this.bounds != null)
                throw new Error();
            this.bounds = comp;
        }
    };
    GameEngine.prototype.removeComp = function (comp) {
        var index = this.comps.indexOf(comp);
        var success = false;
        if (index != -1) {
            success = true;
            this.comps.splice(index, 1);
        }
        if (!success)
            throw new Error();
        if (this.bounds == comp)
            this.bounds = null;
    };
    GameEngine.prototype.isInBounds = function (hitBox) {
        return hitBox.getOverlap(this.bounds.hitBox) >= .1;
    };
    GameEngine.prototype.stepToTime = function (time) {
        if (time < this.getTime())
            return;
        this.processes.stepToTime(time);
    };
    GameEngine.prototype.getTime = function () {
        return this.processes.getTime();
    };
    GameEngine.prototype.update = function () {
        Laya.stage.graphics.clear();
        var comps = this.comps;
        for (var i = 0, l = comps.length; i < l; i++) {
            var hitbox = comps[i];
            if (hitbox.isRect()) {
                var rect = hitbox.rect();
                var l_1 = rect.getX() - .5 * rect.getWidth();
                var b = rect.getY() - .5 * rect.getHeight();
                Laya.stage.graphics.drawRect(l_1, b, rect.getWidth(), rect.getHeight(), null, "#FFFFFF");
            }
            else {
                var circle = hitbox.circ();
                Laya.stage.graphics.drawCircle(circle.getX(), circle.getY(), .5 * circle.getDiam(), null, "#FFFFFF");
            }
        }
    };
    GameEngine.SCREEN_WIDTH = 1280;
    GameEngine.SCREEN_HEIGHT = 720;
    GameEngine.GROUP_NORMAL = 0;
    GameEngine.GROUP_BULLET = 1;
    GameEngine.ALL_GROUPS_ARR = [GameEngine.GROUP_NORMAL, GameEngine.GROUP_BULLET];
    GameEngine.NORMAL_GROUP_ARR = [GameEngine.GROUP_NORMAL];
    return GameEngine;
}());
//# sourceMappingURL=GameEngine.js.map