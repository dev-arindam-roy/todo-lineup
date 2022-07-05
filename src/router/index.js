import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView.vue'
import NotFound from '../views/NotFoundView.vue'

import store from '../store/index'
import axios from '../axios'

Vue.use(VueRouter)

const _numericRegx = /^\d+$/;

const routes = [
  {
    path: '/',
    name: 'root',
    component: LoginView,
    meta: { middleware: 'login' }
  },
  {
    path: '/create-account',
    name: 'createAccount',
    component: () => import(/* webpackChunkName: "createaccount" */ '../views/CreateAccountView.vue'),
    meta: { middleware: 'login' }
  },
  {
    path: '/task-list',
    name: 'taskList',
    component: () => import(/* webpackChunkName: "tasklist" */ '../views/task/TaskListView.vue'),
    meta: { middleware: 'auth' }
  },
  {
    path: '/create-task',
    name: 'addTask',
    component: () => import(/* webpackChunkName: "addtask" */ '../views/task/AddTaskView.vue'),
    meta: { middleware: 'auth' }
  },
  {
    path: '/edit-task/:id',
    name: 'editTask',
    component: () => import(/* webpackChunkName: "edittask" */ '../views/task/AddTaskView.vue'),
    meta: { middleware: 'auth' },
    beforeEnter: (to, from, next) => {
      if (!_numericRegx.test(to.params.id)) {
          next({name: '404'})
      }
      next()
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import(/* webpackChunkName: "addtask" */ '../views/LogoutView.vue'),
    meta: { middleware: 'auth' }
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
  },
  {
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach(async  (to, from, next) => {
  
  //middleware - login
  if (to.meta.middleware === 'login') {
    let getUserToken = localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signinUserToken')
    let getUserLoginStatus = store.state.isLoggedIn
    let getUserInfo = store.state.authUser
    if ((getUserToken != '' && getUserToken != null) || (getUserLoginStatus && (getUserInfo && getUserInfo != null))) {
      router.push({ name: 'taskList', query : { time : Date.now() }  })
    } else {
      next()
    }
  } else if (to.meta.middleware === 'auth') {
    //middleware - auth
    await axios({
      method: 'POST',
      url: 'is-token-valid',
    }).then(function (apiResponse) {
      store.commit('setIsLoggedIn', true);
      store.commit('setAuthUser', apiResponse.data.body.content.user);
      localStorage.setItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signinUserToken', apiResponse.data.body.content.user_token);
    }).catch(function (errorResponse) {
      console.log(errorResponse);
      router.push({ name : 'logout', query: { auth: 'error' } })
    })
    if (!store.state.isLoggedIn) {
      router.push({ name : 'logout', query: { auth: 'error' } })
    } else {
      next()
    }
  } else {
    next()
  }
})


export default router
