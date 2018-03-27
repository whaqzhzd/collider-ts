class HitBoxPool<T> extends Pool<T> {
    public constructor(newObject: () => T) {
        super();
        this.newObject = newObject;
    }

    protected newObject(): T {
        throw new Error();
    }

    public obtain(): T {
        return super.obtain();
    }

    public free(hitBox: T): void {
        super.free(hitBox);
    }
}