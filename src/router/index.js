
import { createRouter, createWebHistory } from 'vue-router';

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
    component: () => import('@/views/customerMain/index.vue'),
    hidden: true,
    children: [
      {
        path: '/remote/customerMain',
        name: 'indexCustomer',
        component: (resolve) => import('@/views/customerMain.vue'),
      },
    ]
  },
  {
    path: '/404',
    component: (resolve) => import('@/views/error/404.vue'),
    hidden: true,
  },
  {
    path: '/401',
    component: (resolve) => import('@/views/error/401.vue'),
    hidden: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;
