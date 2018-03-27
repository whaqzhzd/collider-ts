class CTarget extends Component {
    private static LIT_TIME = .17;
    private hitTime = Infinity;

    public constructor(hitBox: HBPositioned) {
        super(hitBox);
    }

    public isEnemy() { return false; }
    public hit() {
        this.hitTime = Game.engine.getTime();
    }

    public onCollide(other: Component) { }
    public onSeparate(other: Component) { }
    public canInteract(other: Component) { return false; }
    public interactsWithBullets() { return true; }
}
