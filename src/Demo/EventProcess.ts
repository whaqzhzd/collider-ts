class EventProcess implements ContProcess {
    public engine: GameEngine;
    public constructor(engine: GameEngine) {
        this.engine = engine;
    }

    public peekNextEventTime(): number {
        let event = this.engine.events.first();
        if (event == null) return Infinity;
        return event.time;
    }
    public stepToTime(time: number) { }
    public resolveEvent() {
        let event = this.engine.events.pollFirst();
        if (event.time == this.engine.processes.getTime()) event.resolve.call(null);
    }
}