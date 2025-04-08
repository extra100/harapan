// import { useState, useEffect, useMemo } from 'react'
// import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
// import TOKEN from '../../token'

// export interface Warehouse {
//   id: number
//   name: string
// }
// //
// export function useIdWarehouse() {
//   const [loading, setLoading] = useState(true)
//   const [idWarehouse, setIdWarehouse] = useState<Warehouse[]>([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedData = sessionStorage.getItem('idWarehouse')

//         if (storedData) {
//           setIdWarehouse(JSON.parse(storedData))
//           setLoading(false)
//         } else {
//           const responGudang = await fetch(
//             `${HOST}/finance/warehouses?page=1&per_page=25`,
//             {
//               headers: {
//                 Authorization: `Bearer ${TOKEN}`,
//               },
//             }
//           )

//           if (!responGudang.ok) {
//             throw new Error('Failed to fetch data')
//           }

//           const dataGudang = await responGudang.json()

//           const formattedData: Warehouse[] = dataGudang.data.data.map(
//             (item: Warehouse) => ({
//               id: item.id,
//               name: item.name,
//             })
//           )

//           setIdWarehouse(formattedData)
//           sessionStorage.setItem('idWarehouse', JSON.stringify(formattedData))
//           setLoading(false)
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const memoizedData = useMemo(() => idWarehouse, [idWarehouse])

//   return { loading, idWarehouse }
// }
<></>