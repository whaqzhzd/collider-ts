class DiffIterator implements Int2DIterator {
    private x: number; private y: number;
    private l: number = -1; private r: number = -1; private t: number = -1;
    private sl: number; private sb: number; private sr: number; private st: number;

    public constructor(box?: IntBox, subBox?: IntBox) {
        box && subBox && this.init(box, subBox);
    }

    public init(box: IntBox, subBox: IntBox): void {
        let b;
        if (box == null) { this.l = 0; this.r = 0; b = 0; this.t = -1; }
        else { this.l = box.l; this.r = box.r; b = box.b; this.t = box.t; }
        if (this.r < this.l) this.t = b - 1;
        if (subBox == null) { this.sl = 0; this.sr = 0; this.sb = 0; this.st = -1; }
        else { this.sl = subBox.l; this.sr = subBox.r; this.sb = subBox.b; this.st = subBox.t; }
        this.x = this.l - 1;
        this.y = b;
        this.next();
    }

    public isDone(): boolean {
        return this.y > this.t;
    }
    public next(): void {
        //x坐标迭代++
        this.x++;
        //如果x坐标大于右边界
        if (this.x > this.r) {
            //设置x坐标为左边界
            this.x = this.l;
            //y坐标迭代++
            this.y++;
        }
        //如果y坐标小于
        if (this.y < this.sb || this.y > this.st || this.x < this.sl || this.x > this.sr) return;
        if (this.sr >= this.r) {
            if (this.sl <= this.l) this.y = this.st + 1;
            else {
                this.x = this.l;
                this.y++;
            }
        }
        else {
            this.x = this.sr + 1;
        }
    }
    public getX(): number {
        return this.x;
    }
    public getY(): number {
        return this.y;
    }
}