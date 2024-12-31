import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import apiClient from '../apiClient'
import { WarehouseTransfer } from '../types/Pindah'

export const useAddWarehouseTransferMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (transfer: WarehouseTransfer) =>
      apiClient.post<WarehouseTransfer>(`/api/pindah`, transfer),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pindah'])
      },
    }
  )
}

export const useGetWarehouseTransfersQuery = () => {
  return useQuery<WarehouseTransfer[], Error>(['pindah'], async () => {
    const response = await apiClient.get<WarehouseTransfer[]>(`/api/pindah`)
    return response.data
  })
}
type UpdatePpIdInput = {
  ref_number: string
  id: number
}
interface UseTransactionsParams {
  transDateFrom?: string | null
  transDateTo?: string | null
  selectedWarehouse?: string | null
}

export const useGetFilteredMutasisisQuery = ({
  transDateFrom,
  transDateTo,
  selectedWarehouse,
}: UseTransactionsParams) =>
  useQuery({
    queryKey: ['pindah', { selectedWarehouse, transDateFrom, transDateTo }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedWarehouse) params.append('warehouse_id', selectedWarehouse)

      if (transDateFrom) params.append('date_from', transDateFrom)
      if (transDateTo) params.append('date_to', transDateTo)

      const response = await apiClient.get<WarehouseTransfer[]>(
        `/api/pindah?${params.toString()}`
      )

      const filteredData = response.data.filter(
        (transaction) => transaction.code === 1
      )

      return filteredData
    },
    enabled: Boolean(transDateFrom && transDateTo),
  })

export const updateDenganIdUnikMutasiDariKledo = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ ref_number, id }: UpdatePpIdInput) => {
      return apiClient.put(`/api/pindah/by-id/${ref_number}`, {
        id,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pindah'])
      },
      onError: (error: any) => {
        console.error('Error updating ID and items:', error)
      },
    }
  )
}
export const useGetWarehouseTransferByRefQuery = (ref_number: string) => {
  return useQuery<WarehouseTransfer, Error>(
    ['pindah', ref_number],
    async () => {
      const response = await apiClient.get<WarehouseTransfer>(
        `/api/pindah/${ref_number}`
      )
      console.log('API Response:', response.data)

      return response.data
    }
  )
}
export const useUpdateWarehouseTransferMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    WarehouseTransfer,
    Error,
    { ref_number: string; updatedData: Partial<WarehouseTransfer> }
  >(
    async ({ ref_number, updatedData }) => {
      console.log('Sending updatedData:', updatedData) // Tambahkan log di sini

      const response = await apiClient.put<WarehouseTransfer>(
        `/api/pindah/${ref_number}`,
        updatedData
      )
      return response.data
    },
    {
      onSuccess: (data, { ref_number }) => {
        queryClient.invalidateQueries(['pindah', ref_number])
      },
    }
  )
}
export const useDeleteMutasiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (refNumber: string) => apiClient.delete(`/api/pindah/${refNumber}`),
    {
      onSuccess: () => {
        // After deletion, invalidate the query to refetch updated data
        queryClient.invalidateQueries(['pindah'])
      },
      onError: (error: AxiosError) => {
        // Handling error more specifically
        console.error('Error response:', error.response?.data) // Log for debugging
      },
    }
  )
}

export const useDeleteOutletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ ref_number }: { ref_number: string }) => {
      return apiClient.delete(`/api/pindah/${ref_number}/`)
    },
    {
      onSuccess: (_, { ref_number }) => {
        queryClient.invalidateQueries(['pindah', ref_number])
      },
    }
  )
}


export type UpdateEksekusiPayload = {
  _id: string;
  eksekusi: string;
};

export const useUpdateEkesekusiUntukToggle = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: UpdateEksekusiPayload) =>
      apiClient.put<WarehouseTransfer>(`/api/pindah/${payload._id}`, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pindah']);
      },
    }
  );
};
