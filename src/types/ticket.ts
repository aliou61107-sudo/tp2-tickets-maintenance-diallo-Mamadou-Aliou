export type TicketPriority = 'Haute' | 'Moyenne' | 'Basse'
export type TicketStatus = 'Ouvert' | 'En cours' | 'Résolu' | 'Fermé'

export interface Ticket {
  id: string
  titre: string
  description: string
  demandeur: string
  priorite: TicketPriority
  statut: TicketStatus
  dateCreation: string
}

export type TicketInput = Omit<Ticket, 'id' | 'dateCreation'>
export type TicketCreateData = Omit<Ticket, 'id'>
