
abstract class HBPositioned extends HitBox {
    public startX: number;
    public startY: number;
    public velX: number;
    public velY: number;

    constructor(collider: Collider) {
        super(collider);
    }

    public init() {
        this.startX = 0.0;
        this.startY = 0.0;
        this.velX = 0.0;
        this.velY = 0.0;
        super.init();
    }

    public markTransitionStart() {
        let time = this.collider.getTime();
        this.startX = this.getX(time);
        this.startY = this.getY(time);
        super.markTransitionStart();
    }

	/**
	 * Set the center x-coordinate.
	 * @param x Center x-corrdinate.
	 */
    public setX(x: number) {
        this.collider.altering(this);
        this.startX = x;
    }

	/**
	 * Set the center y-coordinate.
	 * @param y Center y-coordinate.
	 */
    public setY(y: number) {
        this.collider.altering(this);
        this.startY = y;
    }

	/**
	 * Set the velocity of the center x-coordinate.
	 * @param velX Velocity of the center x-coordinate.
	 */
    public setVelX(velX: number) {
        this.collider.altering(this);
        this.velX = velX;
    }

	/**
	 * Set the velocity of the center y-coordinate.
	 * @param velY Velocity of the center y-coordinate.
	 */
    public setVelY(velY: number) {
        this.collider.altering(this);
        this.velY = velY;
    }

	/**
	 * Set the center position.
	 * @param x Center x-coordinate.
	 * @param y Center y-coordinate.
	 */
    public setPos(x: number, y: number) {
        this.collider.altering(this);
        this.startX = x;
        this.startY = y;
    }

	/**
	 * Set the velocity of the center position.
	 * @param velX Velocity of the center x-coordinate.
	 * @param velY Velocity of the center y-coordinate.
	 */
    public setVel(velX: number, velY: number) {
        this.collider.altering(this);
        this.velX = velX;
        this.velY = velY;
    }

    public getX(time: number = this.collider.getTime()): number {
        return this.startX + (time - this.startTime) * this.velX;
    }

    public getY(time: number = this.collider.getTime()): number {
        return this.startY + (time - this.startTime) * this.velY;
    }

	/**
	 * Get the velocity of the center x-coordinate.
	 * @return The velocity of the center x-coordinate.
	 */
    public getVelX(): number {
        return this.velX;
    }

	/**
	 * Get the velocity of the center y-coordinate.
	 * @return The velocity of the center y-coordinate.
	 */
    public getVelY(): number {
        return this.velY;
    }

    /*
    public getStartPosComp(dir: number): number {
        switch (dir) {
            case Dir.R: return this.startX;
            case Dir.U: return this.startY;
            case Dir.L: return -this.startX;
            case Dir.D: return -this.startY;
            default: throw new Error();
        }
    }
    */

    /*
    public getVelComp(dir: number) {
        switch (dir) {
            case Dir.R: return this.velX;
            case Dir.U: return this.velY;
            case Dir.L: return -this.velX;
            case Dir.D: return -this.velY;
            default: throw new Error();
        }
    }
    */

    public getStartPosComp(dir: number): number {
        switch (dir) {
            case Dir.R: return this.startX;
            case Dir.U: return this.startY;
            case Dir.L: return - this.startX;
            case Dir.D: return - this.startY;
            default: throw new Error();
        }
    }

    public getVelComp(dir: number) {
        switch (dir) {
            case Dir.R: return this.velX;
            case Dir.U: return this.velY;
            case Dir.L: return - this.velX;
            case Dir.D: return - this.velY;
            default: throw new Error();
        }
    }

    public getPosComp(dir: number, time: number) {
        return this.getStartPosComp(dir) + (time - this.startTime) * this.getVelComp(dir);
    }

    public dummySetStartCoord(dir: number, value: number) {
        switch (dir) {
            case Dir.R: this.startX = value; return;
            case Dir.U: this.startY = value; return;
            default: throw new Error();
        }
    }

    public dummySetVelCoord(dir: number, value: number) {
        switch (dir) {
            case Dir.R: this.velX = value; return;
            case Dir.U: this.velY = value; return;
            default: throw new Error();
        }
    }
}
