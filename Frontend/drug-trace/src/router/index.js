import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/distributor',
    name: 'distributor',
    // route level code-splitting
    // this generates a separate chunk (distributor.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "distributor" */ '../views/Distributor.vue')
  },
  {
    path: '/retailer',
    name: 'retailer',
    // route level code-splitting
    // this generates a separate chunk (retailer.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "retailer" */ '../views/Retailer.vue')
  },
  {
    path: '/addform',
    name: 'addForm',
    // route level code-splitting
    // this generates a separate chunk (addform.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "addform" */ '../views/addForm.vue')
  },
  {
    path: '/buyform',
    name: 'buyForm',
    // route level code-splitting
    // this generates a separate chunk (buyform.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "buyform" */ '../views/buyForm.vue')
  },
  {
    path: '/pending',
    name: 'pending',
    // route level code-splitting
    // this generates a separate chunk (pending.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "pending" */ '../views/Pending.vue')
  },
  {
    path: '/queryform',
    name: 'queryForm',
    // route level code-splitting
    // this generates a separate chunk (queryform.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "queryform" */ '../views/queryForm.vue')
  },
  {
    path: '/queryformr',
    name: 'queryFormr',
    // route level code-splitting
    // this generates a separate chunk (queryformr.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "queryformr" */ '../views/queryFormr.vue')
  },
  {
    path: '/recallform',
    name: 'recallForm',
    // route level code-splitting
    // this generates a separate chunk (recallform.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "recallform" */ '../views/recallForm.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
