import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Pembiayaan } from '../types/Pembiayaan'
import dayjs from 'dayjs'

interface UsePembiayaansParams {
  transDateFrom?: string | null
  transDateTo?: string | null
  selectedWarehouse?: string | null
}

export const useGetFilteredPembiayaansQuery = ({
  transDateFrom,
  transDateTo,
  selectedWarehouse,
}: UsePembiayaansParams) =>
  useQuery({
    queryKey: [
      'pembiayaans',
      { transDateFrom, transDateTo, selectedWarehouse },
    ],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (transDateFrom) params.append('trans_date', transDateFrom)
      if (transDateTo) params.append('trans_date', transDateTo)
      if (selectedWarehouse) params.append('warehouse_id', selectedWarehouse)

      const response = await apiClient.get<Pembiayaan[]>(
        `/api/pembiayaans?${params.toString()}`
      )

      const filteredData = response.data.filter(
        (transaction) => transaction.reason_id === 'unvoid'
      )

      return filteredData
    },
    enabled: Boolean(transDateFrom && transDateTo),
  })









  type DiscountSummary = {
    warehouse_id: number;
    discount_percent: number;
    total_discount_amount: number;
    invoice_count: number; // ✅ Tambahkan jumlah nota
  };
  
  export const useGetDiscountSummaryQuery = (start_date: string, end_date: string) =>
    useQuery({
      queryKey: ['discountSummary', start_date, end_date], // Cache key
      queryFn: async () => {
        const { data } = await apiClient.get<DiscountSummary[]>(
          `/api/pembiayaans/discount-summary?start_date=${start_date}&end_date=${end_date}`
        );
        return data.map((item) => ({
          ...item,
          discount_percent: Math.round(item.discount_percent), // ✅ Bulatkan diskon
          total_discount_amount: Math.floor(item.total_discount_amount), // ✅ Pastikan tanpa koma
        }));
      },
      enabled: !!start_date && !!end_date, // Hanya jalan kalau ada tanggal
    });

      export const useGetQtySummaryQuery = (start_date: string, end_date: string) =>
        useQuery({
          queryKey: ['qtySummary', start_date, end_date], // Cache key
          queryFn: async () => {
            const { data } = await apiClient.get<{ name: string; total_qty: number }[]>(
              `/api/pembiayaans/qty-summary?start_date=${start_date}&end_date=${end_date}`
            );
            return data.map((item) => ({
              ...item,
              total_qty: Math.floor(item.total_qty), // Pastikan nilai integer
            }));
          },
          enabled: !!start_date && !!end_date, // Hanya jalan kalau ada tanggal
        });
        //   useQuery({
        //     queryKey: ["downPaymentSummary", start_date, end_date],
        //     queryFn: async () => {
        //       const { data } = await apiClient.get<any[]>(
        //         `/api/pembiayaans/summary/down-payment?start_date=${start_date}&end_date=${end_date}`
        //       );
        //       if (!Array.isArray(data)) {
        //         console.error("Unexpected data format:", data);
        //         throw new Error("Data yang diterima tidak berupa array");
        //       }
        //       return data.map((item) => ({
        //         ...item,
        //         down_payment: Math.floor(item.down_payment),
        //       }));
        //     },
        //     enabled: !!start_date && !!end_date,
        //   });
        // export const useGetDownPaymentSummaryQuery = (start_date: string, end_date: string) =>
        //   useQuery({
        //     queryKey: ["downPaymentSummary", start_date, end_date],
        //     queryFn: async () => {
        //       const { data } = await apiClient.get<any[]>(
        //         `/api/pembiayaans/summary/down-payment?start_date=${start_date}&end_date=${end_date}`
        //       );
        //       if (!Array.isArray(data)) {
        //         console.error("Unexpected data format:", data);
        //         throw new Error("Data yang diterima tidak berupa array");
        //       }
        //       return data.map((item) => ({
        //         ...item,
        //         down_payment: Math.floor(item.down_payment),
        //         memo: item.memo || "-", // Pastikan memo ikut
        //       }));
        //     },
        //     enabled: !!start_date && !!end_date,
        //   });
        export const useGetDownPaymentSummaryQuery = (start_date: string, end_date: string) =>
          useQuery({
            queryKey: ["downPaymentSummary", start_date, end_date],
            queryFn: async () => {
              const { data } = await apiClient.get<any[]>(
                `/api/pembiayaans/summary/down-payment?start_date=${start_date}&end_date=${end_date}`
              );
              if (!Array.isArray(data)) {
                console.error("Unexpected data format:", data);
                throw new Error("Data yang diterima tidak berupa array");
              }
        
              return data; // Langsung return array tanpa agregasi
            },
            enabled: !!start_date && !!end_date,
          });
        
        
        
        
        
      
