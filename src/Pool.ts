class Pool<T>{
    public peak: number;

    private freeObjects: Array<T>;

    public constructor(newObject?: () => T) {
        this.peak = 0;
        this.freeObjects = new Array();
        newObject && (this.newObject = newObject);
    }

    protected  newObject(): T{
        throw new Error();
    }

    public obtain(): T {
        return this.freeObjects.length == 0 ? this.newObject() : this.freeObjects.pop();
    }

    public free(object: T) {
        if (object == null) throw new Error("object cannot be null.");
        this.freeObjects.push(object);
        this.peak = Math.max(this.peak, this.freeObjects.length);

        if (Object.hasOwnProperty.call(object, "reset")) {
            (object as any).reset();
        }
    }

    public freeAll(objects: Array<T>) {
        if (objects == null) throw new Error("object cannot be null.");
        let freeObjects: Array<T> = this.freeObjects;
        for (let i = 0; i < objects.length; i++) {
            let object = objects[i];
            if (object == null) continue;
            freeObjects.push(object);
            if (Object.hasOwnProperty.call(object, "reset")) {
                (object as any).reset();
            }
        }
        this.peak = Math.max(this.peak, this.freeObjects.length);
    }

    public clear(): void {
        this.freeObjects.length = 0;
    }

    public getFree(): number {
        return this.freeObjects.length;
    }
}