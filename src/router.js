import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views
const DisplayPage = () => import('./views/DisplayPage.vue')
const InputPage = () => import('./views/InputPage.vue')

const routes = [
  { path: '/', redirect: '/input' },
  { path: '/display', name: 'Display', component: DisplayPage },
  { path: '/input', name: 'Input', component: InputPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
