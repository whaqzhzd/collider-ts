class CompInteractTester implements InteractTester {
    public canInteract(a: HitBox, b: HitBox): boolean {
        let compA = a.getOwner();
        let compB = b.getOwner();
        return compA.canInteract(compB) || compB.canInteract(compA);
    }

    public getInteractGroups(hitBox:HitBox):number[] {
        if ((hitBox.getOwner()).interactsWithBullets()) return GameEngine.ALL_GROUPS_ARR;
        return GameEngine.NORMAL_GROUP_ARR;
    }
}