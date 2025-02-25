import { useState, useEffect } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'

export interface Product {
  id: number
  name: string
  code: string
}

export function useIdProduct(productIds: string) {
  const [idProduct, setIdProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIdProduct = async () => {
      try {
        const response = await fetch(`${HOST}/finance/products/${productIds}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }

        const responseData = await response.json()

        const dataProduct: Product = {
          id: responseData.data.id,
          name: responseData.data.name,
          code: responseData.data.code,
        }
        setIdProduct(dataProduct)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIdProduct()
  }, [productIds])

  return { idProduct, loading }
}
