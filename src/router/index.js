import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/index.vue'
import Projects from '@/pages/projects.vue'
import Users from '@/pages/users.vue'
import Login from '@/pages/login.vue'
import ProjectDetails from '@/pages/project-details.vue'
import ProjectModifications from '@/pages/project-modifications.vue'
import Map from '@/pages/map.vue'
import Settings from '@/pages/settings.vue'

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
      component: ProjectDetails
    },
    {
      path: '/modifications/:id?',
      name: 'modifications',
      component: ProjectModifications
    },
    {
      path: '/map',
      name: 'map',
      component: Map
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

export default router