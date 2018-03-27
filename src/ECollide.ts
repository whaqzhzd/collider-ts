class ECollide extends FunctionEventt {
    private a: HitBox;
    private b: HitBox;
    private idA: number;
    private idB: number;
    private collided: boolean;

    public init(a: HitBox, b: HitBox, time: number, collided: boolean) {
        this.a = a;
        this.b = b;
        this.idA = a.getChangeId();
        this.idB = b.getChangeId();
        this.time = time;
        this.collided = collided;
    }

    public resolve(collider: Collider) {
        if (this.a.getChangeId() == this.idA && this.b.getChangeId() == this.idB) {
            collider.setCollision(this.a, this.b, this.collided);
        }
        this.a = null;
        this.b = null;
        collider.freeEvent(this);
    }
}
