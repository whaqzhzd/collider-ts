class Geom {

    private constructor() { }

    public static area(hitBox: HitBox): number {
        if (hitBox instanceof HBCircle) {
            let r = .5 * (<HBCircle>hitBox).getDiam();
            return Math.PI * r * r;
        }
        else {
            let rect = <HBRect>hitBox;
            return rect.getWidth() * rect.getHeight();
        }
    }

    public static area2Diam(area: number): number {
        return 2 * Math.sqrt(area / Math.PI);
    }
}
