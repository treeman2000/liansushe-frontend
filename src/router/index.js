import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const Profile = () => import('../views/Profile.vue')
const VR = () =>import('../views/VR.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/vr/:fileName',
    name: 'VR',
    component: VR
  }
]

const router = new VueRouter({
  routes
})

export default router
