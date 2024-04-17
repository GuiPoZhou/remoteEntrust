import axios from 'axios'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: window.globalEnv.VUE_APP_BASE_API,
  // 超时
  timeout: 20000
})
// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['pageSource'] = 'company';//自定义参数 区分企业端和管理端
  }
  if (localStorage.getItem('menuId')) {
    config.headers['Menuid'] = localStorage.getItem('menuId') // 携带菜单id
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
        // console.log('接口调用', res);
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default']
        if (code === 401) {
            ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.href = 'http://mis.topscomm.net:8931/cas/login?service=http%3A%2F%2F172.20.5.160%3A6001%2Fremote%2FcustomerMain&createToken=false';
        })
      })
    } else if (code === 500) {
        ElMessage({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
        ElNotification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if(message == 'Request failed with status code 401'){
        ElMessage({
        dangerouslyUseHTMLString: true,
        message:`<strong><i>登录已过期，请重新登录</i></strong>`,
        type: 'error'
      })
      location.href = 'http://mis.topscomm.net:8931/cas/login?service=http%3A%2F%2F172.20.5.160%3A6001%2Fremote%2FcustomerMain&createToken=false'
      localStorage.clear()
      // location.href ='/index';
    }
    else{
        if (message == "Network Error") {
          message = "后端接口连接异常";
        }
        else if (message.includes("timeout")) {
          message = "系统接口请求超时";
        }
        else if (message.includes("Request failed with status code")) {
          message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        ElMessage({
          message: message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    return Promise.reject(error)
  }
)

export default service
