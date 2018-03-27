class ContProcesses {
    private processes: Array<ContProcess> = new Array<ContProcess>();
    private time: number = 0.0;
    private i: number = 0;

    public constructor() { }

    public addProcess(process: ContProcess): boolean {
        if (this.processes.indexOf(process) >= 0) return false;
        let nextEventTime = process.peekNextEventTime();
        if (nextEventTime < this.time) throw new Error("process event time has already passed");
        process.stepToTime(this.time);
        this.processes.push(process);
        return true;
    }


    public removeProcess(process: ContProcess): boolean {
        let idx = this.processes.indexOf(process);
        if (idx != -1) {
            this.processes.splice(idx, 1);
            return true;
        }
        return false;
    }

    public getTime(): number {
        return this.time;
    }

    public stepToTime(newTime: number): void {
        let processes = this.processes;
        if (newTime < this.time) throw new Error();
        this.i = 0;

        while (true) {
            this.i += 1;
            if(this.i > 100){
                debugger;
            }
            let minEvtTime = newTime;
            let minEvtTimeI = -1;
            for (let i = 0; i < processes.length; i++) {
                let evtTime = processes[i].peekNextEventTime();
                if (evtTime < this.time) throw new Error();
                if (evtTime < minEvtTime) {
                    minEvtTime = evtTime;
                    minEvtTimeI = i;
                }
            }
            if (minEvtTime != this.time) {
                for (let j = 0; j < processes.length; j++) {
                    processes[j].stepToTime(minEvtTime);
                }
            }
            if(this.time == minEvtTime){
                // debugger;
            }
            this.time = minEvtTime;
            if (minEvtTimeI < 0) break;
            processes[minEvtTimeI].resolveEvent();
        }
    }
}