class ArrayUtil {

    public static remove(arr: Array<any>, node: any): { flag: boolean, arr: Array<any> } {
        if (!arr)
            return ArrayUtil.return(
                {
                    flag: false,
                    arr: null
                }
            );

        if (arr instanceof Array) {
            let index = arr.indexOf(node);
            if (index != -1) {
                let flag = true;
                arr.splice(index, 1);

                if (arr.length <= 0) arr = null;

                return ArrayUtil.return(
                    {
                        flag: flag,
                        arr: arr
                    }
                );
            } else {
                return ArrayUtil.return(
                    {
                        flag: false,
                        arr: arr
                    }
                );
            }
        }

        if (arr == node) {

            return ArrayUtil.return(
                {
                    flag: true,
                    arr: null
                }
            );
        }

        return ArrayUtil.return(
            {
                flag: false,
                arr: arr
            }
        );
    }

    public static add(setObj: any, value: any): { flag: boolean, arr: Array<any> } {
        if (value == null) throw new Error();
        let flag = true;

        if (setObj == null)

            return ArrayUtil.return(
                {
                    flag: flag,
                    arr: value
                }
            );

        if (setObj instanceof Array) {
            let index = setObj.indexOf(value);
            if (index != -1) {

                return ArrayUtil.return(
                    {
                        flag: false,
                        arr: setObj
                    }
                );
            } else {
                setObj.push(value);

                return ArrayUtil.return(
                    {
                        flag: true,
                        arr: setObj
                    }
                );
            }
        }

        if (setObj == value) {

            return ArrayUtil.return(
                {
                    flag: false,
                    arr: setObj
                }
            );
        }

        let arr = [];
        arr[0] = setObj;
        arr[1] = value;

        return ArrayUtil.return({
            flag: true,
            arr: arr
        });
    }

    public static return(data: { flag: boolean, arr: Array<any> }): { flag: boolean, arr: Array<any> } {
        if (data.arr instanceof Array && data.arr.length <= 0) {
            debugger;
        }

        return data;
    }
}