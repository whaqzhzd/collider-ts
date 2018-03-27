class CBounds extends Component {
    public static PAD = 80;

    public constructor() {
        super(Game.engine.makeRect());
        let rect = this.rect();
        rect.setPos(.5 * GameEngine.SCREEN_WIDTH, .5 * GameEngine.SCREEN_HEIGHT);
        rect.setDims(GameEngine.SCREEN_WIDTH + 2 * CBounds.PAD, GameEngine.SCREEN_HEIGHT + 2 * CBounds.PAD);
        rect.commit(Infinity);
    }

    public onCollide(other: Component) { }
    public onSeparate(other: Component) { }
    public canInteract(other: Component) { return false; }
    public interactsWithBullets() { return true; }
}
