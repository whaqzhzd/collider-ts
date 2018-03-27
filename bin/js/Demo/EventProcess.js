var EventProcess = /** @class */ (function () {
    function EventProcess(engine) {
        this.engine = engine;
    }
    EventProcess.prototype.peekNextEventTime = function () {
        var event = this.engine.events.first();
        if (event == null)
            return Infinity;
        return event.time;
    };
    EventProcess.prototype.stepToTime = function (time) { };
    EventProcess.prototype.resolveEvent = function () {
        var event = this.engine.events.pollFirst();
        if (event.time == this.engine.processes.getTime())
            event.resolve.call(null);
    };
    return EventProcess;
}());
//# sourceMappingURL=EventProcess.js.map