import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { TypeKontakModel } from '../models/typeKontakModel'

export const typeKontakRouter = express.Router()

typeKontakRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await TypeKontakModel.find({})
    res.json(bebas)
  })
)

typeKontakRouter.get(
  '/:die',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await TypeKontakModel.findById(req.params.die)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Satuan not found' })
    }
  })
)

typeKontakRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justSatuan = await TypeKontakModel.create(beudoang)
    res.status(201).json(justSatuan)
  })
)
typeKontakRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    const { type_kontak } = req.body

    const onlyHereSsatuan = await TypeKontakModel.findById(req.params.eid)

    if (onlyHereSsatuan) {
      onlyHereSsatuan.type_kontak = type_kontak || onlyHereSsatuan.type_kontak

      const updatedSatuan = await onlyHereSsatuan.save()
      res.json(updatedSatuan)
    } else {
      res.status(404).json({ message: 'Satuan not found' })
    }
  })
)


typeKontakRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await TypeKontakModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Satuan deleted successfully' })
    } else {
      res.status(404).json({ message: 'Satuan Not Found' })
    }
  })
)

export default typeKontakRouter
