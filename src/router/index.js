import AddAction from '@/pages/add-action.vue';
import AddDevlopmentProject from '@/pages/add-devlopment-project.vue';
import AddFundedProject from '@/pages/add-funded-project.vue';
import AddProject from '@/pages/add-project.vue';
import Attachment from '@/pages/attachment.vue';
import Beneficiaries from '@/pages/beneficiaries.vue';
import ContractDetails from '@/pages/contract-details.vue';
import Contracts from '@/pages/contracts.vue';
import FundedProjects from '@/pages/funded-projects.vue';
import HistoryLog from '@/pages/history-log.vue';
import Home from '@/pages/index.vue';
import Login from '@/pages/login.vue';
import Map from '@/pages/map.vue';
import ProjectDetails from '@/pages/project-details.vue';
import ProjectModifications from '@/pages/project-modifications.vue';
import Projects from '@/pages/projects.vue';
import Reports from '@/pages/reports.vue';
import Settings from '@/pages/settings.vue';
import Tasks from '@/pages/tasks.vue';
import UserDetails from '@/pages/user-details.vue';
import Users from '@/pages/users.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
  },
  {
    path: '/projects/:id',
    name: 'project-details',
    component: ProjectDetails,
  },
  {
    path: '/modifications/:id?',
    name: 'modifications',
    component: ProjectModifications,
  },
  {
    path: '/map',
    name: 'map',
    component: Map,
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
  },
  {
    path: '/users/:id',
    name: 'user-details',
    component: UserDetails,
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/attachments',
    name: 'attachments',
    component: Attachment,
  },
  {
    path: '/add-action',
    name: 'add-action',
    component: AddAction,
  },
  {
    path: '/history-log',
    name: 'history-log',
    component: HistoryLog,
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: Tasks,
  },
  {
    path: '/beneficiaries',
    name: 'beneficiaries',
    component: Beneficiaries,
  },
  {
    path: '/contracts',
    name: 'contracts',
    component: Contracts,
  },
  {
    path: '/contracts/:id',
    name: 'contract-details',
    component: ContractDetails,
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
    meta: {
      requiresAuth: true,
      title: 'التقارير',
    },
  },
  {
    path: '/add-project',
    name: 'add-project',
    component: AddProject,
  },
  {
    path: '/add-devlopment-project',
    name: 'add-devlopment-project',
    component: AddDevlopmentProject,
  },
  {
    path: '/add-funded-project',
    name: 'add-funded-project',
    component: AddFundedProject,
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/pages/demo.vue'),
  },
  {
    path: '/funded-projects',
    name: 'funded-projects',
    component: FundedProjects,
  },
  {
    path: '/funded-projects/:id',
    name: 'funded-projects-details',
    component: () => import('@/pages/funded-projects-details.vue'),
    props: true,
  },
  {
    path: '/done',
    name: 'done',
    component: () => import('@/pages/done.vue'),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add navigation guard for debugging
router.beforeEach((to, from, next) => {
  if (to.name === 'funded-projects-details') {
    console.log('Navigating to project details:', to.params.id);
  }
  next();
});

export default router;
