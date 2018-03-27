class Normal {
    public x: number;
    public y: number;
    public overlap: number;

	/**
	 * Returns the x-coordinate of the unit normal vector.
	 * @return The x-coordinate of the unit normal vector.
	 */
    public getUnitX() { return this.x; }

	/**
	 * Returns the y-coordinate of the unit normal vector.
	 * @return The y-coordinate of the unit normal vector.
	 */
    public getUnitY() { return this.y; }

	/**
	 * Returns the magnitude of the normal vector.
	 * This is the amount that the two HitBoxes overlap.
	 * A negative value represents the distance between
	 * two non-overlapping HitBoxes.
	 * @return The magnitude of the normal vector.
	 */
    public getOverlap() { return this.overlap; }
}
