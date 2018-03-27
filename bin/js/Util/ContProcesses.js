var ContProcesses = /** @class */ (function () {
    function ContProcesses() {
        this.processes = new Array();
        this.time = 0.0;
    }
    ContProcesses.prototype.addProcess = function (process) {
        if (this.processes.indexOf(process) >= 0)
            return false;
        var nextEventTime = process.peekNextEventTime();
        if (nextEventTime < this.time)
            throw new Error("process event time has already passed");
        process.stepToTime(this.time);
        this.processes.push(process);
        return true;
    };
    ContProcesses.prototype.removeProcess = function (process) {
        var idx = this.processes.indexOf(process);
        if (idx != -1) {
            this.processes.splice(idx, 1);
            return true;
        }
        return false;
    };
    ContProcesses.prototype.getTime = function () {
        return this.time;
    };
    ContProcesses.prototype.stepToTime = function (newTime) {
        var processes = this.processes;
        if (newTime < this.time)
            throw new Error();
        while (true) {
            var minEvtTime = newTime;
            var minEvtTimeI = -1;
            for (var i = 0; i < processes.length; i++) {
                var evtTime = processes[i].peekNextEventTime();
                if (evtTime < this.time)
                    throw new Error();
                if (evtTime < minEvtTime) {
                    minEvtTime = evtTime;
                    minEvtTimeI = i;
                }
            }
            if (minEvtTime != this.time) {
                for (var j = 0; j < processes.length; j++) {
                    processes[j].stepToTime(minEvtTime);
                }
            }
            this.time = minEvtTime;
            if (minEvtTimeI < 0)
                break;
            processes[minEvtTimeI].resolveEvent();
        }
    };
    return ContProcesses;
}());
//# sourceMappingURL=ContProcesses.js.map