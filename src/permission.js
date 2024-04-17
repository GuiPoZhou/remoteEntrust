import router from './router/index.js'
import store from './store/index.js'
import {ElMessage} from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken, setToken} from '@/utils/auth.js'
import {net} from '@/api/requestList.js'

NProgress.configure({showSpinner: false})

// 白名单保持不变
const whiteList = ['/remote/login', '/auth-redirect', '/bind', '/register', '/pathA', '/pathB']

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = getToken()
  if (token) {
    if (to.path === '/remote/login') {
      next({path: '/remote/customerMain'})
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        console.log('store', store)
        store.dispatch('GetInfo').then(res => {
          console.log('回调', res)
          const roles = res.roles
          store.dispatch('GenerateRoutes', {roles}).then(accessRoutes => {
            // router.addRoute(...accessRoutes)
            next({...to, replace: true})
          })
        }).catch(err => {
          store.dispatch('FedLogOut')
          ElMessage.error(err)
          next('/')
        })
      } else {
        next()
      }
    }
  } else {
      if (whiteList.includes(to.path)) {
          next()
      } else {
          next(`/remote/login?redirect=${encodeURIComponent(to.fullPath)}`)
          NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
    if (value && value instanceof Array && value.length > 0) {
        const permissions = store.getters && store.getters.permissions
        const permissionDatas = value
        const all_permission = "*:*:*";

        const hasPermission = permissions.some(permission => {
            return all_permission === permission || permissionDatas.includes(permission)
        })

        if (!hasPermission) {
            return false
        }
        return true
    } else {
        console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
        return false
    }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
    if (value && value instanceof Array && value.length > 0) {
        const roles = store.getters && store.getters.roles
        const permissionRoles = value
        const super_admin = "admin";

        const hasRole = roles.some(role => {
            return super_admin === role || permissionRoles.includes(role)
        })

        if (!hasRole) {
            return false
        }
        return true
    } else {
        console.error(`need roles! Like checkRole="['admin','editor']"`)
        return false
    }
}