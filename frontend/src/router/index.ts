import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    meta: { index: 1 },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/client',
    name: 'layout',
    meta: { index: 2 },
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { index: 3 },
        component: () => import('@/views/dashboard/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router