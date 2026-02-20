import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('@/views/EmployeesView.vue'),
    meta: { title: 'Employees' }
  },
  {
    path: '/employees/new',
    name: 'NewEmployee',
    component: () => import('@/views/NewEmployeeView.vue'),
    meta: { title: 'Add Employee' }
  },
  {
    path: '/employees/:id',
    name: 'EmployeeDetail',
    component: () => import('@/views/EmployeeDetailView.vue'),
    meta: { title: 'Employee Details' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Update document title on navigation
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'CardPassTracker'} | CardPassTracker`
  next()
})

export default router
