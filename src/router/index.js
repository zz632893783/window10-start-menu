import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import grid from '../views/grid.vue'
import home2 from '../views/home2.vue'
import home3 from '../views/home3.vue'
import home4 from '../views/home4.vue'
import home5 from '../views/home5.vue'
import home6 from '../views/home6.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
}, {
    path: '/grid',
    name: 'grid',
    component: grid
}, {
    path: '/home2',
    name: 'home2',
    component: home2
}, {
    path: '/home3',
    name: 'home3',
    component: home3
}, {
    path: '/home4',
    name: 'home4',
    component: home4
}, {
    path: '/home5',
    name: 'home5',
    component: home5
}, {
    path: '/home6',
    name: 'home6',
    component: home6
}]

const router = new VueRouter({
    routes
})

export default router
