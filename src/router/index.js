import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from '@/store/auth'
import LoginView from '@/views/LoginView.vue'
import TasksView from '@/views/TasksView.vue'
import TaskFormView from '@/views/TaskFormView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TeamView from '@/views/TeamView.vue'
import ExportView from '@/views/ExportView.vue'
import UserFormView from '@/views/UserFormView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { public: true, guest: true, hideChrome: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { public: true, guest: true, hideChrome: true } },
  
  { path: '/', redirect: '/tasks' },
  { path: '/tasks', name: 'tasks', component: TasksView },
  { path: '/tarefa/nova', name: 'task-new', component: TaskFormView },
  { path: '/tarefa/:id/editar', name: 'task-edit', component: TaskFormView, props: true },
  { path: '*', redirect: '/tasks' },

  { path: '/equipe', name: 'team', component: TeamView },

  { path: '/users/new', name: 'user-new', component: UserFormView },
  { path: '/users/:id/edit', name: 'user-edit', component: UserFormView, props: true },

  { path: '/exports/:uuid',  name: 'export', component: ExportView },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const isAuth = auth.getters.isAuthenticated()

  if (!to.meta.public && !isAuth) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (to.meta.guest && isAuth) {
    return next({ name: 'tasks' })
  }

  next()
})

export default router
