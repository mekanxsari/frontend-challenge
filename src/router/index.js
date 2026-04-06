import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/frontend-challenge/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/liked',
      name: 'liked',
      component: () => import('@/views/LikedPage.vue')
    }
  ]
})

export default router