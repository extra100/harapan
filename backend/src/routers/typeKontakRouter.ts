import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { TypeKontakModel } from '../models/typeKontakModel'

const typeKontakRouter = express.Router()

typeKontakRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const semua = await TypeKontakModel.find({})
    res.json(semua)
  })
)

typeKontakRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await TypeKontakModel.findById(req.params.id)
    if (data) {
      res.json(data)
    } else {
      res.status(404).json({ message: 'TypeKontak not found' })
    }
  })
)

typeKontakRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const newData = req.body
    delete newData._id
    const created = await TypeKontakModel.create(newData)
    res.status(201).json(created)
  })
)

typeKontakRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { type_kontak } = req.body
    const data = await TypeKontakModel.findById(req.params.id)

    if (data) {
      data.type_kontak = type_kontak || data.type_kontak
      const updated = await data.save()
      res.json(updated)
    } else {
      res.status(404).json({ message: 'TypeKontak not found' })
    }
  })
)

typeKontakRouter.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const deleted = await TypeKontakModel.findByIdAndDelete(req.params.id)
    if (deleted) {
      res.json({ message: 'TypeKontak deleted successfully' })
    } else {
      res.status(404).json({ message: 'TypeKontak not found' })
    }
  })
)

export default typeKontakRouter
