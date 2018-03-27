class Scenarios {
    public static makePoolBorder() {
        for (let x = 0; x < 1280; x += 80) {
            let rect = Game.engine.makeRect();
            rect.setPos(x + 40, 20);
            rect.setDims(80, 40);
            rect.commit(Infinity);
            new CTarget(rect);
            rect = Game.engine.makeRect();
            rect.setPos(x + 40, 720 - 20);
            rect.setDims(80, 40);
            rect.commit(Infinity);
            new CTarget(rect);
        }

        for (let y = 40; y < 720 - 40; y += 80) {
            let rect = Game.engine.makeRect();
            rect.setPos(20, y + 40);
            rect.setDims(40, 80);
            rect.commit(Infinity);
            new CTarget(rect);
            rect = Game.engine.makeRect();
            rect.setPos(1280 - 20, y + 40);
            rect.setDims(40, 80);
            rect.commit(Infinity);
            new CTarget(rect);
        }

        for (let y = 40; y < 720 - 40; y += 80) {
            let rect = Game.engine.makeRect();
            rect.setPos(Math.random() * (1200 - 40) + 40, y + 40);
            rect.setDims(40, 80);
            rect.commit(Infinity);
            new CTarget(rect);
            rect = Game.engine.makeRect();
            rect.setPos(1280 - 20, y + 40);
            rect.setDims(40, 80);
            rect.commit(Infinity);
            new CTarget(rect);
        }
    }
}