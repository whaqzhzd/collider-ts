
abstract class Component {
    private static NEXT_ID: number = 0;
    private id: number;
    public hitBox: HBPositioned;

    protected constructor(hitBox: HBPositioned) {
        if (hitBox == null) throw new Error();
        this.hitBox = hitBox;
        hitBox.setOwner(this);
        this.id = Component.NEXT_ID++;
        Game.engine.addComp(this);
    }

    protected delete() {
        if (this.hitBox == null) return;
        Game.engine.removeComp(this);
        this.hitBox.free();
        this.hitBox = null;
    }

    protected isInBounds() { return Game.engine.isInBounds(this.hitBox); }
    public isDeleted() { return this.hitBox == null; }
    public getId() { return this.id; }

    public circ() { return <HBCircle>this.hitBox; }
    public rect(): HBRect { return <HBRect>this.hitBox; }
    public isRect() { return this.hitBox instanceof HBRect; }
    public isCirc() { return this.hitBox instanceof HBCircle; }

    public abstract onCollide(other: Component);
    public abstract onSeparate(other: Component);
    public abstract canInteract(other: Component): boolean;
    public abstract interactsWithBullets(): boolean;
    public compareTo(o: Component): number {
        return this.id - o.id;
    }
}
