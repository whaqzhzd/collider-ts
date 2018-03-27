var MyColliderListener = /** @class */ (function () {
    function MyColliderListener() {
    }
    MyColliderListener.prototype.collision = function (evt) {
        var compA = evt.getFirst().getOwner();
        var compB = evt.getSecond().getOwner();
        compA.onCollide(compB);
        if (!compA.isDeleted() && !compB.isDeleted())
            compB.onCollide(compA);
    };
    MyColliderListener.prototype.separation = function (evt) {
        var compA = evt.getFirst().getOwner();
        var compB = evt.getSecond().getOwner();
        compA.onSeparate(compB);
        if (!compA.isDeleted() && !compB.isDeleted())
            compB.onSeparate(compA);
    };
    return MyColliderListener;
}());
//# sourceMappingURL=MyColliderListener.js.map