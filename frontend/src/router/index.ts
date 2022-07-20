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
      },
      {
        path: '/panel',
        name: 'panel',
        meta: { index: 4 },
        component: () => import('@/views/panel/index.vue')
      },
      {
        path: '/match-history',
        name: 'match-history',
        meta: { index: 5 },
        component: () => import('@/views/match-history/index.vue')
      },
      {
        path: '/func',
        name: 'func',
        meta: { index: 6 },
        component: () => import('@/views/func/index.vue')
      },
      {
        path: '/blacklist',
        name: 'blacklist',
        meta: { index: 7, keepAlive: true },
        component: () => import('@/views/blacklist/index.vue')
      },
      {
        path: '/hero-data',
        name: 'hero-data',
        meta: { index: 8 },
        component: () => import('@/views/hero-data/index.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        meta: { index: 9, keepAlive: true },
        component: () => import('@/views/settings/index.vue')
      },
      {
        path: '/auto-game',
        name: 'auto-game',
        meta: { index: 10, keepAlive: true },
        component: () => import('@/views/auto-game/index.vue')
      },
      {
        path: '/account',
        name: 'account',
        meta: { index: 10 },
        component: () => import('@/views/account/index.vue')
      }

    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router