class SetIterator<T>{
    private value: any;
    private arr: any[];
    private index: number;

    public constructor(setObj?: any) {

    }

    public init(setObj: any): void {
        this.clear();
        if (setObj == null) return;

        if (setObj instanceof Array) {
            this.arr = setObj;
            if (setObj[0] == null) this.arr = null;
        } else {
            this.value = setObj;
        }
    }

    public clear() {
        this.value = null;
        this.arr = null;
        this.index = 0;
    }

    public hasNext(): boolean {
        return this.value != null || this.arr != null;
    }

    public next(): T {
        if (this.value != null) {
            let result = this.value;
            this.value = null;
            return <T>result;
        }
        if (this.arr != null) {
            let result = this.arr[this.index];
            this.index++;
            if (this.index >= this.arr.length || this.arr[this.index] == null) {
                this.arr = null;
                this.index = 0;
            }
            return <T>result;
        }
        throw new Error();
    }
}