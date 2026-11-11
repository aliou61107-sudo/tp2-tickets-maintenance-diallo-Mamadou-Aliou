<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { createTicket } from '../services/ticketService.js'
import type { TicketCreateData, TicketInput } from '../types/ticket'

const router = useRouter()
const formulaire = reactive<TicketInput>({
  titre: '',
  description: '',
  demandeur: '',
  priorite: 'Basse',
  statut: 'Ouvert',
})
const erreur = ref('')
const enregistrement = ref(false)

async function enregistrer() {
  if (!formulaire.titre.trim() || !formulaire.description.trim() || !formulaire.demandeur.trim()) {
    erreur.value = 'Veuillez remplir le titre, la description et le demandeur.'
    return
  }
  erreur.value = ''
  enregistrement.value = true
  try {
    const data: TicketCreateData = {
      ...formulaire,
      statut: 'Ouvert',
      dateCreation: new Date().toISOString().slice(0, 10),
    }
    const ticket = await createTicket(data)
    await router.push(`/tickets/${ticket.id}`)
  } catch {
    erreur.value = 'Le ticket n’a pas pu être créé. Vérifiez que JSON Server est démarré.'
  } finally {
    enregistrement.value = false
  }
}
</script>

<template>
  <section class="panel form-panel" aria-labelledby="new-ticket-title">
    <div class="page-heading"><div><p class="eyebrow">Création</p><h2 id="new-ticket-title">Nouveau ticket</h2></div><RouterLink class="button button-secondary" to="/tickets">Retour à la liste</RouterLink></div>
    <form class="ticket-form" novalidate @submit.prevent="enregistrer">
      <div v-if="erreur" class="form-error" role="alert">{{ erreur }}</div>
      <div class="form-grid">
        <div class="field"><label for="new-title">Titre *</label><input id="new-title" v-model="formulaire.titre" required /></div>
        <div class="field"><label for="new-requester">Demandeur *</label><input id="new-requester" v-model="formulaire.demandeur" required /></div>
        <div class="field full-width"><label for="new-description">Description *</label><textarea id="new-description" v-model="formulaire.description" required rows="4"></textarea></div>
        <div class="field"><label for="new-priority">Priorité</label><select id="new-priority" v-model="formulaire.priorite"><option value="Basse">Basse</option><option value="Moyenne">Moyenne</option><option value="Haute">Haute</option></select></div>
        <div class="field"><label for="new-status">Statut</label><select id="new-status" v-model="formulaire.statut" disabled><option value="Ouvert">Ouvert</option><option value="En cours">En cours</option><option value="Résolu">Résolu</option><option value="Fermé">Fermé</option></select></div>
      </div>
      <button class="button button-primary" type="submit" :disabled="enregistrement">{{ enregistrement ? 'Enregistrement…' : 'Créer le ticket' }}</button>
    </form>
  </section>
</template>
