var ArrayUtil = /** @class */ (function () {
    function ArrayUtil() {
    }
    ArrayUtil.remove = function (arr, node) {
        if (!arr)
            return {
                flag: false,
                arr: null
            };
        if (arr instanceof Array) {
            var index = arr.indexOf(node);
            if (index != -1) {
                var flag = true;
                arr.splice(index, 1);
                if (arr.length <= 0)
                    arr = null;
                return {
                    flag: flag,
                    arr: arr
                };
            }
            else {
                return {
                    flag: false,
                    arr: arr
                };
            }
        }
        if (arr == node) {
            return {
                flag: true,
                arr: null
            };
        }
        return {
            flag: false,
            arr: arr
        };
    };
    ArrayUtil.add = function (setObj, value) {
        if (value == null)
            throw new Error();
        var flag = true;
        if (setObj == null)
            return {
                flag: flag,
                arr: value
            };
        if (setObj instanceof Array) {
            var index = setObj.indexOf(value);
            if (index != -1) {
                return {
                    flag: false,
                    arr: setObj
                };
            }
            else {
                setObj.push(value);
                return {
                    flag: true,
                    arr: setObj
                };
            }
        }
        if (setObj == value) {
            return {
                flag: false,
                arr: setObj
            };
        }
        var arr = [];
        arr[0] = setObj;
        arr[1] = value;
        return {
            flag: true,
            arr: arr
        };
    };
    return ArrayUtil;
}());
//# sourceMappingURL=ArrayUtil.js.map