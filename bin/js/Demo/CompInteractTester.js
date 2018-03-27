var CompInteractTester = /** @class */ (function () {
    function CompInteractTester() {
    }
    CompInteractTester.prototype.canInteract = function (a, b) {
        var compA = a.getOwner();
        var compB = b.getOwner();
        return compA.canInteract(compB) || compB.canInteract(compA);
    };
    CompInteractTester.prototype.getInteractGroups = function (hitBox) {
        if ((hitBox.getOwner()).interactsWithBullets())
            return GameEngine.ALL_GROUPS_ARR;
        return GameEngine.NORMAL_GROUP_ARR;
    };
    return CompInteractTester;
}());
//# sourceMappingURL=CompInteractTester.js.map