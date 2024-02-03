import {createApp} from 'vue';
import App from './App.vue';
import {dayjs} from 'element-plus';
import router from './router'
import store from './store'

import SvgIcon from '@/components/SvgIcon/index.vue';
import './permission.js'
import {net} from '@/api/requestList'

const app = createApp(App);

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.component('svg-icon', SvgIcon);

// 将 dayjs 挂载到全局属性
app.config.globalProperties.$dayjs = dayjs;
app.config.globalProperties.$net = net;
app.use(router)
app.use(store)
// 如果需要使用插件，可以在这里注册
// dayjs.extend/pluginName

app.mount('#app');
