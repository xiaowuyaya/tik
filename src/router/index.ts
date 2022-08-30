import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
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
        component: () => import('../views/main/account.vue')
      },
      {
        path: '/autobp',
        name: 'autobp',
        meta: { keepAlive: true },
        component: () => import('../views/main/autoBP.vue')
      },
      {
        path: '/func',
        name: 'func',
        component: () => import('../views/main/func.vue')
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('../views/main/history.vue')
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/main/home.vue')
      },
      {
        path: '/panel',
        name: 'panel',
        component: () => import('../views/main/panel.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/main/setting.vue')
      },
      {
        path: '/blacklist',
        name: 'blacklist',
        component: () => import('../views/main/blacklist.vue')
      },
      {
        path: '/champdata',
        name: 'champdata',
        component: () => import('../views/main/champData.vue')
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
        path: '/champ-datail',
        name: 'champ-datail',
        component: () => import('../components/champData/ChampDetail.vue')
      },
      {
        path: '/skin',
        name: 'skin',
        component: () => import('../views/main/skin.vue')
      },
    ]
  },
  {
    path: '/champ-tool/rune',
    name:'champ-tool-rune',
    meta: {
      title: 'TIK RUNE'
    },
    component: () => import('../views/championTool/rune.vue')
  },
  {
    path: '/champ-tool/spells',
    name:'champ-tool-spells',
    meta: {
      title: 'TIK SPELLS'
    },
    component: () => import('../views/championTool/spells.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router