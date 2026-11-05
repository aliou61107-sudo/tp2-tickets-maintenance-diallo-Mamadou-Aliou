<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getTickets } from '../services/ticketService.js'

interface Ticket {
  id: string
  titre: string
  description: string
  demandeur: string
  priorite: 'Haute' | 'Moyenne' | 'Basse'
  statut: 'Ouvert' | 'En cours' | 'Résolu'
  dateCreation: string
}

const tickets = ref<Ticket[]>([])
const recherche = ref('')
const statutFiltre = ref('')
const prioriteFiltre = ref('')
const chargement = ref(true)
const erreur = ref('')

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

// Les valeurs reçues par l'API sont associées aux classes CSS des badges.
function badgeClass(value: string) {
  const classes: Record<string, string> = {
    Haute: 'badge-priority-high',
    Moyenne: 'badge-priority-medium',
    Basse: 'badge-priority-low',
    Ouvert: 'badge-status-open',
    'En cours': 'badge-status-progress',
    Résolu: 'badge-status-resolved',
  }
  return classes[value] ?? ''
}

async function chargerTickets() {
  // Les états sont remis à zéro avant chaque chargement pour éviter d'afficher
  // une ancienne erreur pendant la nouvelle requête.
  chargement.value = true
  erreur.value = ''

  try {
    tickets.value = await getTickets()
  } catch {
    erreur.value =
      'Impossible de charger les tickets. Vérifiez que JSON Server est démarré sur le port 3000.'
  } finally {
    chargement.value = false
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
        <input
          id="ticket-search"
          v-model="recherche"
          type="search"
          placeholder="Ex. Imprimante"
        />
      </div>
      <div class="field">
        <label for="status-filter">Filtrer par statut</label>
        <select id="status-filter" v-model="statutFiltre">
          <option value="">Tous les statuts</option>
          <option value="Ouvert">Ouvert</option>
          <option value="En cours">En cours</option>
          <option value="Résolu">Résolu</option>
        </select>
      </div>
      <div class="field">
        <label for="priority-filter">Filtrer par priorité</label>
        <select id="priority-filter" v-model="prioriteFiltre">
          <option value="">Toutes les priorités</option>
          <option value="Haute">Haute</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Basse">Basse</option>
        </select>
      </div>
    </div>

    <div v-if="chargement" class="state" role="status">Chargement…</div>

    <div v-else-if="erreur" class="state state-error" role="alert">
      <strong>Erreur de connexion</strong>
      <span>{{ erreur }}</span>
    </div>

    <template v-else>
      <div class="result-line" aria-live="polite">
        <span><strong>{{ ticketsVisibles.length }}</strong> ticket(s) visible(s)</span>
        <span v-if="tickets.length !== ticketsVisibles.length">
          sur {{ tickets.length }} au total
        </span>
      </div>

      <div v-if="ticketsVisibles.length" class="tickets">
        <article v-for="ticket in ticketsVisibles" :key="ticket.id" class="ticket-card">
          <div class="ticket-top">
            <h3 class="ticket-title">{{ ticket.titre }}</h3>
            <span class="badge" :class="badgeClass(ticket.priorite)">
              {{ ticket.priorite }}
            </span>
          </div>
          <p class="ticket-description">{{ ticket.description }}</p>
          <div class="ticket-meta">
            <span class="requester">
              <span>Demandeur</span>
              <strong>{{ ticket.demandeur }}</strong>
            </span>
            <span class="badges">
              <span class="badge" :class="badgeClass(ticket.statut)">
                {{ ticket.statut }}
              </span>
              <time :datetime="ticket.dateCreation">{{ ticket.dateCreation }}</time>
            </span>
          </div>
        </article>
      </div>

      <div v-else class="state">Aucun ticket ne correspond à votre recherche.</div>
    </template>
  </section>
</template>
