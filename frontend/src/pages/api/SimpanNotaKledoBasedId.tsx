// import { useState, useEffect, useMemo } from 'react'
// import { HOST } from '../../config'
// import TOKEN from '../../token'

// export interface Invoice {
//   id: number
// }

// export function SimpanNotaKledoBasedId(id: number) {
//   const [loading, setLoading] = useState(true)
//   const [getBasedId, setBasedId] = useState<Invoice | null>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedData = sessionStorage.getItem('getBasedId')
//         if (storedData) {
//           const parsedData: Invoice[] = JSON.parse(storedData)
//           const matchedInvoice = parsedData.find(
//             (invoice) => invoice.id === 209279
//           )

//           if (matchedInvoice) {
//             // console.log('Found in session storage:', matchedInvoice)
//             setBasedId(matchedInvoice)
//             setLoading(false)
//             return
//           }
//         }

//         let page = 1
//         const perPage = 10
//         let hasMoreData = true

//         while (hasMoreData) {
//           const responGudang = await fetch(
//             `${HOST}/finance/invoices?id=${id}&page=${page}&perPage=${perPage}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${TOKEN}`,
//               },
//             }
//           )

//           if (!responGudang.ok) {
//             throw new Error('Failed to fetch data from API')
//           }

//           const dataGudang = await responGudang.json()

//           // Check if we found the matching invoice
//           const matchedInvoice = dataGudang.data.data.find(
//             (item: Invoice) => item.id === 209279
//           )

//           // Log the matched invoice if found
//           if (matchedInvoice) {
//             // console.log('Matched invoice found:', matchedInvoice)
//             setBasedId(matchedInvoice)
//             setLoading(false)

//             sessionStorage.setItem(
//               'getBasedId',
//               JSON.stringify([matchedInvoice])
//             )
//             return // Stop fetching as we've found the match
//           }

//           // If no match found on this page, check if there are more pages
//           if (dataGudang.data.data.length < perPage) {
//             hasMoreData = false
//           } else {
//             page += 1
//           }
//         }

//         setLoading(false) // If all pages are exhausted without finding a match
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         setLoading(false)
//       }
//     }

//     if (id) {
//       fetchData()
//     }
//   }, [id])

//   const memoizedData = useMemo(() => getBasedId, [getBasedId])

//   return { loading, getBasedId }
// }
<></>