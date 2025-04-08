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
      id_outlet: req.body.id_outlet || 123,
      id_kontak: req.body.id_kontak,
      name: req.body.name,
      phone: req.body.phone || '-', 
      address: req.body.address || '-', 
      outlet_name: req.body.outlet_name || '-', 
     
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
contactRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { _id, id_outlet, name, outlet_name, id_kontak, address, phone } = req.body

    const cumaDisiniUsaha = await ContactModel.findById(req.params.edi)

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
