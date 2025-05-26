import About from '@/pages/about.vue';
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
import RegionalProjects from '@/pages/regional-projects.vue';
import Reports from '@/pages/reports.vue';
import Settings from '@/pages/settings.vue';
import Tasks from '@/pages/tasks.vue';
import UserDetails from '@/pages/user-details.vue';
import Users from '@/pages/users.vue';

import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: { requiresAuth: true },
  },
  {
    path: '/projects/:id',
    name: 'project-details',
    component: ProjectDetails,
    meta: { requiresAuth: true },
  },
  {
    path: '/modifications/:id?',
    name: 'modifications',
    component: ProjectModifications,
    meta: { requiresAuth: true },
  },
  {
    path: '/map',
    name: 'map',
    component: Map,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    meta: { requiresAuth: true },
  },
  {
    path: '/users/:id',
    name: 'user-details',
    component: UserDetails,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
  {
    path: '/add-action',
    name: 'add-action',
    component: AddAction,
    meta: { requiresAuth: true },
  },
  {
    path: '/history-log',
    name: 'history-log',
    component: HistoryLog,
    meta: { requiresAuth: true },
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: Tasks,
    meta: { requiresAuth: true },
  },
  {
    path: '/beneficiaries',
    name: 'beneficiaries',
    component: Beneficiaries,
    meta: { requiresAuth: true },
  },
  {
    path: '/contracts',
    name: 'contracts',
    component: Contracts,
    meta: { requiresAuth: true },
  },
  {
    path: '/contracts/:id',
    name: 'contract-detail',
    component: ContractDetails,
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
    meta: { requiresAuth: true },
  },
  {
    path: '/add-project',
    name: 'add-project',
    component: AddProject,
    meta: { requiresAuth: true },
  },
  {
    path: '/add-devlopment-project',
    name: 'add-devlopment-project',
    component: AddDevlopmentProject,
    meta: { requiresAuth: true },
  },
  {
    path: '/add-funded-project',
    name: 'add-funded-project',
    component: AddFundedProject,
    meta: { requiresAuth: true },
  },
  {
    path: '/funded-projects',
    name: 'funded-projects',
    component: FundedProjects,
    meta: { requiresAuth: true },
  },
  {
    path: '/funded-projects/:id',
    name: 'funded-projects-details',
    component: () => import('@/pages/funded-projects-details.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/regional-projects',
    name: 'regional-projects',
    component: RegionalProjects,
    meta: { requiresAuth: true },
  },
  {
    path: '/regional-projects/:id',
    name: 'regional-project-details',
    component: () => import('@/pages/regional-project-details.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/done',
    name: 'done',
    component: () => import('@/pages/done.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/demo-projects/:type',
    name: 'demo-projects',
    component: () => import('@/pages/demo-projects.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const authStore = useAuthStore();

  // If the route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Store the intended destination in the redirect query parameter
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  // If user is authenticated and tries to access login page
  if (to.path === '/login' && authStore.isAuthenticated) {
    // If there's a redirect query, use it, otherwise go to home
    const redirectPath = to.query.redirect?.toString() || '/';
    next(redirectPath);
    return;
  }

  next();
});

export default router;
