class MyColliderListener implements ColliderListener {
    public collision(evt: ColliderEvent) {
        let compA = evt.getFirst().getOwner();
        let compB = evt.getSecond().getOwner();
        compA.onCollide(compB);
        if (!compA.isDeleted() && !compB.isDeleted()) compB.onCollide(compA);
    }
    public separation(evt: ColliderEvent) {
        let compA = evt.getFirst().getOwner();
        let compB = evt.getSecond().getOwner();
        compA.onSeparate(compB);
        if (!compA.isDeleted() && !compB.isDeleted()) compB.onSeparate(compA);
    }
}