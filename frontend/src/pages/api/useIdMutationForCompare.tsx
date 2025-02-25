import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'

export interface Mutation {
  id: number
  ref_number: number
  trans_date: string
  to_warehouse_id: number
  items: {
    id: number
    finance_account_id: number
  }[]
}

export function useIdMutationForCompare() {
  const [loading, setLoading] = useState(true)
  const [getPindahCompare, setgetPindahCompare] = useState<Mutation[]>([])
  console.log(getPindahCompare)
  const [refetchAttempted, setRefetchAttempted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('getPindahCompare')
        if (storedData) {
          const parsedData: Mutation[] = JSON.parse(storedData)
          if (parsedData.length > 0) {
            setgetPindahCompare(parsedData)
            setLoading(false)
            return
          }
        }

        let allInvoices: Mutation[] = []
        let page = 1
        const perPage = 500
        let isDataFound = false

        const responGudang = await fetch(
          `${HOST}/finance/warehouses/transfers?page=${page}&per_page=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!responGudang.ok) {
          throw new Error('Failed to fetch data from API')
        }

        const dataGudang = await responGudang.json()

        if (dataGudang.data && dataGudang.data.data.length > 0) {
          allInvoices = dataGudang.data.data

          setgetPindahCompare(allInvoices)
          setLoading(false)

          // sessionStorage.setItem('getPindahCompare', JSON.stringify(allInvoices))
          isDataFound = true
        }

        if (!isDataFound && page === 1 && !refetchAttempted) {
          setRefetchAttempted(true)
          fetchData()
          return
        }

        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const memoizedData = useMemo(() => getPindahCompare, [getPindahCompare])

  return { loading, getPindahCompare }
}
