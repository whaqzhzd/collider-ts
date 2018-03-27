class Field {
    private setPool: Array<HitBox> = new Array<HitBox>();
    public data: {};
    private cellWidth: number;
    private numEntries: number = 0;

    private boxIter = new Iterator();
    private diffIter = new DiffIterator();

    private iter: HitBoxIter = new HitBoxIter();

    public constructor(opts: ColliderOpts) {
        if (opts.cellWidth <= 0.0) throw new Error();
        this.cellWidth = opts.cellWidth;
        this.data = {};
    }

    public getIndexBounds(hitBox: HitBox, bounds: IntBox): void {
        bounds.l = Arith.floor(-hitBox.getBoundEdgeComp(Dir.L, hitBox.startTime, hitBox.endTime) / this.cellWidth);
        bounds.b = Arith.floor(-hitBox.getBoundEdgeComp(Dir.D, hitBox.startTime, hitBox.endTime) / this.cellWidth);
        bounds.r = Arith.max(bounds.l, Arith.ceil(hitBox.getBoundEdgeComp(Dir.R, hitBox.startTime, hitBox.endTime) / this.cellWidth) - 1);
        bounds.t = Arith.max(bounds.b, Arith.ceil(hitBox.getBoundEdgeComp(Dir.U, hitBox.startTime, hitBox.endTime) / this.cellWidth) - 1);
    }

    public iteratorThree(region: IntBox, groups: number[], testId: number): HitBoxIter {
        this.iter.init(region, groups, testId, this);
        return this.iter;
    }

    public getGridPeriod(hitBox: HitBox): number {
        let speed = hitBox.getMaxBoundEdgeVel();
        if (speed <= 0.0) return Infinity;
        else return this.cellWidth / speed;
    }

    public getNumEntries() { return this.numEntries; }

    public remove(hitBox: HitBox, group: number, oldBox: IntBox, newBox: IntBox) {
        if (group < 0) return;
        let iter: Int2DIterator = this.iterator(oldBox, newBox);
        for (; !iter.isDone(); iter.next()) {
            this.removeFromCell(hitBox, iter.getX(), iter.getY(), group);
        }
    }

    private static PRIME = 160481219;
    private static SMALL_PRIME = 263;
    private static MAX_INDEX: number = Math.floor(Field.PRIME / 2 - 1);
    public static getKey(x: number, y: number, group: number) {
        if (x > Field.MAX_INDEX || x < -Field.MAX_INDEX) throw new Error();
        if (y > Field.MAX_INDEX || y < -Field.MAX_INDEX) throw new Error();
        if (group >= Field.SMALL_PRIME || group < 0) throw new Error();
        return group + (Field.SMALL_PRIME * x + Field.PRIME * y);
    }

    private removeFromCell(hitBox: HitBox, x: number, y: number, group: number) {
        let key = Field.getKey(x, y, group);
        let oldSetObj = this.data[key];

        let res = ArrayUtil.remove(oldSetObj, hitBox);
        let newSetObj = res.arr;
        if (!res.flag) throw new Error();
        if (newSetObj == null) delete this.data[key];
        else if (newSetObj != oldSetObj) this.data[key] = newSetObj;
        this.numEntries--;
    }

    public add(hitBox: HitBox, group: number, oldBox: IntBox, newBox: IntBox) {
        if (group < 0) return;
        let iter = this.iterator(newBox, oldBox);
        for (; !iter.isDone(); iter.next()) {
            this.addToCell(hitBox, iter.getX(), iter.getY(), group);
        }
    }

    private addToCell(hitBox: HitBox, x: number, y: number, group: number): void {
        let key = Field.getKey(x, y, group);
        let oldSetObj = this.data[key];
        let res = ArrayUtil.add(oldSetObj, hitBox);
        let newSetObj = res.arr;
        if (!res.flag) throw new Error();
        if (newSetObj != oldSetObj) this.data[key] = newSetObj;
        this.numEntries++;
    }

    private iterator(box: IntBox, subBox: IntBox): Int2DIterator {
        if (subBox == null) {
            this.boxIter.init(box);
            return this.boxIter;
        }
        else {
            this.diffIter.init(box, subBox);
            return this.diffIter;
        }
    }
}