class FunctionEventt {
    public time: number;
    public id: number;


    public constructor(resolve?: (collider: Collider) => {}) {
        resolve && (this.resolve = resolve);
    }

    public resolve(collider: Collider) {

    }

    public compareTo(o: FunctionEventt): number {
        if (this.time > o.time) return 1;
        if (this.time == o.time) return this.id - o.id;
        return -1;
    }
}
