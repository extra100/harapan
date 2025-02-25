import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'

export interface TagInfo {
  warehouse_id: number
  tag_id: number
  tag_name: string
  due: number
  ref_number: string
}

export interface CustomerInvoice {
  id: number
  trans_date: string
  due_date: string
  status_id: number
  contact_id: number
  due: number
  amount_after_tax: number
  memo: string
  ref_number: string
  currency_rate: number
  tags: { id: number; name: string }[]
  amount: number
  warehouse_id: number
}

export function useIdNamaTagGraha(selectedTags: number[], selectedWarehouseId: number) {
  const [loading, setLoading] = useState(true)
  const [idDataTagGraha, setIdDataTagGraha] = useState<TagInfo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const storedData = sessionStorage.getItem(`TagTransactions_${selectedTags.join(',')}_${selectedWarehouseId}`)
        if (storedData) {
          setIdDataTagGraha(JSON.parse(storedData))
          setLoading(false)
          return
        }

        const tagsParam = selectedTags.length > 0 ? selectedTags.join('%2C') : ''
        const warehouseParam = selectedWarehouseId || ''

        const response = await fetch(
            `${HOST}/reportings/customerInvoice?filter_date=trans_date&date_from=2022-01-01&date_to=2027-12-12&status_id=1%2C2&per_page=100000000&sort_by=due&tags=${tagsParam}&warehouse_id=${warehouseParam}`,
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
              },
            }
          )
          
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const responseData = await response.json()
        const formattedData: TagInfo[] = Array.isArray(responseData.data?.data)
        ? responseData.data.data.flatMap((item: CustomerInvoice) =>
            item.tags
              .filter((tag) => tag.id !== 18)
              .map((tag) => ({
                warehouse_id: item.warehouse_id,
                tag_id: tag.id,
                tag_name: tag.name,
                due: item.due,
                ref_number: item.ref_number
              }))
          )
        : [];

        setIdDataTagGraha(formattedData)
        sessionStorage.setItem(`TagTransactions_${tagsParam}_${warehouseParam}`, JSON.stringify(formattedData))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (selectedTags.length > 0 && selectedWarehouseId) {
      fetchData()
    }
  }, [selectedTags, selectedWarehouseId])

  const memoizedData = useMemo(() => idDataTagGraha, [idDataTagGraha])

  return { loading, idDataTagGraha: memoizedData }
}
