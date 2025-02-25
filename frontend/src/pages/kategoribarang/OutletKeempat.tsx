import { useState, useEffect, useMemo } from 'react'
import { DatePicker, Spin } from 'antd'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface SalesCategory {
  amount: number
  amount_after_tax: number
  qty: number
  category_name: string
  product_category_id: number
  avg: number
  avg_after_tax: number
}

export function OutletKeempat(dateFrom: string, dateTo: string, warehouseId: number = 4) {
  const [loadingempat, setLoading] = useState(true)
  const [outletYangKeEmpat, setOutletKeempat] = useState<SalesCategory[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem(`SalesData_${dateFrom}_${dateTo}_${warehouseId}`)
        if (storedData) {
          setOutletKeempat(JSON.parse(storedData))
          setLoading(false)
          return
        }

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

        const salesResponse = await fetch(
          `${HOST}/reportings/salesPerProductCategory?date_from=${dateFrom}&date_to=${dateTo}&per_page=10000&warehouse_id=${warehouseId}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!salesResponse.ok) {
          throw new Error('Failed to fetch sales data')
        }

        const salesDataResponse = await salesResponse.json()
        const formattedData: SalesCategory[] = salesDataResponse.data.data.map((item: SalesCategory) => ({
          amount: item.amount,
          amount_after_tax: item.amount_after_tax,
          qty: item.qty,
          category_name: item.category_name,
          product_category_id: item.product_category_id,
          avg: item.avg,
          avg_after_tax: item.avg_after_tax,
        }))

        setOutletKeempat(formattedData)
        sessionStorage.setItem(`SalesData_${dateFrom}_${dateTo}_${warehouseId}`, JSON.stringify(formattedData))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [dateFrom, dateTo, warehouseId])

  const memoizedData = useMemo(() => outletYangKeEmpat, [outletYangKeEmpat])

  return { loadingempat, outletYangKeEmpat: memoizedData }
}