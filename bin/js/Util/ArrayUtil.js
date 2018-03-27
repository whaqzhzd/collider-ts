var ArrayUtil = /** @class */ (function () {
    function ArrayUtil() {
    }
    ArrayUtil.remove = function (arr, node) {
        if (!arr)
            return ArrayUtil.return({
                flag: false,
                arr: null
            });
        if (arr instanceof Array) {
            var index = arr.indexOf(node);
            if (index != -1) {
                var flag = true;
                arr.splice(index, 1);
                if (arr.length <= 0)
                    arr = null;
                return ArrayUtil.return({
                    flag: flag,
                    arr: arr
                });
            }
            else {
                return ArrayUtil.return({
                    flag: false,
                    arr: arr
                });
            }
        }
        if (arr == node) {
            return ArrayUtil.return({
                flag: true,
                arr: null
            });
        }
        return ArrayUtil.return({
            flag: false,
            arr: arr
        });
    };
    ArrayUtil.add = function (setObj, value) {
        if (value == null)
            throw new Error();
        var flag = true;
        if (setObj == null)
            return ArrayUtil.return({
                flag: flag,
                arr: value
            });
        if (setObj instanceof Array) {
            var index = setObj.indexOf(value);
            if (index != -1) {
                return ArrayUtil.return({
                    flag: false,
                    arr: setObj
                });
            }
            else {
                setObj.push(value);
                return ArrayUtil.return({
                    flag: true,
                    arr: setObj
                });
            }
        }
        if (setObj == value) {
            return ArrayUtil.return({
                flag: false,
                arr: setObj
            });
        }
        var arr = [];
        arr[0] = setObj;
        arr[1] = value;
        return ArrayUtil.return({
            flag: true,
            arr: arr
        });
    };
    ArrayUtil.return = function (data) {
        if (data.arr instanceof Array && data.arr.length <= 0) {
            debugger;
        }
        return data;
    };
    return ArrayUtil;
}());
//# sourceMappingURL=ArrayUtil.js.map