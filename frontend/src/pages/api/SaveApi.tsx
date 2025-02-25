import { useState } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export function SaveApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const saveInvoiceData = async (invoiceData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      const response = await fetch(`${HOST}/finance/invoices`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });
  
      // Menangani berbagai macam status error
      if (!response.ok) {
        let errorMessage = 'Terjadi kesalahan yang tidak diketahui.';
  
        switch (response.status) {
          case 400:
            errorMessage = 'Bad Request: Data yang dikirimkan tidak valid.';
            break;
          case 401:
            errorMessage = 'Unauthorized: Token expired atau tidak valid. Harap login kembali.';
            break;
          case 403:
            errorMessage = 'Forbidden: Anda tidak memiliki izin untuk melakukan tindakan ini.';
            break;
          case 404:
            errorMessage = 'Not Found: Resource yang diminta tidak ditemukan.';
            break;
          case 500:
            errorMessage = 'Internal Server Error: Terjadi masalah di server. Coba lagi nanti.';
            break;
          case 502:
            errorMessage = 'Bad Gateway: Terjadi masalah dengan server gateway. Coba lagi nanti.';
            break;
          default:
            errorMessage = `Kesalahan: ${response.statusText || 'Tidak dapat mengakses resource.'}`;
            break;
        }
  
        setError(errorMessage);
        setLoading(false);
        return false; // Jika terjadi kesalahan, hentikan eksekusi
      }
  
      const data = await response.json(); // Ambil data respons
  
      if (!data.success) {
        setError(data.message || 'Terjadi kesalahan saat menyimpan invoice.');
        setLoading(false);
        return false; // Gagal jika success: false
      }
  
      setSuccess(true);
      return true; // Berhasil hanya kalau success: true
    } catch (error: any) {
      setError(error.message || 'Gagal menyimpan invoice. Coba lagi nanti.');
      setLoading(false);
      return false; // Jika terjadi error saat fetch
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return {
    loading,
    error,
    success,
    saveInvoiceData,
  }
}
