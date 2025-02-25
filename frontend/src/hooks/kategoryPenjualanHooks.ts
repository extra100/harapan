import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { KategoryPenjualan } from '../types/KategoryPenjualan'

// export const useGetKategoryPenjualansQuery = () =>
//     useQuery({
//       queryKey: ['penjualankategory'],
//       queryFn: async () => {
//         const response = await apiClient.get<KategoryPenjualan[]>('/api/penjualankategory')
//         console.log("Data kategori penjualan:", response.data)
//         return response.data
//       },
//     })
export const useGetKategoryPenjualansQuery = (startDate: string, endDate: string, outletId: string) =>
  useQuery({
    queryKey: ['penjualankategory', startDate, endDate, outletId],
    queryFn: async () => {
      const response = await apiClient.get<KategoryPenjualan[]>(`/api/penjualankategory?startDate=${startDate}&endDate=${endDate}&outletId=${outletId}`)
      console.log("Data kategori penjualan:", response.data)
      return response.data
    },
  })

export const useAddKategoryPenjualanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: KategoryPenjualan) => apiClient.post<KategoryPenjualan>(`/api/penjualankategory`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['penjualankategory'])
      },
    }
  )
}

export const useUpdateKategoryPenjualanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (murah: KategoryPenjualan) =>
      apiClient.put<KategoryPenjualan>(`/api/penjualankategory/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['penjualankategory'])
      },
    }
  )
}

export const useDeleteKategoryPenjualanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/penjualankategory/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['penjualankategory'])
      },
    }
  )
}
