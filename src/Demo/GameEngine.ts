class GameEngine {
	public static SCREEN_WIDTH = 1280;
	public static SCREEN_HEIGHT = 720;
	public static GROUP_NORMAL = 0;
	public static GROUP_BULLET = 1;
	public static ALL_GROUPS_ARR: number[] = [GameEngine.GROUP_NORMAL, GameEngine.GROUP_BULLET];
	public static NORMAL_GROUP_ARR = [GameEngine.GROUP_NORMAL];

	public processes: ContProcesses;
	private collider: Collider;
	private comps: Array<Component> = new Array<Component>();
	public events: TreeSet<FunctionEventt> = new TreeSet<FunctionEventt>();
	private bounds: CBounds;

	public constructor() {
		this.clear();
	}

	public clear() {
		this.processes = new ContProcesses();

		let opts = new ColliderOpts();
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
	}

	public makeRect(): HBRect { return this.collider.makeRect(); }
	public makeCircle(): HBCircle { return this.collider.makeCircle(); }

	public addEvent(event: FunctionEventt) {
		this.events.add(event);
	}

	public addComp(comp: Component): void {
		let success = this.comps.push(comp);
		if (!success) throw new Error();
		if (comp instanceof CBounds) {
			if (this.bounds != null) throw new Error();
			this.bounds = comp;
		}
	}

	public removeComp(comp: Component): void {
		let index = this.comps.indexOf(comp);
		let success = false;
		if (index != -1) {

			success = true;
			this.comps.splice(index, 1);
		}

		if (!success) throw new Error();
		if (this.bounds == comp) this.bounds = null;
	}

	public isInBounds(hitBox: HitBox): boolean {
		return hitBox.getOverlap(this.bounds.hitBox) >= .1;
	}

	public stepToTime(time: number): void {
		if (time < this.getTime()) return;
		this.processes.stepToTime(time);
	}

	public getTime(): number {
		return this.processes.getTime();
	}

	public update(): void {

		Laya.stage.graphics.clear();

		let comps = this.comps;

		for (let i = 0, l = comps.length; i < l; i++) {
			let hitbox = comps[i];

			if (hitbox.isRect()) {
				let rect = hitbox.rect();
				let l = rect.getX() - .5 * rect.getWidth();
				let b = rect.getY() - .5 * rect.getHeight();
				Laya.stage.graphics.drawRect(l, b,
					rect.getWidth(), rect.getHeight(), null, "#FFFFFF");
			}
			else {
				let circle = hitbox.circ();
				Laya.stage.graphics.drawCircle(circle.getX(), circle.getY(),
					.5 * circle.getDiam(), null, "#FFFFFF");
			}
		}
	}
}