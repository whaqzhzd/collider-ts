class HBRect extends HBPositioned {
    public startHW: number;
    public startHH: number;
    public velHW: number;
    public velHH: number;

    public constructor(collider: Collider) {
        super(collider);
    }

    public init() {
        this.startHW = 0.0;
        this.startHH = 0.0;
        this.velHW = 0.0;
        this.velHH = 0.0;
        super.init();
    }

    public markTransitionStart() {
        let time = this.collider.getTime();
        this.startHW = this.getHW(time);
        this.startHH = this.getHH(time);
        super.markTransitionStart();
    }

    public free() {
        this.collider.free(this);
        super.free();
    }

	/**
	 * Set the width.
	 * @param width Width.
	 */
    public setWidth(width: number) {
        this.collider.altering(this);
        this.startHW = .5 * width;
    }

	/**
	 * Set the height.
	 * @param height Height.
	 */
    public setHeight(height) {
        this.collider.altering(this);
        this.startHH = .5 * height;
    }

	/**
	 * Set the velocity of the width.
	 * @param velWidth Velocity of the width.
	 */
    public setVelWidth(velWidth: number) {
        this.collider.altering(this);
        this.velHW = .5 * velWidth;
    }

	/**
	 * Set the velocity of the height.
	 * @param velHeight Velocity of the height.
	 */
    public setVelHeight(velHeight: number) {
        this.collider.altering(this);
        this.velHH = .5 * velHeight;
    }

	/**
	 * Set the width and height.
	 * @param width Width.
	 * @param height Height.
	 */
    public setDims(width: number, height?: number) {
        this.collider.altering(this);
        this.startHW = .5 * width;
        this.startHH = height == void 0 ? this.startHW : .5 * height;
    }


	/**
	 * Set the velocities of the width and height;
	 * @param velWidth Velocity of the width.
	 * @param velHeight Velocity of the height.
	 */
    public setVelDims(velWidth: number, velHeight?: number) {
        this.collider.altering(this);
        this.velHW = .5 * velWidth;
        this.velHH = velHeight == void 0 ? this.velHW : .5 * velHeight;
    }

    public getHW(time) {
        return this.startHW + (time - this.startTime) * this.velHW;
    }
    public getHH(time) {
        return this.startHH + (time - this.startTime) * this.velHH;
    }

	/**
	 * Get the width.
	 * @return Width.
	 */
    public getWidth() { return 2 * this.getHW(this.collider.getTime()); }

	/**
	 * Get the height.
	 * @return Height.
	 */
    public getHeight() { return 2 * this.getHH(this.collider.getTime()); }

	/**
	 * Get the velocity of the width.
	 * @return Velocity of the width.
	 */
    public getVelWidth() { return 2 * this.velHW; }

	/**
	 * Get the velocity of the height.
	 * @return Velocity of the height.
	 */
    public getVelHeight() { return 2 * this.velHH; }

    public getStartHDim(dir: number) {
        switch (dir) {
            case Dir.R: case Dir.L: return this.startHW;
            case Dir.U: case Dir.D: return this.startHH;
            default: throw new Error();
        }
    }

    public getVelHDim(dir: number) {
        switch (dir) {
            case Dir.R: case Dir.L: return this.velHW;
            case Dir.U: case Dir.D: return this.velHH;
            default: throw new Error();
        }
    }

    public getStartEdgeComp(edge: number) {
        return this.getStartPosComp(edge) + this.getStartHDim(edge);
    }

    public getVelEdgeComp(edge: number) {
        return this.getVelComp(edge) + this.getVelHDim(edge);
    }

    public getEdgeComp(edge: number, time: number) {
        return this.getStartEdgeComp(edge) + (time - this.startTime) * this.getVelEdgeComp(edge);
    }

    public getBoundEdgeComp(edge: number, startTime: number, endTime: number) {
        let base = this.getStartEdgeComp(edge);
        let vel = this.getVelEdgeComp(edge);
        let evalTime = (vel > 0.0) ? endTime : startTime;
        return base + vel * (evalTime - this.startTime);
    }

    public isMoving(): boolean {
        return this.velX != 0.0 || this.velY != 0.0 || this.velHW != 0.0 || this.velHH != 0.0;
    }

    public getMaxBoundEdgeVel() {
        let vel = 0.0;
        for (let dir = 0; dir < 2; dir++) {
            vel = Math.max(vel, Arith.abs(this.getVelComp(dir)) + Arith.abs(this.getVelHDim(dir)));
        }
        return vel;
    }

    public dummyMimicCircle(c: HBCircle) {
        this.startTime = c.startTime;
        this.startX = c.startX;
        this.startY = c.startY;
        this.startHW = c.startRad;
        this.startHH = c.startRad;
        this.velX = c.velX;
        this.velY = c.velY;
        this.velHW = c.velRad;
        this.velHH = c.velRad;
    }
}
