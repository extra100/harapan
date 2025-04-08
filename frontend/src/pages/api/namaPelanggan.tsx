import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'
import { Pelanggan } from '../../types/Pelanggan'

export function useIdNamaPelanggan() {
  const [loading, setLoading] = useState(true)
  const [idDataPelanggan, setIdDataPelanggan] = useState<Pelanggan[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('PelangganTransactions')
        if (storedData) {
          setIdDataPelanggan(JSON.parse(storedData))
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

        const bankTransResponse = await fetch(
          `${HOST}/finance/contacts?page=1&per_page=20000000`,
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

        if (!bankTransData?.data?.data) {
          console.warn('No data available in bankTransData')
          setIdDataPelanggan([])
          setLoading(false)
          return
        }

        // Mapping and formatting data with fallback values
        const formattedData: Pelanggan[] = bankTransData.data.data
          .filter((item: Pelanggan) => item.id_kontak && item.name) // Ensure essential fields
          .map((item: Pelanggan) => ({
            id_kontak: item.id_kontak,
            name: item.name,
            phone: item.phone || '-',
            address: item.address || '-',
           
          }))

        setIdDataPelanggan(formattedData)
        sessionStorage.setItem(
          'PelangganTransactions',
          JSON.stringify(formattedData)
        )
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIdDataPelanggan([]) // Return an empty array in case of an error
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const memoizedData = useMemo(() => idDataPelanggan, [idDataPelanggan])

  return { loading, idDataPelanggan }
}
