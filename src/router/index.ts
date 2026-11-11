import { createRouter, createWebHistory } from 'vue-router'
import TicketList from '../components/TicketList.vue'
import TicketForm from '../components/TicketForm.vue'
import TicketDetail from '../components/TicketDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tickets' },
    { path: '/tickets', component: TicketList },
    { path: '/tickets/nouveau', component: TicketForm },
    { path: '/tickets/:id', component: TicketDetail },
  ],
})

export default router
