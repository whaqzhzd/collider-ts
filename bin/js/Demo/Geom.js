var Geom = /** @class */ (function () {
    function Geom() {
    }
    Geom.area = function (hitBox) {
        if (hitBox instanceof HBCircle) {
            var r = .5 * hitBox.getDiam();
            return Math.PI * r * r;
        }
        else {
            var rect = hitBox;
            return rect.getWidth() * rect.getHeight();
        }
    };
    Geom.area2Diam = function (area) {
        return 2 * Math.sqrt(area / Math.PI);
    };
    return Geom;
}());
//# sourceMappingURL=Geom.js.map