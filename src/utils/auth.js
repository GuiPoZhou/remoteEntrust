const TokenKey = 'Company-Admin-Token'
let logoutTimerId // 声明一个全局计时器 ID
let token
import { ElMessageBox  } from 'element-plus';
export function getToken() {
  token = localStorage.getItem(TokenKey)
  startLogoutTimer() // 获取 Token 时开始计时
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  startLogoutTimer() // 设置 Token 时开始计时
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  stopLogoutTimer() // 移除 Token 时停止计时
  localStorage.removeItem('menuId')
  return localStorage.removeItem(TokenKey)
}

function startLogoutTimer() {
  clearTimeout(logoutTimerId) // 在开始之前先清除之前的计时器
  if (token) {
      // 开始一个新的计时器，在一小时后执行注销函数
      logoutTimerId = setTimeout(() => {
        logout()
      },  60 * 60 *1000) // 60分钟 * 60秒 * 1000毫秒 = 1小时
    }
}

function stopLogoutTimer() {
  clearTimeout(logoutTimerId) // 停止计时器
}

function logout() {
  ElMessageBox.alert('因长时间未操作，请重新登录', '注意', {
      confirmButtonText: '确定',
      callback: action => {
          removeToken()
          location.href = '/index'
      }
  });
  // 执行注销操作，例如清除 Token 并跳转到登录页
  // 这里可以自定义你的注销逻辑
}
