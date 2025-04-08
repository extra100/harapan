// import { useState, useEffect, useMemo } from 'react'
// import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
// import TOKEN from '../../token'

// export interface Invoice {
//   id: number
//   ref_number: string
//   items: {
//     id: string
//     name: string
//     amount: number
//     discount_amount: number
//     discount_percent: number
//     finance_account_id: number
//     price: number
//     qty: number
//     // idPadaItems: number
//   }[]
// }

// export function useIdInvoice(ref_number: any) {
//   const [loading, setLoading] = useState(true)
//   const [getIdAtInvoice, setgetIdAtInvoice] = useState<Invoice | null>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedData = sessionStorage.getItem('getIdAtInvoice')
//         if (storedData) {
//           const parsedData: Invoice[] = JSON.parse(storedData)

//           const matchedInvoice = parsedData.find(
//             (invoice) => invoice.ref_number === ref_number
//           )
//           if (matchedInvoice) {
//             setgetIdAtInvoice(matchedInvoice)
//             setLoading(false)
//             return // Stop fetching
//           }
//         }

//         let allInvoices: Invoice[] = []
//         let page = 1
//         const perPage = 20
//         let hasMoreData = true

//         while (hasMoreData) {
//           const responGudang = await fetch(
//             `${HOST}/finance/invoices?ref_number=${ref_number}&page=${page}&perPage=${perPage}&include_items=1`,
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
//           // console.log('Response dari Gudang:', dataGudang)

//           if (dataGudang.data && dataGudang.data.data.length > 0) {
//             allInvoices = allInvoices.concat(dataGudang.data.data)

//             const matchedInvoice = dataGudang.data.data.find(
//               (item: Invoice) => item.ref_number === ref_number
//             )

//             if (matchedInvoice) {
//               setgetIdAtInvoice(matchedInvoice)
//               setLoading(false)

//               sessionStorage.setItem(
//                 'getIdAtInvoice',
//                 JSON.stringify(allInvoices)
//               )
//               return // Stop fetching as soon as a match is found
//             }

//             page += 1
//           } else {
//             hasMoreData = false // No more data to fetch
//           }
//         }

//         setLoading(false) // Set loading to false if no match is found
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         setLoading(false)
//       }
//     }

//     if (ref_number) {
//       fetchData()
//     }
//   }, [ref_number]) // Trigger effect only when ref_number changes

//   const memoizedData = useMemo(() => getIdAtInvoice, [getIdAtInvoice])

//   return { loading, getIdAtInvoice }
// }
<></>