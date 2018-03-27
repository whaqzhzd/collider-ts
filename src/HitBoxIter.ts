class HitBoxIter {
    private field: Field;
    private boxIter = new Iterator();
    private cellIter: Array<HitBox> = new Array<HitBox>();
    private groups: Array<number>;
    private groupIndex: number;
    private next: HitBox;
    private testId: number = 0;
    private i:number = 0;

    public init(region: IntBox, groups: number[], testId: number, field: Field) {
        this.clear();
        if (groups.length == 0) return;
        this.boxIter.init(region);
        if (this.boxIter.isDone()) return;

        this.field = field;
        this.testId = testId;
        this.groups = groups;
        this.initCellIter();
        this.searchNext();

        this.i = 0;
    }

    private initCellIter(): void {
        let key = Field.getKey(this.boxIter.getX(), this.boxIter.getY(), this.groups[this.groupIndex]);
        this.cellIter = this.field.data[key];
    }

    private searchNext(): void {
        while (true) {
            this.i+= 1;
            if(this.i > 100){
                debugger;
            }

            let cellIter = this.cellIter;
            if (cellIter) {
                if (!(cellIter instanceof Array)) {
                    this.next = cellIter;
                    if (this.next.testMark(this.testId)) return;
                }
                for (let i = 0, l = cellIter.length; i < l; i++) {
                    this.next = cellIter[i];
                    if (this.next.testMark(this.testId)) return;
                }
            }

            this.groupIndex++;
            if (this.groupIndex >= this.groups.length) {
                this.groupIndex = 0;
                this.boxIter.next();
                if (this.boxIter.isDone()) {
                    this.clear();
                    return;
                }
            }
            this.initCellIter();
        }
    }

    private clear() {
        this.cellIter = null;
        this.groups = null;
        this.groupIndex = 0;
        this.next = null;
        this.field = null;
    }

    public nextFunc(): HitBox {
        if (this.next == null) throw new Error();
        let result = this.next;
        this.searchNext();
        return result;
    }

    public iterator() { return this; }
    public hasNext(): boolean { return this.next != null; }
    public remove() { throw new Error(); }
}