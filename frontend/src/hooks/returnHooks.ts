import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Return } from '../types/Return'

export const useAddReturnMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (regak: Return) => {
      const { sales_id, ...dataToSend } = regak
      console.log('Data to Send:', dataToSend)

      return apiClient.post<Return>(`/api/returns`, dataToSend)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returns'])
      },
    }
  )
}

export const useGetReturnssQuery = () =>
  useQuery({
    queryKey: ['returns'],
    queryFn: async () => (await apiClient.get<Return[]>(`/api/returns`)).data,
  })

export const useGetReturnByIdQuery = (memo: string) =>
  useQuery<Return[]>(
    ['returns', memo],
    async () => {
      try {
        const response = await apiClient.get<Return[]>(
          `/api/returns/${memo}`
        )
        return response.data
      } catch (error) {
        throw new Error('Failed to fetch return data')
      }
    },
    {
      enabled: !!memo,
    }
  )

export const updateDenganIdUnikReturnDariKledo = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ memo, id }: any) => {
      return apiClient.put(`/api/returns/by-id/${memo}`, {
        id,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returns'])
      },
      onError: (error: any) => {
        console.error('Error updating ID and items:', error)
      },
    }
  )
}
