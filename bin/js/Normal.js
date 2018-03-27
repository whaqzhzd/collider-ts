var Normal = /** @class */ (function () {
    function Normal() {
    }
    /**
     * Returns the x-coordinate of the unit normal vector.
     * @return The x-coordinate of the unit normal vector.
     */
    Normal.prototype.getUnitX = function () { return this.x; };
    /**
     * Returns the y-coordinate of the unit normal vector.
     * @return The y-coordinate of the unit normal vector.
     */
    Normal.prototype.getUnitY = function () { return this.y; };
    /**
     * Returns the magnitude of the normal vector.
     * This is the amount that the two HitBoxes overlap.
     * A negative value represents the distance between
     * two non-overlapping HitBoxes.
     * @return The magnitude of the normal vector.
     */
    Normal.prototype.getOverlap = function () { return this.overlap; };
    return Normal;
}());
//# sourceMappingURL=Normal.js.map