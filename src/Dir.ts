class Dir {
    static R: number = 0;

    static U: number = 1;

    static L: number = 2;

    static D: number = 3;

    static opp(dir: number): number {
        return (dir + 2) & 3;
    }

    static dot(dirA: number, dirB: number): number {
        let relDir: number = (dirB - dirA) & 3;
        switch (relDir) {
            case 0:
                return 1;
            case 2:
                return -1;
            default:
                return 0;
        }
    }

    static x(dir: number): number {
        switch (dir) {
            case 0 /* R */:
                return 1;
            case 2 /* L */:
                return -1;
            default:
                return 0;
        }
    }

    static y(dir: number): number {
        switch (dir) {
            case 1 /* U */:
                return 1;
            case 3 /* D */:
                return -1;
            default:
                return 0;
        }
    }
}

