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
    const ticket = getURLParameter('ticket');

    if (ticket) {
      const params = {ticket}
      net('/topscommSSO/serviceValidateRemote', {params}, 'post').then(res => {
        if (res.code === 200) {
          setToken(res.token)
          window.location.href = 'http://172.20.5.160:6001/remote/customerMain'
        } else if (res.code === 500 && res.msg.includes('不存在')) {
          window.location.href = 'http://mis.topscomm.net:8931/cas/login?service=http%3A%2F%2F172.20.5.160%3A6001%2Fremote%2FcustomerMain&createToken=false'
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next(`/remote/login?redirect=${encodeURIComponent(to.fullPath)}`)
        NProgress.done()
      }
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
