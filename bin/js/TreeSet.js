var TreeSet = /** @class */ (function () {
    function TreeSet(compatator) {
        this.clear();
        if (compatator)
            this.compatator = compatator;
        else
            this.compatator = function (a, b) { return a - b; };
    }
    TreeSet.prototype.size = function () {
        return this.elements.length;
    };
    TreeSet.prototype.last = function () {
        return this.elements[this.length - 1];
    };
    TreeSet.prototype.first = function () {
        return this.elements[0];
    };
    TreeSet.prototype.isEmpty = function () {
        return this.size() === 0;
    };
    TreeSet.prototype.pollLast = function () {
        if (this.length > 0) {
            this.length--;
            return this.elements.splice(this.length, 1);
        }
        return null;
    };
    TreeSet.prototype.pollFirst = function () {
        if (this.length > 0) {
            this.length--;
            return this.elements.splice(0, 1)[0];
        }
        return null;
    };
    TreeSet.prototype.add = function (element) {
        var index = this.binarySearch(element);
        if (index < 0) {
            index = -index - 1;
        }
        this.elements.splice(index, 0, element);
        this.length++;
    };
    TreeSet.prototype.remove = function (element) {
        var index = this.binarySearch(element);
        if (index < 0) {
            return;
        }
        this.elements.splice(index, 1);
        this.length--;
    };
    TreeSet.prototype.clear = function () {
        this.length = 0;
        this.elements = [];
    };
    TreeSet.prototype.binarySearch = function (value) {
        var low = 0;
        var high = this.elements.length - 1;
        while (low <= high) {
            var mid = (low + high) >>> 1;
            var midValue = this.elements[mid];
            var cmp = this.compatator(midValue, value);
            if (cmp < 0) {
                low = mid + 1;
            }
            else if (cmp > 0) {
                high = mid - 1;
            }
            else {
                return mid;
            }
        }
        return -(low + 1);
    };
    return TreeSet;
}());
//# sourceMappingURL=TreeSet.js.map