// import { useState, useEffect, useMemo } from 'react'
// import { HOST } from '../config'
// import TOKEN from '../token'
// export interface Invoice {
//   amount: number
//   balance: number
//   contact_id: number
//   id: number
//   memo: string
//   trans_date: string
//   status_id: string
// }

// export function TakePembayaranBankTrans(search: string | null) {
//   const [loadings, setLoadings] = useState(true)
//   const [getBankTrans, setBankTrans] = useState<Invoice[]>([])
//   const [pollingActive, setPollingActive] = useState(true) // State to control polling

//   const fetchData = async () => {
//     if (!search) return

//     setLoadings(true)
//     try {
//       let allInvoices: Invoice[] = []
//       let page = 1
//       let hasMoreData = true

//       while (hasMoreData) {
//         const url = `${HOST}/finance/bankTrans?per_page=500&page=${page}&search=${search}`

//         const response = await fetch(url, {
//           headers: {
//             Authorization: `Bearer ${TOKEN}`,
//           },
//         })

//         if (!response.ok) {
//           throw new Error('Failed to fetch invoices')
//         }

//         const data = await response.json()
//         console.log('Fetched datahzthtj:', data)

//         const formattedData: Invoice[] = data.data.data.map((inv: any) => ({
//           amount: inv.amount,
//           balance: inv.balance,
//           contact_id: inv.contact_id,
//           id: inv.id,
//           memo: inv.memo,
//           trans_date: inv.trans_date,
//           status_id: inv.status_id,
//         }))

//         allInvoices = [...allInvoices, ...formattedData]

//         if (data.data.data.length < 500) {
//           hasMoreData = false
//         } else {
//           page++
//         }
//       }

//       setBankTrans(allInvoices)

//       const memoFound = allInvoices.some((invoice) => invoice.memo === search)

//       if (memoFound) {
//         setPollingActive(false) // Stop polling when memo is found
//         console.log(`Memo "${search}" found!`)
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoadings(false)
//     }
//   }

//   useEffect(() => {
//     fetchData() // Initial fetch

//     const interval = setInterval(() => {
//       if (pollingActive) {
//         fetchData() // Refetch only if polling is active
//       } else {
//         clearInterval(interval) // Stop polling
//       }
//     }, 1000)

//     return () => clearInterval(interval) // Cleanup on unmount
//   }, [search, pollingActive])

//   const memoizedData = useMemo(() => getBankTrans, [getBankTrans])

//   return { loadings, getBankTrans }
// }
<></>