import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Biaya } from '../types/Biaya'
import { QueryCache } from '@tanstack/react-query'



export const useGetBiayasQuery = () =>
  useQuery({
    queryKey: ['biayas'],
    queryFn: async () => (await apiClient.get<Biaya[]>(`/api/biayas`)).data,
  })
  

export const useAddBiaya = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (warehouse: Biaya) => {
      return apiClient.post<Biaya>(`/api/biayas`, warehouse)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['biayas'])
      },
    }
  )
}
export const useUpdateBiayaMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(
      (murah: Biaya) =>
        apiClient.put<Biaya>(`/api/biayas/${murah._id}`, murah), 
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['biayas'])
        },
      }
    )
  }
  