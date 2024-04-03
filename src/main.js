import {createApp} from 'vue';
import App from './App.vue';
import {dayjs} from 'element-plus';
import router from './router'
import store from './store'

import SvgIcon from '@/components/SvgIcon/index.vue';
import './permission.js'
import {net} from '@/api/requestList'
import '@/assets/styles/index.less'

const app = createApp(App);

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

app.use(ElementPlus, {
    locale: zhCn,
})
import 'dayjs/locale/zh-cn'
import pagination from '@/components/Pagination/index.vue'
import boDialog from "@/components/BoContainer/boDialog.vue";
import RightToolbar from "@/components/RightToolbar/index.vue"
import BoContainer from '@/components/BoContainer/boContainer.vue'
import BoMain from '@/components/BoContainer/boMain.vue'
import BoMain4DynamicList from '@/components/BoContainer/boMain4DynamicList.vue'
import MasterBanUi from '@/components/MasterBanUi/index.js'

app.use(MasterBanUi)
app.component('boDialog', boDialog)
app.component('pagination', pagination)
app.component('svg-icon', SvgIcon);
app.component('RightToolbar', RightToolbar)
app.component('BoContainer', BoContainer)
app.component('BoMain', BoMain)
app.component('BoMain4DynamicList', BoMain4DynamicList)

import {getDicts} from "@/api/system/dict/data.js";
import {checkPermi, checkRole} from "@/utils/permission";
// 将 dayjs 挂载到全局属性
app.config.globalProperties.$dayjs = dayjs;
app.config.globalProperties.$net = net;
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.$checkPermi = checkPermi
app.config.globalProperties.$checkRole = checkRole
app.use(router)
app.use(store)
// 如果需要使用插件，可以在这里注册
// dayjs.extend/pluginName

app.mount('#app');
