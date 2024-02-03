import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {Encrypt} from "@/utils/encryption";

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    nickName:'',
    deptName:'',
    user: {},
  },

  mutations: {
    SET_DEPTNAME: (state, deptName) => {
      state.deptName = deptName
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      console.log('验证')
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      const newpwd = Encrypt(password)
      const pageSource = userInfo.pageSource;
      return new Promise((resolve, reject) => {
        login(username, newpwd, code, uuid,pageSource).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      console.log('获取用户信息')
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          console.log('带token', res)
          const user = res.user
          commit('SET_USER',res.user)
          let avatar = user.avatar == "" ? import("@/assets/image/profile.jpg") : window.globalEnv.VUE_APP_BASE_API + user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          commit('SET_NICKNAME',user.nickName)
          commit('SET_DEPTNAME', user.deptName)
          console.log(3333)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
