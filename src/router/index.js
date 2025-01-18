import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/index.vue'
import Projects from '@/pages/projects.vue'
import Users from '@/pages/users.vue'
import Login from '@/pages/login.vue'
import ProjectDetails from '@/pages/project-details.vue'
import ProjectModifications from '@/pages/project-modifications.vue'
import Map from '@/pages/map.vue'
import Settings from '@/pages/settings.vue'
import Attachment from '@/pages/attachment.vue'
import AddAction from '@/pages/add-action.vue'
import HistoryLog from '@/pages/history-log.vue'
import Tasks from '@/pages/tasks.vue'
import Contracts from '@/pages/contracts.vue'
import Beneficiaries from '@/pages/beneficiaries.vue'
import ContractDetails from '@/pages/contract-details.vue'
import UserDetails from '@/pages/user-details.vue'
import AddProject from '@/pages/add-project.vue'
import Reports from '@/pages/reports.vue'
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
      path: '/users/:id',
      name: 'user-details',
      component: UserDetails
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
    },
    {
      path: '/attachments',
      name: 'attachments',
      component: Attachment
    },
    {
      path: '/add-action',
      name: 'add-action',
      component: AddAction
    },
    {
      path: '/history-log',
      name: 'history-log',
      component: HistoryLog
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks
    },
    {
      path: '/beneficiaries',
      name: 'beneficiaries',
      component: Beneficiaries
    },
    {
      path: '/contracts',
      name: 'contracts',
      component: Contracts
    },
    {
      path: '/contracts/:id',
      name: 'contract-details',
      component: ContractDetails
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports,
      meta: {
        requiresAuth: true,
        title: 'التقارير'
      }
    },
    {
      path: '/add-project',
      name: 'add-project',
      component: AddProject,
    }
  ]
})

export default router