import { useState } from 'react';
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config';
import TOKEN from '../../token';

export function saveToApiNextPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveNextPayment = async (invoiceData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log('Data before saving:', invoiceData); // Debugging log

    try {
      const response = await fetch(`${HOST}/finance/bankTrans/invoicePayment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        let errorMessage = 'Terjadi kesalahan yang tidak diketahui.';
        switch (response.status) {
          case 400:
            errorMessage = 'Bad Request: Data tidak valid.';
            break;
          case 401:
            errorMessage = 'Unauthorized: Token kadaluarsa atau tidak valid.';
            break;
          case 403:
            errorMessage = 'Forbidden: Tidak punya izin.';
            break;
          case 404:
            errorMessage = 'Not Found: Resource tidak ditemukan.';
            break;
          case 500:
            errorMessage = 'Internal Server Error: Server bermasalah.';
            break;
          default:
            errorMessage = `Error: ${response.statusText}`;
            break;
        }

        console.error('Error saving data:', errorMessage); // Debugging log
        setError(errorMessage);
        setLoading(false);
        return false; // Gagal, hentikan proses selanjutnya
      }

      const savedData = await response.json();
      console.log('Data after saving:', savedData); // Debugging log

      setSuccess(true);
      return true; // Berhasil, lanjutkan proses
    } catch (error: any) {
      console.error('Error occurred:', error.message); // Debugging log
      setError(error.message);
      return false; // Jika terjadi error, hentikan proses
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    saveNextPayment,
  };
}
