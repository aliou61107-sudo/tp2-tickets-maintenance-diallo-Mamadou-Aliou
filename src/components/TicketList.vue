<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { deleteTicket, getTickets, updateTicket } from '../services/ticketService.js'
import type { Ticket, TicketStatus } from '../types/ticket'

const tickets = ref<Ticket[]>([])
const recherche = ref('')
const statutFiltre = ref('')
const prioriteFiltre = ref('')
const chargement = ref(true)
const erreur = ref('')
const actionEnCours = ref('')

// Cette valeur est recalculée automatiquement quand la recherche ou un filtre change.
const ticketsVisibles = computed(() => {
  const rechercheNormalisee = recherche.value.trim().toLowerCase()
  return tickets.value.filter((ticket) => {
    const titreCorrespond = ticket.titre.toLowerCase().includes(rechercheNormalisee)
    const statutCorrespond = !statutFiltre.value || ticket.statut === statutFiltre.value
    const prioriteCorrespond = !prioriteFiltre.value || ticket.priorite === prioriteFiltre.value
    return titreCorrespond && statutCorrespond && prioriteCorrespond
  })
})

function badgeClass(value: string) {
  const classes: Record<string, string> = {
    Haute: 'badge-priority-high',
    Moyenne: 'badge-priority-medium',
    Basse: 'badge-priority-low',
    Ouvert: 'badge-status-open',
    'En cours': 'badge-status-progress',
    Résolu: 'badge-status-resolved',
    Fermé: 'badge-status-closed',
  }
  return classes[value] ?? ''
}

const nextStatus: Record<string, TicketStatus> = {
  Ouvert: 'En cours',
  'En cours': 'Résolu',
  Résolu: 'Fermé',
}

async function chargerTickets() {
  chargement.value = true
  erreur.value = ''
  try {
    tickets.value = await getTickets()
  } catch {
    erreur.value = 'Impossible de charger les tickets. Vérifiez que JSON Server est démarré sur le port 3000.'
  } finally {
    chargement.value = false
  }
}

async function changerStatut(ticket: Ticket) {
  const nouveauStatut = nextStatus[ticket.statut]
  if (!nouveauStatut) return
  actionEnCours.value = `status-${ticket.id}`
  erreur.value = ''
  try {
    const updatedTicket = await updateTicket(ticket.id, { statut: nouveauStatut })
    ticket.statut = updatedTicket.statut
  } catch {
    erreur.value = 'Le statut n’a pas pu être enregistré.'
  } finally {
    actionEnCours.value = ''
  }
}

async function supprimer(ticket: Ticket) {
  if (!window.confirm(`Voulez-vous vraiment supprimer le ticket « ${ticket.titre} » ?`)) return
  actionEnCours.value = `delete-${ticket.id}`
  erreur.value = ''
  try {
    await deleteTicket(ticket.id)
    tickets.value = tickets.value.filter((item) => item.id !== ticket.id)
  } catch {
    erreur.value = 'Le ticket n’a pas pu être supprimé.'
  } finally {
    actionEnCours.value = ''
  }
}

onMounted(chargerTickets)
</script>

<template>
  <section class="panel" aria-labelledby="ticket-list-title">
    <h2 id="ticket-list-title" class="visually-hidden">Liste des tickets</h2>
    <div class="filters">
      <div class="field">
        <label for="ticket-search">Rechercher par titre</label>
        <input id="ticket-search" v-model="recherche" type="search" placeholder="Ex. Imprimante" />
      </div>
      <div class="field">
        <label for="status-filter">Filtrer par statut</label>
        <select id="status-filter" v-model="statutFiltre">
          <option value="">Tous les statuts</option>
          <option>Ouvert</option><option>En cours</option><option>Résolu</option><option>Fermé</option>
        </select>
      </div>
      <div class="field">
        <label for="priority-filter">Filtrer par priorité</label>
        <select id="priority-filter" v-model="prioriteFiltre">
          <option value="">Toutes les priorités</option>
          <option>Haute</option><option>Moyenne</option><option>Basse</option>
        </select>
      </div>
    </div>

    <div v-if="chargement" class="state" role="status">Chargement…</div>
    <div v-else-if="erreur" class="state state-error" role="alert">{{ erreur }}</div>
    <template v-else>
      <div class="result-line" aria-live="polite">
        <span><strong>{{ ticketsVisibles.length }}</strong> ticket(s) visible(s)</span>
        <span v-if="tickets.length !== ticketsVisibles.length">sur {{ tickets.length }} au total</span>
      </div>
      <div v-if="ticketsVisibles.length" class="tickets">
        <article v-for="ticket in ticketsVisibles" :key="ticket.id" class="ticket-card">
          <div class="ticket-top">
            <h3 class="ticket-title">{{ ticket.titre }}</h3>
            <span class="badge" :class="badgeClass(ticket.priorite)">{{ ticket.priorite }}</span>
          </div>
          <p class="ticket-description">{{ ticket.description }}</p>
          <div class="ticket-meta">
            <span class="requester"><span>Demandeur</span><strong>{{ ticket.demandeur }}</strong></span>
            <span class="badges">
              <span class="badge" :class="badgeClass(ticket.statut)">{{ ticket.statut }}</span>
              <time :datetime="ticket.dateCreation">{{ ticket.dateCreation }}</time>
            </span>
          </div>
          <div class="ticket-actions">
            <RouterLink class="button button-secondary" :to="`/tickets/${ticket.id}`">Détail / modifier</RouterLink>
            <button
              v-if="nextStatus[ticket.statut]"
              class="button button-secondary"
              :disabled="actionEnCours === `status-${ticket.id}`"
              type="button"
              @click="changerStatut(ticket)"
            >
              {{ actionEnCours === `status-${ticket.id}` ? 'Enregistrement…' : `Passer à ${nextStatus[ticket.statut]}` }}
            </button>
            <button class="button button-danger" :disabled="actionEnCours === `delete-${ticket.id}`" type="button" @click="supprimer(ticket)">
              Supprimer
            </button>
          </div>
        </article>
      </div>
      <div v-else class="state">Aucun ticket ne correspond à votre recherche.</div>
    </template>
  </section>
</template>
