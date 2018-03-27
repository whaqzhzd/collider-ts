class A {
    public b: number[];
};

class B {
    public c: number[];
}

// 程序入口
class GameMain {
    private startTime: number = 0;

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
        for (let i = 0; i < 2; i++) {
            let x = 300; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
            let y = 300; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
            new CElastic(x, y, 40, 10000);
        }

        for (let i = 0; i <2; i++) {
            let x = 500; //Math.random() * (1280 - 200) + 400;//100 ;//+ Math.random() * (1280 - 2 * 56);
            let y = 500; //Math.random() * (720 - 200) + 300;//560;// + Math.random() * (720 - 2 * 56);
            new CElastic(x, y, 40, -10000);
        }

        let a = 0;
        let b = -a;
        console.log(a, b);

        Laya.timer.loop(66, this, this.loop);
    }

    private loop(): void {
        this.startTime += 66 / 1000;
        Game.engine.stepToTime(this.startTime);
        Game.engine.update();
    }
}
new GameMain();