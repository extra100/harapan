// import { useEffect } from 'react'
// import { HOST } from '../../config'
// import TOKEN from '../../token'

// export interface Invoice {
//   id: number
//   ref_number: string
//   // Add other fields here as needed
// }

// export function useUpdateInvoice(
//   id: number,
//   updatedInvoiceData: Partial<Invoice>
// ) {
//   useEffect(() => {
//     if (!id || !updatedInvoiceData) return

//     const updateData = async () => {
//       try {
//         // Check for existing data in sessionStorage to update locally
//         const storedData = sessionStorage.getItem('getIdAtInvoice')
//         if (storedData) {
//           const parsedData: Invoice[] = JSON.parse(storedData)
//           const updatedData = parsedData.map((invoice) =>
//             invoice.id === id ? { ...invoice, ...updatedInvoiceData } : invoice
//           )
//           sessionStorage.setItem('getIdAtInvoice', JSON.stringify(updatedData))
//         }

//         // Make the API PUT request
//         const response = await fetch(`${HOST}/finance/invoices/${id}`, {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(updatedInvoiceData),
//         })

//         if (!response.ok) {
//           throw new Error('Failed to update data on API')
//         }
//       } catch (error) {
//         console.error('Error updating invoice:', error)
//       }
//     }

//     updateData()
//   }, [id, updatedInvoiceData])
// }
<></>