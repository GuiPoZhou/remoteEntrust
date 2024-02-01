
import { createRouter, createWebHistory } from 'vue-router';
// 如果你希望使用 history 模式而不是 hash 模式，请使用 createWebHistory 替换 createWebHashHistory
// import { createRouter, createWebHistory } from 'vue-router';

// 引入对应的组件
// import Layout from '@/layout/index.vue'; // 注意：Vue 3 中导入的文件应以 .vue 结尾

// 其他组件导入...

export const constantRoutes = [
  {
    path: '/',
    redirect: '/remote/login',
  },
  {
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect.vue'), // 使用动态导入语法
    hidden: true,
  },
  // ...其他路由配置项
  {
    path: '/remote/login',
    component: (resolve) => import('@/views/login.vue'),
    hidden: true,
  },
  {
    path: '/newEntrust',
    name: 'newEntrust',
    component: () => import('@/views/customerMain/company/newEntrust.vue'),
    hidden: true,
    children: [
      {
        path: '/remote/customerMain',
        name:'indexCustomer',
        component: (resolve) => import('@/views/customerMain.vue'),
        children: [
          {
            path: '/remote/customerMain',
            name:'indexCustomer',
            component: (resolve) => import('@/views/customerMain/company/indexCustomer'),
          }
        ]
      },
      // {
      //   path: '/remote/entrust',
      //   name: 'entrust',
      //   component:  (resolve) => import('@/views/customerMain/company/entrust'),
      //   meta: { title: '委托报检', icon: 'dashboard', noCache: true, affix: true,
      //     keepAlive:true,
      //     isBack:false, //用于判断上一个页面是哪个
      //   },
      // },
      // {
      //   path: '/remote/allReport',
      //   name: 'allReport',
      //   component: (resolve) => import('@/views/customerMain/company/entrustCommponents/allReport'),
      // },
      // {
      //   path: '/remote/entrustDetail',
      //   name: 'entrustDetail',
      //   component:  (resolve) => import('@/views/customerMain/company/components/entrustDetail'),
      //   meta: { title: '委托信息copy', icon: 'dashboard', noCache: true, affix: true },
      // },
      // {
      //   path: '/remote/sampleInfo',
      //   name: 'sampleInfo',
      //   component:  (resolve) => import('@/views/customerMain/company/components/sampleInfo'),
      //   meta: { title: '样品信息', icon: 'dashboard', noCache: true, affix: true },
      //
      // },
      // {
      //   path: '/remote/users',
      //   name: 'users',
      //   component:  (resolve) => import('@/views/customerMain/company/users'),
      //   meta: { title: '用户管理', icon: 'dashboard', noCache: true, affix: true },
      // },
      // {
      //   path: '/remote/restKey',
      //   name: 'restKey',
      //   component:  (resolve) => import('@/views/customerMain/company/components/restKey'),
      //   meta: { title: '修改密码', icon: 'dashboard', noCache: true, affix: true },
      // },
      // {
      //   path: '/system',
      //   name: 'system',
      //   component:  (resolve) => import('@/views/customerMain/system/index'),
      //   meta: { title: '系统管理', icon: 'dashboard', noCache: true, affix: true },
      // },
      // {
      //   path: '/allReport',
      //   name: 'allReportList',
      //   component: (resolve) => import('@/views/customerMain/company/entrustCommponents/allReport'),
      // },
      // {
      //   path: '/allMsg',
      //   name: 'allMsg',
      //   component: (resolve) => import('@/views/customerMain/company/entrustCommponents/allMsg'),
      // },
      // {
      //   path: '/bottomT',
      //   name: 'bottomT',
      //   component: (resolve) => import('@/views/components/entrustTable/index.vue')
      // },
      // {
      //   path: '/remote/company',
      //   name: 'company',
      //   component:  (resolve) => import('@/views/customerMain/company/company'),
      //   meta: { title: '企业信息', icon: 'dashboard', noCache: true, affix: true },
      // },
      // {
      //   path: '/messageList',
      //   name: 'message',
      //   component: (resolve) => import('@/views/components/allMsgReport/index.vue'),
      //   meta: { title: '消息列表', icon: 'dashboard', noCache: true, affix: true }
      // }
    ]
  },
  {
    path: '/404',
    component: (resolve) => import('@/views/error/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: (resolve) => import('@/views/error/401'),
    hidden: trueimport
  },

  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) =>
            import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' },
      },
    ],
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;
