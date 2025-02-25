import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
export const kategoriBarangRouter = express.Router()
import { KategoriBarangModel } from '../models/KategoriBarangModel'

kategoriBarangRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const contacts = await KategoriBarangModel.find()
      res.json(contacts)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)