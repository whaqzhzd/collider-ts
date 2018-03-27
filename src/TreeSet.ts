class TreeSet<T>{
    private length: number;
    private elements: Array<T>;
    private compatator: Function

    public constructor(compatator?: Function) {
        this.clear();
        if (compatator)
            this.compatator = compatator;
        else
            this.compatator = function (a, b) { return a - b };
    }

    public size() {
        return this.elements.length;
    }

    public last() {
        return this.elements[this.length - 1];
    }

    public first() {
        return this.elements[0];
    }

    public isEmpty() {
        return this.size() === 0;
    }

    public pollLast() {
        if (this.length > 0) {
            this.length--;
            return this.elements.splice(this.length, 1);
        }
        return null;
    }

    public pollFirst() {
        if (this.length > 0) {
            this.length--;
            return this.elements.splice(0, 1)[0];
        }
        return null;
    }

    public add(element) {
        let index = this.binarySearch(element);
        if (index < 0) {
            index = -index - 1;
        }
        this.elements.splice(index, 0, element);
        this.length++;
    }

    public remove(element) {
        let index = this.binarySearch(element);
        if (index < 0) {
            return;
        }
        this.elements.splice(index, 1);
        this.length--;
    }

    public clear(): void {
        this.length = 0;
        this.elements = [];
    }

    public binarySearch(value) {
        var low = 0;
        var high = this.elements.length - 1;

        while (low <= high) {
            var mid = (low + high) >>> 1;
            var midValue = this.elements[mid];
            var cmp = this.compatator(midValue, value);
            if (cmp < 0) {
                low = mid + 1;
            } else if (cmp > 0) {
                high = mid - 1;
            } else {
                return mid;
            }
        }

        return -(low + 1);
    }
}