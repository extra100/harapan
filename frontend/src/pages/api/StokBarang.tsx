import { useState, useEffect, useCallback } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'
//
interface PropertyStokBarang {
  productId: string
  warehouseId: number
  qty: number
  avg_price: number
}

interface ApiResponse {
  data: {
    id: string
    stocks: {
      [key: number]: {
        warehouse_id: number
        qty: number
        avg_price: number
      }
    }
  }[]
}

export const useStokBarang = () => {
  const [dataStokBarang, setDataStokBarang] =
    useState<PropertyStokBarang | null>(null)
  const [loading, setLoading] = useState(false)
console.log({dataStokBarang})
  const fetchStokBarang = useCallback(
    async (productId: string, warehouseId: number) => {
      setLoading(true)

      try {
        const controller = new AbortController() // Untuk membatalkan permintaan jika perlu
        const signal = controller.signal

        const url = `${HOST}/finance/products/stocks?product_ids=${productId}&warehouse_ids=${warehouseId}`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          signal,
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data produk')
        }

        const jsonResponse: ApiResponse = await response.json()
        const formattedData = jsonResponse.data.map((item) => ({
          productId: item.id,
          warehouseId: item.stocks[warehouseId].warehouse_id,
          // qty: item.stocks[warehouseId].qty,
          qty: item.stocks[warehouseId].qty || 0,

          avg_price: item.stocks[warehouseId].avg_price,
        }))[0]
        // console.log('Fetched Data:', formattedData)

        setDataStokBarang(formattedData)
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error saat mengambil data:', error.message)
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { dataStokBarang, loading, fetchStokBarang }
}
