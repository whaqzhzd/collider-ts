class ArrayUtil {

    public static remove(arr: Array<any>, node: any): { flag: boolean, arr: Array<any> } {
        if (!arr)
            return {
                flag: false,
                arr: null
            };

        if (arr instanceof Array) {
            let index = arr.indexOf(node);
            if (index != -1) {
                let flag = true;
                arr.splice(index, 1);

                if (arr.length <= 0) arr = null;

                return {
                    flag: flag,
                    arr: arr
                };
            } else {
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
    }

    public static add(setObj: any, value: any): { flag: boolean, arr: Array<any> } {
        if (value == null) throw new Error();
        let flag = true;

        if (setObj == null)

            return {
                flag: flag,
                arr: value
            };

        if (setObj instanceof Array) {
            let index = setObj.indexOf(value);
            if (index != -1) {

                return {
                    flag: false,
                    arr: setObj
                };
            } else {
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

        let arr = [];
        arr[0] = setObj;
        arr[1] = value;

        return {
            flag: true,
            arr: arr
        };
    }
}