class ColliderProcess implements ContProcess {
    private collider: Collider;
    private listener: ColliderListener;


    public constructor(collider: Collider | ColliderOpts, listener: ColliderListener) {
        if (collider == null || listener == null) throw new Error();

        if (collider instanceof ColliderOpts) {
            this.collider = new Collider(collider);
        } else {
            this.collider = collider;
        }
        this.listener = listener;
    }

    public peekNextEventTime(): number {
        return this.collider.peekNextEventTime();
    }
    public stepToTime(time: number) {
        let evt = this.collider.stepToTime(time, false);
        if (evt != null) throw new Error();
    }
    public resolveEvent() {
        let time = this.collider.getTime();
        let evt = this.collider.stepToTime(time);
        if (evt != null) {
            if (evt.isCollision()) this.listener.collision(evt);
            else if (evt.isSeparation()) this.listener.separation(evt);
        }
    }
}