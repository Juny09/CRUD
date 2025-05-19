import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../components/DashboardPage.vue'
import UpdatePage from '../components/UpdatePage.vue'
import FormPage from '../components/FormPage.vue'
import ProductPage from '../components/ProductPage.vue'
import LandingPage from '../components/LandingPage.vue'
import CatelogPage from '../components/CatelogPage.vue'

const routes = [
  { path: '/', name: 'Home', component: LandingPage },
  { path: '/form', name: 'Form', component: FormPage },
  { path: '/product', name: 'Product', component: ProductPage },
  { path: '/catalog', name: 'Catalog', component: CatelogPage },
  {
    path: '/update/:id',
    name: 'Update',
    component: UpdatePage,
    props: true
  },
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage },
  
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
