import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import NodeCache from 'node-cache'
import { HOST } from '../config'
import expressAsyncHandler from 'express-async-handler'

import TOKEN from '../token'
import asyncHandler from 'express-async-handler'
import { PelangganModel } from '../models/PelangganModel'

// }
const pelangganRouter = express.Router()


pelangganRouter.get(
  '/',
  asyncHandler(async (req: any, res: any) => {
    const { contactId } = req.query

    // Validasi `contactId`
    if (!contactId || isNaN(Number(contactId))) {
      return res.status(400).json({ message: 'Invalid contactId' })
    }

    try {
      const numericcontactId = Number(contactId)

      // Query transaksi berdasarkan `contactId` saja
      const pelanggans = await PelangganModel.find({
        id: numericcontactId,
      })


      // Mengembalikan hasil
      res.json(pelanggans)
    } catch (error) {
      console.error('Error querying pelanggans:', error)
      res.status(500).json({ message: 'Server error occurred.' })
    }
  })
)

const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchPelanggans = async (page: number, perPage: number) => {
  try {
    const response = await axios.get(
      `${HOST}/finance/contacts?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch pelanggans')
    }

    const rawData = response.data.data.data
    const filteredData: any[] = rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
      phone: item.phone || '-', // Set a default if missing
      address: item.address || '-', // Set a default if missing
      group_id: item.group_id ?? 0,
      group: item.group
        ? { id: item.group.id, name: item.group.name }
        : undefined,
    }))
    console.log({ filteredData })

    return {
      data: filteredData,
      total: response.data.data.total,
    }
  } catch (error) {
    console.error('Error fetching pelanggans by page:', error)
    throw new Error('Failed to fetch pelanggans by page')
  }
}

const fetchAllPelanggans = async (perPage: number): Promise<any[]> => {
  const cachedData = cache.get<any[]>('allPelangganes')
  if (cachedData) {
    console.log('Fetching data from cache...')
    return cachedData
  }

  let allPelangganes: any[] = []
  let page = 1

  const firstPageData = await fetchPelanggans(page, perPage)
  const totalPelanggans = firstPageData.total
  allPelangganes = firstPageData.data
  const totalPages = Math.ceil(totalPelanggans / perPage)

  const batchSize = 5
  for (let i = 2; i <= totalPages; i += batchSize) {
    const requests = []
    for (let j = i; j < i + batchSize && j <= totalPages; j++) {
      requests.push(fetchPelanggans(j, perPage))
    }

    const results = await Promise.all(requests)
    results.forEach((result) => {
      allPelangganes = allPelangganes.concat(result.data)
    })
  }

  cache.set('allPelangganes', allPelangganes)
  console.log('Data cached successfully.')

  return allPelangganes
}
pelangganRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = {
      id_outlet: req.body.id_outlet || 123,
      name: req.body.name,
      phone: req.body.phone || '-', 
      address: req.body.address || '-', 
      outlet_name: req.body.outlet_name || '-', 
     
    }

    try {
      const justPos = await PelangganModel.create(posData)
      res.status(201).json(justPos)
    } catch (error) {
      console.error('Error creating contact:', error)
      res.status(500).json({ message: 'Error creating contact', error })
    }
  })
)


pelangganRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { _id, id_outlet, name, outlet_name, id_kontak, address, phone } = req.body

    const cumaDisiniUsaha = await PelangganModel.findById(req.params.edi)

    if (cumaDisiniUsaha) {
      cumaDisiniUsaha._id = _id || cumaDisiniUsaha._id
      cumaDisiniUsaha.id_outlet = id_outlet || cumaDisiniUsaha.id_outlet
      cumaDisiniUsaha.name = name || cumaDisiniUsaha.name
      cumaDisiniUsaha.address = address || cumaDisiniUsaha.address
      cumaDisiniUsaha.phone = phone || cumaDisiniUsaha.phone
      cumaDisiniUsaha.outlet_name = outlet_name || cumaDisiniUsaha.outlet_name
      cumaDisiniUsaha.id_kontak = id_kontak || cumaDisiniUsaha.id_kontak

      const updateBarang = await cumaDisiniUsaha.save()
      res.json(updateBarang)
    } else {
      res.status(404).json({ message: 'Pelanggan not found' })
    }
  })
)

export default pelangganRouter
