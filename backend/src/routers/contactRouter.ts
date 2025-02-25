import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ContactModel } from '../models/contactModel'

export const contactRouter = express.Router()

contactRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const contacts = await ContactModel.find()
      res.json(contacts)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)
contactRouter.get(
  '/filter-by-outlet',
  asyncHandler(async (req: any, res: any) => {
    try {
      const { outlet_name } = req.query;
      if (!outlet_name) {
        return res.status(400).json({ message: 'Parameter outlet_name wajib diberikan.' });
      }

    
      const filteredContacts = await ContactModel.find({ outlet_name });

      res.json(filteredContacts);
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
);


contactRouter.post(
  '/',
  asyncHandler(async (req: any, res: any) => {

    const posData = {
      id: req.body.id,
      name: req.body.name,
      phone: req.body.phone || '-', 
      address: req.body.address || '-', 
      group_id: req.body.group_id ?? 0,
      outlet_name: req.body.group?.name || '-', 
      group: req.body.group
        ? { id: req.body.group.id, name: req.body.group.name }
        : undefined,
    }

    try {
      const justPos = await ContactModel.create(posData)
      res.status(201).json(justPos)
    } catch (error) {
      console.error('Error creating contact:', error)
      res.status(500).json({ message: 'Error creating contact', error })
    }
  })
)

// import express, { Request, Response, NextFunction } from 'express'
// import axios from 'axios'
// import NodeCache from 'node-cache'
// import { HOST } from '../config'
// import expressAsyncHandler from 'express-async-handler'
// import { ContactModel } from '../models/contactModel'

// type Contact = {
//   id: number
//   name: string
//   group_id: number

//   group?: {
//     id: number
//     name: string
//   }
// }

// const contactRouter = express.Router()
// const cache = new NodeCache({ stdTTL: 10000000000000000 })

// const fetchContacts = async (page: number, perPage: number) => {
//   try {
//     const response = await axios.get(
//       `${HOST}/finance/contacts?page=${page}&per_page=${perPage}`,
//       {
//         headers: {
//           Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MmQ2MzFiMC0wZDFjLTQzNWItOGZkYS0yYWI4YmE2YzVkM2EiLCJqdGkiOiIxMjQ3OTU4MzExMDE4NGVkYTIxMzkwMzYyMzNhMGEyZjI2ODE5MjcyMTNlN2QwZGZkM2M2OTQzYmJlMjg3ZGVjZmFlMDc0YmRhNDJlZTRiNyIsImlhdCI6MTcyNTg1NTQ2MS43OTYwNzgsIm5iZiI6MTcyNTg1NTQ2MS43OTYwODIsImV4cCI6MTcyODQ0NzQ2MS43ODQzNzIsInN1YiI6IjE5NDYyNyIsInNjb3BlcyI6WyJ3ZWIiLCJmaW5hbmNlIl19.mKmUzBRjo4GieuE8s1tQeWQebRNLHMRDj2bGmQpsoUW_gWVHxEuRSqpBYz0k0-m2xx4daoVTePH2dv5kS4CFwhGpPEP4r0_neYjsBw7OBSK2_T13nv7HTvLIvD1zakTggKG3W8vYwTn4q2aqyIOes3saivC_8PV7ELDxk21Cs2nGIDUGcM2sxnIhOHkKnhb2qfokBabLPvk4NC2fc5iB4PNlakKHGcKhf5uu06oVah4za7mGhbu-S8jlQqYW9453dXflAEaQpcxl4jIxtjiBazp0sr79B9GiSo_0bp4qhYGq1dpc49YXm1bQmz5ZdaxuZHXpivrZ0a0l8fLnstXHhnikXDb6BGpZzB6w23ncwiQO-eENmVvJ0FIqbFnUZdnnNZvmUzbPQ8_nFNiBd5wnJMlrCkvzIJXYJjSSHgRMR_LIQA-KmW-bEPZy2nLytAj34nOUeVmMOalkoZf90goL--hFV69esHpV_h8NlS4hmJ3P_Ns-cl4kCBIMg0FWKNx4JEpHMjslaVvB0b8UqccJ2U_cBj5OuStVFm6NC4JLkcNIuv1iDkVKhFP_qsH3J-FbTOpV5Kp87M70cDKH1SsUJZDEpj0lf-9r6fSx8DpNEh3OH8RGq-dP-pQq6QPCRbzEZP7JmsZYGvoKN5NRwvz2vkr1yQnLTklLzBX7wSf60F0`,
//         },
//       }
//     )

//     if (response.status !== 200) {
//       throw new Error('Failed to fetch contacts')
//     }

//     const rawData = response.data.data.data

//     const filteredData: Contact[] = rawData.map((item: any) => ({
//       id: item.id,
//       name: item.name,
//       group_id: item.group_id,

//       group: item.group
//         ? { id: item.group.id, name: item.group.name }
//         : undefined,
//     }))

//     console.log(JSON.stringify(filteredData, null, 2))

//     return {
//       data: filteredData,
//       total: response.data.data.total,
//     }
//   } catch (error) {
//     console.error('Error fetching contacts by page:', error)
//     throw new Error('Failed to fetch contacts by page')
//   }
// }

// const fetchAllContacts = async (perPage: number): Promise<Contact[]> => {
//   const cachedData = cache.get<Contact[]>('allContactes')
//   if (cachedData) {
//     console.log('Fetching data from cache...')
//     return cachedData
//   }

//   let allContactes: Contact[] = []
//   let page = 1

//   const firstPageData = await fetchContacts(page, perPage)
//   const totalContacts = firstPageData.total
//   allContactes = firstPageData.data
//   const totalPages = Math.ceil(totalContacts / perPage)

//   const batchSize = 5
//   for (let i = 2; i <= totalPages; i += batchSize) {
//     const requests = []
//     for (let j = i; j < i + batchSize && j <= totalPages; j++) {
//       requests.push(fetchContacts(j, perPage))
//     }

//     const results = await Promise.all(requests)
//     results.forEach((result) => {
//       allContactes = allContactes.concat(result.data)
//     })
//   }

//   cache.set('allContactes', allContactes)
//   console.log('Data cached successfully.')

//   return allContactes
// }
// contactRouter.post(
//   '/',
//   expressAsyncHandler(async (req, res) => {
//     const posData = req.body

//     const justPos = await ContactModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )

// contactRouter.get(
//   '/contacts',
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const perPage = parseInt(req.query.per_page as string) || 15

//       const allContactes = await fetchAllContacts(perPage)

//       res.json({
//         success: true,
//         data: allContactes,
//         meta: {
//           total: allContactes.length,
//         },
//       })
//     } catch (error) {
//       console.error('Error fetching all contacts:', error)
//       res.status(500).json({ error: 'Internal Server Error' })
//     }
//   }
// )

// export default contactRouter

// import express, { Request, Response, NextFunction } from 'express'
// import NodeCache from 'node-cache'
// import expressAsyncHandler from 'express-async-handler'
// import { ContactModel } from '../models/contactModel'

// type Contact = {
//   id: string
//   name: string
//   group_id: string
//   group_name: string
// }

// const contactRouter = express.Router()
// const cache = new NodeCache({ stdTTL: 10000000000000000 })

// const fetchContactsByPage = async (page: number, perPage: number) => {
//   try {
//     const skip = (page - 1) * perPage
//     const contacts = await ContactModel.find({}).skip(skip).limit(perPage)

//     const totalContacts = await ContactModel.countDocuments()

//     const filteredData: Contact[] = contacts.map((contact: any) => ({
//       id: contact.id,
//       name: contact.name,
//       group_id: contact.group_id,
//       group_name: contact.group_name,
//     }))

//     return {
//       data: filteredData,
//       total: totalContacts,
//     }
//   } catch (error) {
//     console.error('Error fetching contacts by page:', error)
//     throw new Error('Failed to fetch contacts by page')
//   }
// }

// const fetchAllContacts = async (perPage: number): Promise<Contact[]> => {
//   const cachedData = cache.get<Contact[]>('allContacts')
//   if (cachedData) {
//     console.log('Fetching data from cache...')
//     return cachedData
//   }

//   let allContacts: Contact[] = []
//   let page = 1

//   const firstPageData = await fetchContactsByPage(page, perPage)
//   const totalContacts = firstPageData.total
//   allContacts = firstPageData.data
//   const totalPages = Math.ceil(totalContacts / perPage)

//   const batchSize = 5
//   for (let i = 2; i <= totalPages; i += batchSize) {
//     const requests = []
//     for (let j = i; j < i + batchSize && j <= totalPages; j++) {
//       requests.push(fetchContactsByPage(j, perPage))
//     }

//     const results = await Promise.all(requests)
//     results.forEach((result) => {
//       allContacts = allContacts.concat(result.data)
//     })
//   }
//   cache.set('allContacts', allContacts)
//   console.log('Data cached successfully.')

//   return allContacts
// }

// contactRouter.get('/contacts', async (req: Request, res: Response) => {
//   try {
//     res.json({ message: 'Endpoint is working' })
//   } catch (error) {
//     console.error('Error:', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// })

// export default contactRouter
