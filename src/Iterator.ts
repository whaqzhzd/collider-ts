class Iterator implements Int2DIterator {
    private x: number;
    private y: number;
    public l: number = -1;
    public r: number = -1;
    public t: number = -1;

    public constructor(box?: IntBox) {
        box && this.init(box);
    }

    public init(box: IntBox): void {
        let b;
        if (box == null) { this.l = 0; this.r = 0; b = 0; this.t = -1; }
        else { this.l = box.l; this.r = box.r; b = box.b; this.t = box.t; }
        if (this.r < this.l) this.t = b - 1;
        this.x = this.l;
        this.y = b;
    }

    public isDone(): boolean {
        return this.y > this.t;
    }

    public next(): void {
        this.x++;
        if (this.x > this.r) {
            this.x = this.l;
            this.y++;
        }
    }

    public getX(): number { return this.x; }
    public getY(): number { return this.y; }
}
