import { message } from 'antd'
import { useState } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'
// import IdUnikDariKledo from './SimpanIdUnikDariKledo'

export function KirimEditKeKledo() {
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editSuccess, setEditSuccess] = useState(false)

  const editDataKelod = async (transactionId: string, ref_number: string) => {
    if (!transactionId) {
      setEditError('Transaction ID tidak ditemukan')
      return
    }

    setEditLoading(true)
    setEditError(null)
    setEditSuccess(false)

    const payload = {
      contact_id: 434,
      contact_shipping_address_id: '',
      currency_rate: null,
      currency_source_id: 0,
      due_date: '2024-10-24',
      // id: IdUnikDariKledo,
      include_tax: 0,
      items: [
        {
          finance_account_id: 3,
          qty: 1,
          tax_id: '',
          desc: null,
          unit_id: 1,
          price: 35000,
          amount: 29400,
          discount_amount: 5600,
          id: 374213,
        },
      ],
      message: null,
      ref_number: 'IBO-3-05519',
      shipping_comp_id: null,
      shipping_cost: 0,
      shipping_date: null,
      shipping_tracking: null,
      tags: [3],
      term_id: 3,
      trans_date: '2024-10-10',
      warehouse_id: 3,
    }

    // console.log('Payload yang dikirim:', payload)

    try {
      const response = await fetch(
        `${HOST}/finance/invoices/${transactionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }

      const responseData = await response.json()
      // console.log('Data yang diterima:', responseData)
      setEditSuccess(true)
      message.success('Transaksi berhasil dibatalkan!')
    } catch (error: any) {
      const errorMessage =
        error.message || 'Terjadi kesalahan saat edit invoice'
      setEditError(errorMessage)
      message.error(errorMessage)
    } finally {
      setEditLoading(false)
    }
  }

  return { editDataKelod, editLoading, editError, editSuccess }
}
