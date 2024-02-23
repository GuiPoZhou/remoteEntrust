class ArrayUtil {
    // 根据某个属性值，删除数组对象中的某一项
    arrRemoveJson(arr, attr, value) {
        if (!arr || arr.length == 0) {
            return ""
        }
        let newArr = arr.filter(function (item, index) {
            return item[attr] != value
        })
        return newArr
    }

}

export default ArrayUtil
