import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../components/DashboardPage.vue'
import UpdatePage from '../components/UpdatePage.vue'
import FormPage from '../components/FormPage.vue'

const routes = [
    { path: '/', name: 'Dashboard', component: DashboardPage },
    { path: '/form', name: 'Form', component: FormPage },
    {
        path: '/update/:id',
        name: 'Update',
        component: UpdatePage,
        props: true
      }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
