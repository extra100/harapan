interface Contact {
  id: number
  name: string
  group_id: number
  group_name: string
  receivable: number
}

interface ContactsResponse {
  contacts: Contact[]
}

async function testFetchContacts() {
  try {
    // Dynamically import node-fetch
    const { default: fetch } = await import('node-fetch')

    const response = await fetch('http://localhost:3001/api/contacts')

    const data: ContactsResponse = (await response.json()) as ContactsResponse

    console.log('Contacts:', data.contacts)
  } catch (error) {
    console.error('Error during test:', error)
  }
}

testFetchContacts()
