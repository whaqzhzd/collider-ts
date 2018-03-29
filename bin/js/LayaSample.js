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
        for (var i = 0; i < 0; i++) {
            var x_1 = 300; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
            var y_1 = 300; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
            new CSlide(x_1, y_1, 40, 1000);
        }
        for (var i = 0; i < 0; i++) {
            var x_2 = 500; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
            var y_2 = 500; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
            new CElastic(x_2, y_2, 40, -1000);
        }
        var x = 500; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
        var y = 500; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
        this.player = new CSlide(x, y, 40, 0);
        var a = 0;
        var b = -a;
        console.log(a, b);
        this.keyMaps = {};
        Laya.timer.loop(66, this, this.loop);
        Laya.timer.loop(3, this, this.next);
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
    }
    GameMain.prototype.next = function () {
        var w = this.keyMaps[Laya.Keyboard.W], a = this.keyMaps[Laya.Keyboard.A], s = this.keyMaps[Laya.Keyboard.S], d = this.keyMaps[Laya.Keyboard.D];
        var speeds = 200;
        var degree;
        if (w && a) {
            degree = 315;
        }
        else if (w && d) {
            degree = 405;
        }
        else if (s && a) {
            degree = 225;
        }
        else if (s && d) {
            degree = 135;
        }
        else if (w) {
            degree = 360;
        }
        else if (a) {
            degree = 270;
        }
        else if (d) {
            degree = 90;
        }
        else if (s) {
            degree = 180;
        }
        else {
            // this.player.hitBox.setVel(0, 0);
            // this.player.hitBox.commit(Infinity);
            return;
        }
        degree = GameMain.getAdjustRotation(degree - 90);
        var speed = GameMain.getSpeedByAngle(degree, speeds);
        this.player.hitBox.setVel(speed.x, speed.y);
        this.player.hitBox.commit(Infinity);
    };
    GameMain.prototype.onKeyDown = function (e) {
        if (e.keyCode == Laya.Keyboard.W || e.keyCode == Laya.Keyboard.A || e.keyCode == Laya.Keyboard.S || e.keyCode == Laya.Keyboard.D) {
            this.keyMaps[e.keyCode] = 1;
        }
    };
    GameMain.prototype.onKeyUp = function (e) {
        delete this.keyMaps[e.keyCode];
    };
    GameMain.getAdjustRotation = function (rotation) {
        rotation = rotation % 360;
        rotation = rotation < 0 ? rotation + 360 : rotation;
        if (rotation < 0)
            return GameMain.getAdjustRotation(rotation);
        else
            return rotation;
    };
    GameMain.getSpeedByAngle = function (angle, speed) {
        var redian = GameMain.degreeToRadian(angle);
        var xSpeed = Math.cos(redian) * speed;
        var ySpeed = Math.sin(redian) * speed;
        return {
            x: xSpeed,
            y: ySpeed
        };
    };
    GameMain.degreeToRadian = function (degree) {
        return degree * Math.PI / 180;
    };
    GameMain.prototype.loop = function () {
        this.startTime += 66 / 1000;
        Game.engine.stepToTime(this.startTime);
        Game.engine.update();
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map