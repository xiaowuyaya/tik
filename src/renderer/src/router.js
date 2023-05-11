import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/Login',
  },
  {
    name: 'LoadingLaunch',
    path: '/LoadingLaunch',
    component: () => import('./views/LoadingLaunch.vue'),
  },
  {
    name: 'Login',
    path: '/Login',
    component: () => import('./views/Login.vue'),
  },
  {
    name: 'MainLayout',
    path: '/MainLayout',
    component: () => import('./components/MainLayout/index.vue'),
    children: [
      {
        path: '/AutoBan',
        name: 'AutoBan',
        component: () => import('./views/AutoBan.vue'),
      },
      {
        path: '/Blacklist',
        name: 'Blacklist',
        component: () => import('./views/Blacklist.vue'),
      },
      {
        path: '/ChampData',
        name: 'ChampData',
        component: () => import('./views/ChampData.vue'),
      },
      {
        path: '/CommonFunctions',
        name: 'CommonFunctions',
        component: () => import('./views/CommonFunctions.vue'),
      },
      {
        path: '/GamePanel',
        name: 'GamePanel',
        meta: { keepAlive: true },
        component: () => import('./views/GamePanel/index.vue'),
      },
      {
        path: '/PaidContent',
        name: 'PaidContent',
        component: () => import('./views/PaidContent/index.vue'),
      },
      {
        path: '/PaidServer101',
        name: 'PaidServer101',
        component: () => import('./views/PaidContent/PaidServer101.vue'),
      },
      {
        path: '/PaidServerBingxue',
        name: 'PaidServerBingxue',
        component: () => import('./views/PaidContent/PaidServerBingxue.vue'),
      },
      {
        path: '/SummonerInfo',
        name: 'SummonerInfo',
        component: () => import('./views/SummonerInfo.vue'),
      },
      {
        path: '/RecordQuery',
        name: 'RecordQuery',
        component: () => import('./views/SearchRecord/RecordQuery.vue'),
      },
      {
        path: '/RecordDetail',
        name: 'RecordDetail',
        component: () => import('./views/SearchRecord/RecordDetail.vue'),
      },
      {
        path: '/Settings',
        name: 'Settings',
        component: () => import('./views/Settings.vue'),
      },
    ],
  },
  {
    name: 'ToolsLayout',
    path: '/ToolsLayout',
    component: () => import('./components/ToolsLayout/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
