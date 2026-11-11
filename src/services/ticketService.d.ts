import type { Ticket, TicketCreateData, TicketInput } from '../types/ticket'

export function getTickets(): Promise<Ticket[]>
export function getTicket(id: string): Promise<Ticket>
export function createTicket(data: TicketCreateData): Promise<Ticket>
export function updateTicket(id: string, data: Partial<TicketInput>): Promise<Ticket>
export function deleteTicket(id: string): Promise<void>
