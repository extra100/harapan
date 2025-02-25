import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Unit {
  id: number
  name: string
}

export interface Barang {
  id: number
  name: string
  price: number
  hpp: number
  unit?: Unit
  code: string
  pos_product_category_id: string
}

export function useIdNamaddBarang() {
  const [loading, setLoading] = useState(true)
  const [idDataddBarang, setIdDataddBarang] = useState<Barang[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${HOST}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials',
          }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        const accessToken = data.access_token

        const bankTransResponse = await fetch(
          `${HOST}/finance/products?page=1&per_page=200000`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!bankTransResponse.ok) {
          throw new Error('Failed to fetch bank transactions')
        }

        const bankTransData = await bankTransResponse.json()
        const formattedData: Barang[] = bankTransData.data.data.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            hpp: item.hpp,
            code: item.code,
            pos_product_category_id: item.pos_product_category_id,
            unit: item.unit
              ? {
                  id: item.unit.id,
                  name: item.unit.name,
                }
              : { id: 0, name: 'Unknown' },
          })
        )

        setIdDataddBarang(formattedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const memoizedData = useMemo(() => idDataddBarang, [idDataddBarang])

  return { loading, idDataddBarang }
}
