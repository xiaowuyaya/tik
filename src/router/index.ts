import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/account'
  },
  {
    path: '/check_launch',
    name: 'check_launch',
    component: () => import('../pages/check-launch.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/index.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../pages/layout/layout.vue'),
    children: [
      {
        path: '/account',
        name: 'account',
        component: () => import('../pages/main/account.vue')
      },
      {
        path: '/func',
        name: 'func',
        // meta: { keepAlive: true },
        component: () => import('../pages/main/func.vue')
      },
      {
        path: '/search-content',
        name: 'search-content',
        component: () => import('../components/history/BaseContent.vue')
      },
      {
        path: '/matches-datail',
        name: 'matches-datail',
        component: () => import('../components/history/MatchesDetail.vue')
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('../pages/main/history.vue')
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../pages/main/home.vue')
      },
      {
        path: '/panel',
        name: 'panel',
        component: () => import('../pages/main/panel.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('../pages/main/setting.vue')
      },
      {
        path: '/blacklist',
        name: 'blacklist',
        component: () => import('../pages/main/blacklist.vue')
      },
      {
        path: '/chat',
        name: 'chat',
        component: () => import('../pages/main/chat.vue')
      },
      {
        path: '/champdata',
        name: 'champdata',
        component: () => import('../pages/main/champData.vue')
      },
      {
        path: '/champ-datail',
        name: 'champ-datail',
        component: () => import('../components/champData/ChampDetail.vue')
      }
    ]
  },
  {
    path: '/champ-tool/rune',
    name:'champ-tool-rune',
    meta: {
      title: 'TIK RUNE'
    },
    component: () => import('../pages/championTool/rune.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router