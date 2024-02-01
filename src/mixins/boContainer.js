/*
 *@author: 焦政
 *@date: 2022-02-18 11:37:40
 *@description:模块主页相关
*/
import $store from "@/store";
import { getToken } from '@/utils/auth'
const MenuId = localStorage.getItem('menuId')
export default {
    data() {
        return {}
    },
    computed: {
        /*
      *@author: 焦政
      *@date: 2022-02-18 11:45:04
      *@description:全局主页语言环境最新状态值
     */
        lang() {
            return this.$store.state.boshland.lang
        },
        mainTableHeight() {
            let height = this.$store.state.boshland.boMainHeight
            return height
        }
    },
    mounted() {

    },
    methods: {
        linefeed(h, {column, index}) { // column,index都是el-table中自带的
            let numble = column.label.length // 表头字数
            let size = 16 // 字体尺寸
            column.minWidth = numble * size + 30 // 计算宽度
            return h('div', {class: 'table-head', style: {width: '100%'}}, [column.label])
        },
        /** 统计分析菜单公共方法 用于动态生成表格标题
         * @param {Array}data:  当前表格数据
         * @param {String}[type = 'detectCategoryCount'] type: 需要遍历的对象 type默认为 detectCategoryCount
         * @returns {Object} 一个对象 {titleList:整理后的标题 listData:原列表数据}
         */
        mergeData(data,type) {
            let obj = []
            // 设置默认类型
            if(!type) type = 'detectCategoryCount'
            if (data.length > 0){
                data.map((item) => {
                    let keyList = []
                    // 根据实际情况 来遍历对象
                    for(let key in item[type]){
                        keyList.push(key)
                    }
                    // 根据获取的对象字段 来插入到每一行的表格中
                    keyList.forEach((item33) => {
                        item[item33] = item[type][item33]
                        obj.push(item33)
                    })
                })
            }
            // this.titleList = [...new Set(obj)]
            return {
                // 数组去重
                titleList: [...new Set(obj)],
                listData: data
            }
        },
      // 通过文件名下载文件 方法
      downLoadFile(fileName, isTrue = true) {
        const baseURL = window.globalEnv.VUE_APP_BASE_API
        window.location.href = baseURL + '/common/download?fileName=' + encodeURI(fileName) + '&delete=' + isTrue+'&Authorization='+getToken()+ '&MenuId=' + MenuId
      },
      // 通过文件路径下载文件 方法
      downLoadFile2(fileName, isTrue = true) {
        const baseURL = window.globalEnv.VUE_APP_BASE_API
        window.location.href = baseURL + '/common/downloadFile?fileName=' + encodeURI(fileName) + '&delete=' + isTrue+'&Authorization='+getToken()+ '&MenuId=' + MenuId
      }
    }
}
