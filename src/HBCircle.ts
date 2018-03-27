class HBCircle extends HBPositioned {
    public startRad: number;
    public velRad: number;

    public constructor(collider: Collider) {
        super(collider);

        this.startRad = 0;
        this.velRad = 0;
    }

    public init() {
        this.startRad = 0.0;
        this.velRad = 0.0;
        super.init();
    }

    public markTransitionStart() {
        let time = this.collider.getTime();
        this.startRad = this.getRad(time);
        super.markTransitionStart();
    }

    public free() {
        this.collider.free(this);
        super.free();
    }

	/**
	 * Set the diameter.
	 * @param diam Diameter.
	 */
    public setDiam(diam) {
        this.collider.altering(this);
        this.startRad = .5 * diam;
    }

	/**
	 * Set the velocity of the diameter.
	 * @param velDiam Velocity of the diameter.
	 */
    public setVelDiam(velDiam) {
        this.collider.altering(this);
        this.velRad = .5 * velDiam;
    }

    public getRad(time) { return this.startRad + (time - this.startTime) * this.velRad; }

	/**
	 * Get the diameter.
	 * @return Diameter.
	 */
    public getDiam() { return 2 * this.getRad(this.collider.getTime()); }

	/**
	 * Get the velocity of the diameter.
	 * @return Velocity of the diameter.
	 */
    public getVelDiam() { return 2 * this.velRad; }

    public getStartEdgeComp(edge: number) {
        return this.getStartPosComp(edge) + this.startRad;
    }

    public getVelEdgeComp(edge: number) {
        return this.getVelComp(edge) + this.velRad;
    }

    public getBoundEdgeComp(edge: number, startTime: number, endTime: number) {
        let base = this.getStartEdgeComp(edge);
        let vel = this.getVelEdgeComp(edge);
        let evalTime = (vel > 0.0) ? endTime : startTime;
        return base + vel * (evalTime - this.startTime);
    }

    public isMoving(): boolean {
        return this.velX != 0.0 || this.velY != 0.0 || this.velRad != 0.0;
    }

    public getMaxBoundEdgeVel() {
        let vel = 0.0;
        let absVelRad = Arith.abs(this.velRad);
        for (let dir = 0; dir < 2; dir++) {
            vel = Math.max(vel, Arith.abs(this.getVelComp(dir)) + absVelRad);
        }
        return vel;
    }
}
