var SetIterator = /** @class */ (function () {
    function SetIterator(setObj) {
    }
    SetIterator.prototype.init = function (setObj) {
        this.clear();
        if (setObj == null)
            return;
        if (setObj instanceof Array) {
            this.arr = setObj;
            if (setObj[0] == null)
                this.arr = null;
        }
        else {
            this.value = setObj;
        }
    };
    SetIterator.prototype.clear = function () {
        this.value = null;
        this.arr = null;
        this.index = 0;
    };
    SetIterator.prototype.hasNext = function () {
        return this.value != null || this.arr != null;
    };
    SetIterator.prototype.next = function () {
        if (this.value != null) {
            var result = this.value;
            this.value = null;
            return result;
        }
        if (this.arr != null) {
            var result = this.arr[this.index];
            this.index++;
            if (this.index >= this.arr.length || this.arr[this.index] == null) {
                this.arr = null;
                this.index = 0;
            }
            return result;
        }
        throw new Error();
    };
    return SetIterator;
}());
//# sourceMappingURL=SetIterator.js.map