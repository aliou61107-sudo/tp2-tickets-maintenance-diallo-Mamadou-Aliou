<script setup lang="ts">
import axios from 'axios'
import { reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { deleteTicket, getTicket, updateTicket } from '../services/ticketService.js'
import type { Ticket, TicketInput } from '../types/ticket'

const route = useRoute()
const router = useRouter()
const ticket = ref<Ticket | null>(null)
const chargement = ref(true)
const introuvable = ref(false)
const erreur = ref('')
const enregistrement = ref(false)
const suppressionEnCours = ref(false)
const formulaire = reactive<Partial<TicketInput>>({})

async function chargerTicket() {
  chargement.value = true
  introuvable.value = false
  erreur.value = ''
  ticket.value = null
  try {
    const loadedTicket = await getTicket(String(route.params.id))
    ticket.value = loadedTicket
    Object.assign(formulaire, loadedTicket)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      introuvable.value = true
    } else {
      erreur.value = 'Impossible de charger ce ticket. Vérifiez que JSON Server est démarré.'
    }
  } finally {
    chargement.value = false
  }
}

async function enregistrer() {
  if (
    !ticket.value ||
    !formulaire.titre?.trim() ||
    !formulaire.description?.trim() ||
    !formulaire.demandeur?.trim()
  ) {
    erreur.value = 'Les champs titre, description et demandeur sont obligatoires.'
    return
  }
  enregistrement.value = true
  erreur.value = ''
  try {
    ticket.value = await updateTicket(ticket.value.id, formulaire)
    Object.assign(formulaire, ticket.value)
  } catch {
    erreur.value = 'Les modifications n’ont pas pu être enregistrées.'
  } finally {
    enregistrement.value = false
  }
}

async function supprimer() {
  if (!ticket.value || !window.confirm(`Voulez-vous vraiment supprimer le ticket « ${ticket.value.titre} » ?`)) return
  suppressionEnCours.value = true
  try {
    await deleteTicket(ticket.value.id)
    await router.push('/tickets')
  } catch {
    erreur.value = 'Le ticket n’a pas pu être supprimé.'
  } finally {
    suppressionEnCours.value = false
  }
}

watch(() => route.params.id, chargerTicket, { immediate: true })
</script>

<template>
  <section class="panel form-panel">
    <div v-if="chargement" class="state" role="status">Chargement…</div>
    <div v-else-if="introuvable" class="state state-error" role="alert">
      <strong>Ticket introuvable</strong>
      <span>L’identifiant demandé ne correspond à aucun ticket.</span>
      <RouterLink class="button button-secondary" to="/tickets">Retour à la liste</RouterLink>
    </div>
    <div v-else-if="erreur" class="state state-error" role="alert">{{ erreur }}</div>
    <template v-else-if="ticket">
      <div class="page-heading"><div><p class="eyebrow">Détail et modification</p><h2>{{ ticket.titre }}</h2></div><RouterLink class="button button-secondary" to="/tickets">Retour à la liste</RouterLink></div>
      <form class="ticket-form" @submit.prevent="enregistrer">
        <div v-if="erreur" class="form-error" role="alert">{{ erreur }}</div>
        <div class="form-grid">
          <div class="field"><label for="edit-title">Titre *</label><input id="edit-title" v-model="formulaire.titre" required /></div>
          <div class="field"><label for="edit-requester">Demandeur *</label><input id="edit-requester" v-model="formulaire.demandeur" required /></div>
          <div class="field full-width"><label for="edit-description">Description *</label><textarea id="edit-description" v-model="formulaire.description" required rows="4"></textarea></div>
          <div class="field"><label for="edit-priority">Priorité</label><select id="edit-priority" v-model="formulaire.priorite"><option>Basse</option><option>Moyenne</option><option>Haute</option></select></div>
          <div class="field"><label for="edit-status">Statut</label><select id="edit-status" v-model="formulaire.statut"><option>Ouvert</option><option>En cours</option><option>Résolu</option><option>Fermé</option></select></div>
        </div>
        <p class="detail-date">Date de création : <strong>{{ ticket.dateCreation }}</strong></p>
        <div class="ticket-actions"><button class="button button-primary" type="submit" :disabled="enregistrement">{{ enregistrement ? 'Enregistrement…' : 'Enregistrer les modifications' }}</button><button class="button button-danger" type="button" :disabled="suppressionEnCours" @click="supprimer">{{ suppressionEnCours ? 'Suppression…' : 'Supprimer le ticket' }}</button></div>
      </form>
    </template>
  </section>
</template>
