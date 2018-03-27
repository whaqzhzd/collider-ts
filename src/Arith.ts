class Arith {
    static quadRootAscending(a: number, b: number, c: number): number {
        let det: number = b * b - 4 * a * c;
        if (det < 0.0) return NaN;
        if (b >= 0) return (2 * c) / (-b - Math.sqrt(det)); else return (-b + Math.sqrt(det)) / (2 * a);
    }

    static floor(value: number): number {
        let result: number = (<number>value | 0);
        if (value < 0.0 && value !== result) return result - 1; else return result;
    }

    static ceil(value: number): number {
        let result: number = (<number>value | 0);
        if (value > 0.0 && value !== result) return result + 1; else return result;
    }

    static min$double$double(a: number, b: number): number {
        return (a < b) ? a : b;
    }

    static max$double$double(a: number, b: number): number {
        return (a > b) ? a : b;
    }

    public static min$int$int(a: number, b: number): number {
        return (a < b) ? a : b;
    }

    public static min(a?: number, b?: number): any {
        if (((typeof a === 'number') || a === null) && ((typeof b === 'number') || b === null)) {
            return Arith.min$int$int(a, b);
        } else if (((typeof a === 'number') || a === null) && ((typeof b === 'number') || b === null)) {
            return Arith.min$double$double(a, b);
        } else throw new Error('invalid overload');
    }

    public static max$int$int(a: number, b: number): number {
        return (a > b) ? a : b;
    }

    public static max(a?: number, b?: number): any {
        if (((typeof a === 'number') || a === null) && ((typeof b === 'number') || b === null)) {
            return Arith.max$int$int(a, b);
        } else if (((typeof a === 'number') || a === null) && ((typeof b === 'number') || b === null)) {
            return Arith.max$double$double(a, b);
        } else throw new Error('invalid overload');
    }

    static abs(value: number): number {
        if (value < 0.0) return -value; else return value;
    }
}


