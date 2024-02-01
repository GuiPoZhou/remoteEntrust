import { createStore } from 'vuex'
import app from './modules/app.js'
import user from './modules/user.js'
import tagsView from './modules/tagsView.js'
import permission from './modules/permission.js'
import settings from './modules/settings.js'
import boshland from '@/store/modules/boshland/boshland.js'
import system from '@/store/system/index.js'
import masterBanUi from '@/store/modules/masterBanUi.js'
import BeiYuan from '@/store/modules/BeiYuan.js'
import menu from './modules/menu.js'
import getters from './getters.js'


const store = createStore({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    boshland,
    system,
    masterBanUi,
    BeiYuan,
    menu,
  },
  getters
})

export default store
