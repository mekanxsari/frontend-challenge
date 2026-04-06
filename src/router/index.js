import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LikedPage from '../views/LikedPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/liked', component: LikedPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router