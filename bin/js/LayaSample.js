var A = /** @class */ (function () {
    function A() {
    }
    return A;
}());
;
var B = /** @class */ (function () {
    function B() {
    }
    return B;
}());
// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        this.startTime = 0;
        Laya.init(1280, 720, Laya.WebGL);
        // Laya3D.init(720, 1200, true);
        Laya.Render.optimizeTextureMemory = function (url, texture) {
            if (texture && texture.bitmap && texture.bitmap instanceof Laya.WebGLCharImage) {
                return true;
            }
            return false;
        };
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        //Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
        Laya.stage.bgColor = "#000000";
        // Laya.stage.fullScreenEnabled = true;
        // Laya.Log.enable();
        Laya.Stat.show();
        Game.engine;
        Scenarios.makePoolBorder();
        for (var i = 0; i < 5; i++) {
            var x = 300; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
            var y = 300; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
            new CElastic(x, y, 40, 1000);
        }
        for (var i = 0; i < 5; i++) {
            var x = 500; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
            var y = 300; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
            new CElastic(x, y, 40, -1000);
        }
        var a = 0;
        var b = -a;
        console.log(a, b);
        Laya.timer.loop(66, this, this.loop);
    }
    GameMain.prototype.loop = function () {
        this.startTime += 66 / 1000;
        Game.engine.stepToTime(this.startTime);
        Game.engine.update();
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map