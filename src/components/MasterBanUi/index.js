// 引入分页组件文件
import mlForm from './JSXForm/jsxform.vue'
import mlEdit from './JSXForm/editFormItem.vue'
import mlCode from './JSXForm/codeIcon.vue'
import mlEditor from './JSXForm/codeEditor.vue'
import mlDiaLog from './mlDialog/mlDialog.vue'
import mlTable from './mlTable/mlTable.vue'
import kevinForm from './KevinUi/kevinForm.vue'
import kevinLog from './KevinUi/kevinLog.vue'

const coms = [
    mlForm, mlEdit, mlCode, mlEditor, mlDiaLog, mlTable, kevinForm, kevinLog
]; // 将来如果有其它组件,都可以写到这个数组里
// 批量组件注册
const install = function (Vue) {
    coms.forEach((com) => {
        Vue.component(com.name, com);
    });
};
export default install; // 这个方法以后再使用的时候可以被use调用
