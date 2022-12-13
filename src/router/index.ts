import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import DrugsView from "@/views/drugs.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/drugs'
  },
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/'
      },
      {
        path: 'drugs',
        name: "drugs",
        component: DrugsView
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      },

      {
        path: '/drugs/:id',
        name: "drugsCalculateDose",
        component: () => import('@/views/drugsCalculateDose.vue'),
      }
    ]
  },
  
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
