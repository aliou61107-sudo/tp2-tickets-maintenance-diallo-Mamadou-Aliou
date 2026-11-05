import axios from 'axios'

const ticketApi = axios.create({
  baseURL: 'http://localhost:3000',
})

export async function getTickets() {
  const response = await ticketApi.get('/tickets')
  return response.data
}
