import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/index.vue'
import Projects from '@/pages/projects.vue'
import Users from '@/pages/users.vue'

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
    },
    {
      path: '/modifications/:id?',
      name: 'modifications',
      component: () => import('@/pages/project-modifications.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/pages/map.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/users.vue')
    }
  ]
})

export default router
