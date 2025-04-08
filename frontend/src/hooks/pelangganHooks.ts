import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import apiClient from '../apiClient'
import { Pelanggan } from '../types/Pelanggan'
import { Contact } from '../types/Contact'

export const useGetPelanggansQueryDb = () =>
  useQuery({
    queryKey: ['contacts'],
    queryFn: async () =>
      (await apiClient.get<Pelanggan[]>(`/api/contacts`)).data,
  })


export const useGetPelanggansQueryGroupName = (name?: string) =>
  useQuery({
    queryKey: ['pelanggans', name],
    queryFn: async () =>
      (
        await apiClient.get<Pelanggan[]>(`/api/pelanggans`, {
          params: { name },
        })
      ).data,
    keepPreviousData: true, 
  })

export const useGetPelanggansQuery = () =>
  useQuery({
    queryKey: ['pelanggans'],
    queryFn: async () => {
      const response = await apiClient.get<{
        data: {
          id_outlet: number
          name: string
          phone: string
          address: string
          outlet_name: string


      
        }[]
        meta: { total: number }
      }>('/api/pelanggans/pelanggans')

      return response.data.data as Pelanggan[]
    },
  })
export const useGetThenAddPelanggansQuery = (
  batchSize: number,
  offset: number
) =>
  useQuery({
    queryKey: ['pelanggans', batchSize, offset],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: {
            id_outlet: number
            name: string
            phone: string
            address: string
            outlet_name: string
           
          }[]
          meta: { total: number }
        }>(`/api/pelanggans?limit=${batchSize}&offset=${offset}`)

        return response.data.data as Pelanggan[]
      } catch (error) {
        console.error('Error fetching pelanggans:', error)
        throw error
      }
    },
  })

export const useAddPelanggan = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (warehouse: Pelanggan) => {
      return apiClient.post<Pelanggan>(`/api/contacts`, warehouse)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['contacts'])
      },
    }
  )
}
export const useUpdatePelangganMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Contact) =>
      apiClient.put<Contact>(`/api/contacts/${murah._id}`, murah), // gunakan _id
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['contacts'])
      },
    }
  )
}
