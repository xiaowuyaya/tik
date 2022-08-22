import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../components/layout/Layout.vue'),
    children: [
      {
        path: '/account',
        name: 'account',
        component: () => import('../views/main/Account.vue')
      },
      {
        path: '/autobp',
        name: 'autobp',
        component: () => import('../views/main/AutoBP.vue')
      },
      {
        path: '/func',
        name: 'func',
        component: () => import('../views/main/Func.vue')
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('../views/main/History.vue')
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/main/home.vue')
      },
      {
        path: '/panel',
        name: 'panel',
        component: () => import('../views/main/Panel.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/main/Setting.vue')
      },
      {
        path: '/blacklist',
        name: 'blacklist',
        component: () => import('../views/main/Blacklist.vue')
      },
      {
        path: '/champdata',
        name: 'champdata',
        component: () => import('../views/main/ChampData.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router