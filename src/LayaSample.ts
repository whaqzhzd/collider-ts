interface keyMap {
    [keycode: number]: number
}

// 程序入口
class GameMain {
    private startTime: number = 0;
    private player: CSlide;

    constructor() {
        Laya.init(1280, 720, Laya.WebGL);

        // Laya3D.init(720, 1200, true);

        Laya.Render.optimizeTextureMemory = (url: string, texture: any): boolean => {
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
        for (let i = 0; i < 0; i++) {
            let x = 300; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
            let y = 300; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
            new CSlide(x, y, 40, 1000);
        }

        for (let i = 0; i < 0; i++) {
            let x = 500; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
            let y = 500; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
            new CElastic(x, y, 40, -1000);
        }

        let x = 500; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
        let y = 500; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
        this.player = new CSlide(x, y, 40, 0);

        let a = 0;
        let b = -a;
        console.log(a, b);
        this.keyMaps = {};

        Laya.timer.loop(66, this, this.loop);
        Laya.timer.loop(3, this, this.next);

        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
    }

    private next(): void {
        let w = this.keyMaps[Laya.Keyboard.W],
            a = this.keyMaps[Laya.Keyboard.A],
            s = this.keyMaps[Laya.Keyboard.S],
            d = this.keyMaps[Laya.Keyboard.D];
        let speeds = 200;
        let degree: number;

        if (w && a) {
            degree = 315;
        } else if (w && d) {
            degree = 405;
        } else if (s && a) {
            degree = 225;
        } else if (s && d) {
            degree = 135;
        } else if (w) {
            degree = 360;
        } else if (a) {
            degree = 270;
        } else if (d) {
            degree = 90;
        } else if (s) {
            degree = 180;
        } else {
            // this.player.hitBox.setVel(0, 0);
            // this.player.hitBox.commit(Infinity);
            return;
        }

        degree = GameMain.getAdjustRotation(degree - 90);
        let speed = GameMain.getSpeedByAngle(degree, speeds);
     
        this.player.hitBox.setVel(speed.x, speed.y);
        this.player.hitBox.commit(Infinity);
    }

    protected keyMaps: keyMap;
    protected onKeyDown(e: Laya.Event): void {
        if (e.keyCode == Laya.Keyboard.W || e.keyCode == Laya.Keyboard.A || e.keyCode == Laya.Keyboard.S || e.keyCode == Laya.Keyboard.D) {
            this.keyMaps[e.keyCode] = 1;
        }
    }

    protected onKeyUp(e: Laya.Event): void {
        delete this.keyMaps[e.keyCode];
    }

    public static getAdjustRotation(rotation): number {
        rotation = rotation % 360;
        rotation = rotation < 0 ? rotation + 360 : rotation;
        if (rotation < 0)
            return GameMain.getAdjustRotation(rotation);
        else
            return rotation;
    }

    public static getSpeedByAngle(angle: number, speed: number): { x: number, y: number } {
        let redian = GameMain.degreeToRadian(angle);
        let xSpeed = Math.cos(redian) * speed;
        let ySpeed = Math.sin(redian) * speed;

        return {
            x: xSpeed,
            y: ySpeed
        }
    }

    public static degreeToRadian(degree: number): number {
        return degree * Math.PI / 180;
    }

    private loop(): void {
        this.startTime += 66 / 1000;
        Game.engine.stepToTime(this.startTime);
        Game.engine.update();
    }
}
new GameMain();