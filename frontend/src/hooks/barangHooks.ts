import {
  QueryCache,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Barang } from '../types/Barang'

export const useGetBarangsQuery = () =>
  useQuery({
    queryKey: ['barangs'],
    queryFn: async () => (await apiClient.get<Barang[]>(`/api/barangs`)).data,
  })
export const useGetBarangByIdQuery = (name: any) =>
  useQuery<Barang[]>(
    ['contacts', name],
    async () => (await apiClient.get<Barang[]>(`/api/contacts/${name}`)).data
  )
export const useAddBarangMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Barang) => {
      return apiClient.post<Barang>(`/api/barangs`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['barangs'])
      },
    }
  )
}
export const useUpdateBarangMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (murah: Barang) =>
      apiClient.put<Barang>(`/api/barangs/${murah._id}`, murah), 
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['barangs'])
      },
    }
  )
}
