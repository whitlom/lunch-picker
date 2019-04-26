import Vue from 'vue'
import Router from 'vue-router'
import firebase from '@/fb'

Vue.use(Router)

const router = new Router({

  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '*', redirect: '/home' },
    { path: '/', redirect: '/home' },
    { path: '/about',   name: 'about',    component: () => import('./views/About.vue') },
    { path: '/signin',  name: 'signin',   component: () => import('./views/SignIn.vue') },
    { path: '/signout', name: 'signout',  meta: { requiresAuth: true }, component: () => import('./views/SignOut.vue') },
    { path: '/home',    name: 'home',     meta: { requiresAuth: true }, component: () => import('./views/Home.vue')},
    { path: '/user',    name: 'user',     meta: { requiresAuth: true }, component: () => import('./views/User.vue')},
    { path: '/history', name: 'history',  meta: { requiresAuth: true }, component: () => import('./views/History.vue') },
  ]
});

router.beforeEach((to, from, next) => {
  // console.log("Fr => " + from.path + " To=> ", to.path);

  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // console.log("Current User => ", currentUser);

  if (requiresAuth && !currentUser) next ('/signin');
  // else if (!requiresAuth && currentUser) next('/home');
  else next();
});

export default router;
