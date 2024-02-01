import { constantRoutes } from '@/router/index.js'
import { getRouters } from '@/api/menu'
const permission = {
  state: {
    routes: [],
    addRoutes: [],
    menu: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        resolve([])
        getRouters().then(res => {
          const accessedRoutes = checkRouters(res.data)
          // const accessedRoutes = filterAsyncRouter(res.data)
          // accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', accessedRoutes)
          resolve([])
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = ''
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

const checkRouters = (routes) => {
    return routes.children.map(item => {
      return {
        menuId: item.menuId,
        menuName: item.menuName,
        path: item.path,
        hasRole: ['*:*',"staff", "company", "companyAdmin"],
      }
    })

}

export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => {
   return import(
       /* @vite-ignore */
       `@/views/${view}`
       )
  }
}

export default permission
