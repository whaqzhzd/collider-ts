var Component = /** @class */ (function () {
    function Component(hitBox) {
        if (hitBox == null)
            throw new Error();
        this.hitBox = hitBox;
        hitBox.setOwner(this);
        this.id = Component.NEXT_ID++;
        Game.engine.addComp(this);
    }
    Component.prototype.delete = function () {
        if (this.hitBox == null)
            return;
        Game.engine.removeComp(this);
        this.hitBox.free();
        this.hitBox = null;
    };
    Component.prototype.isInBounds = function () { return Game.engine.isInBounds(this.hitBox); };
    Component.prototype.isDeleted = function () { return this.hitBox == null; };
    Component.prototype.getId = function () { return this.id; };
    Component.prototype.circ = function () { return this.hitBox; };
    Component.prototype.rect = function () { return this.hitBox; };
    Component.prototype.isRect = function () { return this.hitBox instanceof HBRect; };
    Component.prototype.isCirc = function () { return this.hitBox instanceof HBCircle; };
    Component.prototype.compareTo = function (o) {
        return this.id - o.id;
    };
    Component.NEXT_ID = 0;
    return Component;
}());
//# sourceMappingURL=Component.js.map