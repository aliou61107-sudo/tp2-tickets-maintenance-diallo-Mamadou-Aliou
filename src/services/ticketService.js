import axios from 'axios'

const ticketApi = axios.create({
  baseURL: 'http://localhost:3000',
})

export async function getTickets() {
  const response = await ticketApi.get('/tickets')
  return response.data
}

export async function getTicket(id) {
  const response = await ticketApi.get(`/tickets/${id}`)
  return response.data
}

export async function createTicket(data) {
  const response = await ticketApi.post('/tickets', data)
  return response.data
}

export async function updateTicket(id, data) {
  const response = await ticketApi.patch(`/tickets/${id}`, data)
  return response.data
}

export async function deleteTicket(id) {
  await ticketApi.delete(`/tickets/${id}`)
}
