import { message } from 'antd'
import { useState } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'
// import { useIdInvoice } from './takeSingleInvoice'

export function useUnvoidInvoice() {
  const [voidLoading, setVoidLoading] = useState(false)
  const [voidError, setVoidError] = useState<string | null>(null)
  const [voidSuccess, setVoidSuccess] = useState(false)

  const unvoidInvoice = async (invoiceId: string) => {
    // Menerima invoiceId sebagai parameter
    if (!invoiceId) {
      setVoidError('Invoice ID tidak ditemukan')
      return
    }

    setVoidLoading(true)
    setVoidError(null)
    setVoidSuccess(false)

    try {
      const response = await fetch(
        `${HOST}/finance/invoices/${invoiceId}/unvoid`,
        {
          method: 'POST', // Bisa jadi method lain, tergantung dokumentasi API
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Gagal melakukan unvoid pada invoice')
      }

      const responseData = await response.json()
      setVoidSuccess(true)
      message.success('Transaksi berhasil dibatalkan!')
      console.log('Void invoice berhasil:', responseData)
    } catch (error: any) {
      const errorMessage =
        error.message || 'Terjadi kesalahan saat void invoice'
      setVoidError(errorMessage)
      message.error(errorMessage)
    } finally {
      setVoidLoading(false)
    }
  }
  return { unvoidInvoice, voidLoading, voidError, voidSuccess }
}