export const useUpdateWitholdingMutationPembiayaan = () => {
  return useMutation(
    async ({
      ref_number,
      witholdingId,
      trans_date,
      down_payment,
    }: {
      ref_number: string
      witholdingId: string
      trans_date: string
      down_payment: number
    }) =>
      apiClient.put(
        `/api/pembiayaans/${ref_number}/witholdings/${witholdingId}`,

        { trans_date, down_payment }
      )
  )
}
export const useUpdatePembiayaanMutationsss = () => {
  return useMutation(
    async (updateData: {
      ref_number: string
      trans_date: string
      down_payment: number
    }) => {
      const response = await apiClient.put(
        `/api/pembiayaans/${updateData.ref_number}`,
        updateData
      )
      return response.data
    }
  )
}
  export const useGetPembiayaansByContactQuery = (contact_id?: number) =>
    useQuery({
      queryKey: ['pembiayaans', contact_id],
      queryFn: async () => {
        if (contact_id === undefined) {
          return [];
        }
        return (
          await apiClient.get<Pembiayaan[]>(`/api/pembiayaans/by-contact/${contact_id}`)
        ).data;
      },
      enabled: contact_id !== undefined, // Fetch data only if contact_id is provided
    });

    export const useGetPembiayaansByIdBarangQuery = (name?: string) =>
      useQuery({
        queryKey: ['pembiayaans', name],
        queryFn: async () => {
          if (name === undefined) {
            return [];
          }
          const response = await apiClient.get<Pembiayaan[]>(`/api/pembiayaans/by-name/${name}`);
          console.log('API response:', response); // Log the raw response
          return response.data;
        },
        enabled: name !== undefined, // Fetch data only if name is provided
      });
    

export const useGetPembiayaansQuery = () =>
  useQuery({
    queryKey: ['pembiayaans'],
    queryFn: async () =>
      (await apiClient.get<Pembiayaan[]>(`/api/pembiayaans`)).data,
  })
  
  
  export const useGetFilteredPembiayaansQueryForPrice = (filters: { trans_date?: string; warehouse_id?: number; contact_id?: number }) =>
    useQuery({
      queryKey: ['pembiayaans', filters],
      queryFn: async () => {
        const { trans_date, warehouse_id, contact_id } = filters;
        const queryParams = new URLSearchParams();
        if (trans_date) queryParams.append('trans_date', trans_date);
        if (warehouse_id) queryParams.append('warehouse_id', String(warehouse_id));
        if (contact_id) queryParams.append('contact_id', String(contact_id));
        return (await apiClient.get(`/api/pembiayaans/filter?${queryParams.toString()}`)).data;
      },
    });

export const useGetPembiayaansQuerymu = (
  warehouseId: number | null,
  startDate: string | null,
  endDate: string | null
) => {
  return useQuery({
    queryKey: ['pembiayaans', warehouseId, startDate, endDate],
    queryFn: async () => {
      try {
        if (!startDate || !endDate) {
          console.log('Tanggal tidak valid, menggunakan hari ini')
          startDate = dayjs().format('YYYY-MM-DD')
          endDate = dayjs().format('YYYY-MM-DD')
        }

        console.log(
          'Fetching pembiayaans for warehouseId:',
          warehouseId ?? 'Semua',
          'from startDate:',
          startDate,
          'to endDate:',
          endDate
        )

        const response = await apiClient.get<Pembiayaan[]>(
          `/api/pembiayaans?${warehouseId ? `warehouseId=${warehouseId}&` : ''}startDate=${startDate}&endDate=${endDate}`
        )

        console.log('Data from API:', response.data)
        return response.data
      } catch (error) {
        console.error('Error fetching pembiayaans:', error)
        return []
      }
    },
    enabled: !!startDate && !!endDate, // Biarkan warehouseId null untuk mengambil semua data
    staleTime: 1000 * 60 * 5, // Cache data selama 5 menit untuk performa lebih baik
    retry: 1, // Hanya coba 1x jika gagal
  })
}

