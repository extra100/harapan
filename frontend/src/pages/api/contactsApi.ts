import axios from 'axios'

const API_URL = 'http://localhost:5000'

export async function fetchContacts(): Promise<any[]> {
  try {
    const response = await axios.get(`${API_URL}/contacts`)
    return response.data.contacts || []
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    return []
  }
}
