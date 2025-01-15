import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/index.vue'
import Projects from '@/pages/projects.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/projects/:id',
      name: 'project-details',
      component: () => import('@/pages/project-details.vue')
    }
  ]
})

export default router