export const useGetPembiayaanByIdQuery = (ref_number: string) =>
  useQuery<Pembiayaan[]>(
    ['pembiayaans', ref_number],
    async () =>
      (await apiClient.get<Pembiayaan[]>(`/api/pembiayaans/${ref_number}`))
        .data
  )
export const useGetPesoDetailQuery = (ref_number: string) => {
  return useQuery({
    queryKey: ['pembiayaans', ref_number],
    queryFn: async () =>
      (await apiClient.get<Pembiayaan[]>(`/api/pembiayaans/${ref_number}`))
        .data,
  })
}

export const useGetPembiayaanDetailQuery = (ref_number: string) => {
  return useQuery({
    queryKey: ['getPembiayaanDetail', ref_number],
    queryFn: async () =>
      (await apiClient.get<Pembiayaan[]>(`/api/pembiayaans/${ref_number}`))
        .data,
  })
}

export const useAddPembiayaanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Pembiayaan) => {
      return apiClient.post<Pembiayaan>(`/api/pembiayaans`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembiayaans'])
      },
    }
  )
}

type UpdatePpIdInput = {
  ref_number: string
  id: number
  items?: {
    id: number // id item yang ingin diperbarui
    finance_account_id: number // id item yang ingin diperbarui
  }[]
}

export const updateDenganIdUnikDariKledo = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ ref_number, id, items }: any) => {
      return apiClient.put(`/api/pembiayaans/by-id/${ref_number}`, {
        id,
        items,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembiayaans'])
      },
      onError: (error: any) => {
        console.error('Error updating ID and items:', error)
      },
    }
  )
}

export const updateDenganMemoDariKledo = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      memo,
      id,
      items,
      witholdings,
      amount, // Baru
      due, // Baru
    }: {
      memo: string;
      id: string;
      items: any[];
      witholdings: any[];
      amount: any; // Baru
      due: any; // Baru
    }) => {
      return apiClient.put(`/api/pembiayaans/by-memo/${memo}`, {
        id,
        items,
        witholdings,
        amount, // Baru
        due, // Baru
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembiayaans']); // Refresh data setelah berhasil
      },
      onError: (error: any) => {
        console.error('Error updating data by memo:', error);
      },
    }
  );
};

export const useUpdatePembiayaanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Pembiayaan) => {
      // Pastikan endpoint URL sesuai dengan backend route yang sudah Anda definisikan
      return apiClient
        .put<Pembiayaan>(
          `/api/pembiayaans/full-update/${murahnye.ref_number}`,
          murahnye
        )

        .then((response) => {
          return response.data
        })
    },
    {
      onSuccess: () => {
        // Invalidate cache agar data diperbarui otomatis
        queryClient.invalidateQueries(['pembiayaans'])
      },
      onError: (error: any) => {
        console.error('Error updating transaction:', error)
      },
    }
  )
}
type UpdateContactPayload = {
  ref_number: string
  contact_id: number
  warehouse_id: number
  term_id: number
  id: number
  trans_date?: string // Trans_date from getPosDetail
  due_date?: string // Due_date from getPosDetail
  contacts?: { id: number }[]
  tages?: { id: number }[]
}

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({
      ref_number,
      contact_id,
      warehouse_id,
      term_id,
      id,
      trans_date,
      due_date,
      contacts,
      tages,
    }: UpdateContactPayload) => {
      const response = await apiClient.put(
        `/api/pembiayaans/by-contact_id/${ref_number}`,
        {
          contact_id,
          warehouse_id,
          term_id,
          id,
          trans_date,
          due_date,
          contacts,
          tages,
        }
      )
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembiayaans'])
      },
      onError: (error: any) => {
        console.error('Error updating contact_id:', error)
      },
    }
  )
}


export const useDeleteWitholdingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({
      ref_number,
      witholdingId,
    }: {
      ref_number: string
      witholdingId: string
    }) => {
      return apiClient.delete(
        `/api/pembiayaans/${ref_number}/witholdings/${witholdingId}`
      )
    },
    {
      onSuccess: (_, { ref_number }) => {
        queryClient.invalidateQueries(['pembiayaans', ref_number])
      },
    }
  )
}

export const useUpdateWitholdingPercentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async ({
      ref_number,
      witholdingId,
      newPercent,
    }: {
      ref_number: string
      witholdingId: string
      newPercent: number
    }) => {
      await apiClient.patch(
        `/api/pembiayaans/${ref_number}/witholding/${witholdingId}`,
        {
          status: newPercent,
        }
      )
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembiayaans'])
      },
    }
  )
}


