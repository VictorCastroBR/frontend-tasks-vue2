import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from '@/store/auth'
import LoginView from '@/views/LoginView.vue'
import TasksView from '@/views/TasksView.vue'
import TaskFormView from '@/views/TaskFormView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
  { path: '/', redirect: '/tasks' },
  { path: '/tasks', name: 'tasks', component: TasksView },
  { path: '/tarefa/nova', name: 'task-new', component: TaskFormView },
  { path: '/tarefa/:id/editar', name: 'task-edit', component: TaskFormView, props: true },
  { path: '*', redirect: '/tasks' }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.public && !auth.getters.isAuthenticated()) {
    return next({ name: 'login' })
  }
  next()
})

export default router
