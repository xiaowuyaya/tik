import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/check_launch',
    name: 'check_launch',
    component: () => import('@/pages/loading.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/account',
        name: 'account',
        component: () => import('@/pages/main/account.vue')
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/main/home.vue')
      },
      {
        path: '/func',
        name: 'func',
        component: () => import('@/pages/main/func.vue')
      },
      {
        path: '/panel',
        name: 'panel',
        component: () => import('@/pages/main/panel.vue')
      },
      {
        path: '/blacklist',
        name: 'blacklist',
        component: () => import('@/pages/main/blacklist.vue')
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('@/pages/main/history.vue')
      },
      {
        path: '/chat',
        name: 'chat',
        component: () => import('@/pages/main/chat.vue')
      },
      {
        path: '/search-content',
        name: 'search-content',
        component: () => import('@/components/history/SummonerInfo.vue')
      },
      {
        path: '/matches-datail',
        name: 'matches-datail',
        component: () => import('@/components/history/MatchesDetail.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('@/pages/main/settings.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router