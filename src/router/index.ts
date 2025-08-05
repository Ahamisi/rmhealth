import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/outbound/auth'
  },
  {
    path: '/outbound',
    children: [
      {
        path: 'auth',
        name: 'OutboundAuth',
        component: () => import('@/modules/outbound/views/AuthView.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: 'dashboard',
        name: 'OutboundDashboard',
        component: () => import('@/modules/outbound/views/DashboardView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'orders',
        name: 'OutboundAllOrders',
        component: () => import('@/modules/outbound/views/AllOrdersView.vue'),
        meta: { requiresAuth: true }
      },
              {
          path: 'delivered-orders',
          name: 'OutboundDeliveredOrders',
          component: () => import('@/modules/outbound/views/DeliveredOrdersView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'log-book',
          name: 'OutboundLogBook',
          component: () => import('@/modules/outbound/views/LogBookView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'log-book/:id/view',
          name: 'OutboundViewLogBook',
          component: () => import('@/modules/outbound/views/ViewLogBookView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'log-book/:id/edit',
          name: 'OutboundEditLogBook',
          component: () => import('@/modules/outbound/views/EditLogBookView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'order-fulfilment',
          name: 'OutboundOrderFulfilment',
          component: () => import('@/modules/outbound/views/OrderFulfilmentView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'order-fulfilment/picking-list/:id',
          name: 'OutboundPickingList',
          component: () => import('@/modules/outbound/views/PickingListView.vue'),
          meta: { requiresAuth: true }
        },
      {
        path: 'edit-order/:id',
        name: 'EditOrder',
        component: () => import('../modules/outbound/views/EditOrderView.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/outbound/auth')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/outbound/dashboard')
  } else {
    next()
  }
})

export default router 