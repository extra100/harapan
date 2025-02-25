import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Transfer {
  id: number
  to_warehouse_id: number

}

export function userefNumberFromKledo(id: any) {
  const [loading, setLoading] = useState(true)
  const [getBasedOnRefNumber, setgetBasedOnRefNumber] = useState<Transfer | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('getBasedOnRefNumber')
        if (storedData) {
          const parsedData: Transfer[] = JSON.parse(storedData)

          const matchedTransfer = parsedData.find(
            (Transfer) => Transfer.id === id
          )
          if (matchedTransfer) {
            setgetBasedOnRefNumber(matchedTransfer)
            setLoading(false)
            return // Stop fetching
          }
        }

        let allTransfers: Transfer[] = []
        let page = 1
        const perPage = 2000
        let hasMoreData = true
const id = 16765
        while (hasMoreData) {
          const responGudang = await fetch(
            `${HOST}/finance/warehouses/transfers=${id}`,
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          )

          if (!responGudang.ok) {
            throw new Error('Failed to fetch data from API')
          }

          const dataPindah = await responGudang.json()

          if (dataPindah.data && dataPindah.data.data.length > 0) {
            allTransfers = allTransfers.concat(dataPindah.data.data)

            const matchedTransfer = dataPindah.data.data.find(
              (item: Transfer) => item.id === id
            )

            if (matchedTransfer) {
              setgetBasedOnRefNumber(matchedTransfer)
              setLoading(false)

              sessionStorage.setItem(
                'getBasedOnRefNumber',
                JSON.stringify(allTransfers)
              )
              return // Stop fetching as soon as a match is found
            }

            page += 1
          } else {
            hasMoreData = false // No more data to fetch
          }
        }

        setLoading(false) // Set loading to false if no match is found
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id]) // Trigger effect only when id changes

  const memorize = useMemo(() => getBasedOnRefNumber, [getBasedOnRefNumber])

  return { loading, getBasedOnRefNumber }
}
