import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { KategoryPenjualanModel } from '../models/KategoryPenjualanModel'

export const penjualanKategoryRouter = express.Router()
// penjualanKategoryRouter.get(
//     '/',
//     asyncHandler(async (req: Request, res: Response) => {
//       const bebas = await KategoryPenjualanModel.find({})
//       console.log("Data yang dikirim ke frontend:", bebas)  // Cek apakah data lengkap
//       res.json(bebas)
//     })
//   )
  
penjualanKategoryRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate, outletId } = req.query

    const filter: any = {}
    if (startDate && endDate) {
      filter.tanggal = { $gte: startDate, $lte: endDate }
    }
    if (outletId) {
      filter.id_outlet = outletId
    }

    const bebas = await KategoryPenjualanModel.find(filter)
    console.log("Data yang dikirim ke frontend:", bebas)  // Cek apakah data lengkap
    res.json(bebas)
  })
)

penjualanKategoryRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await KategoryPenjualanModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Harga not found' })
    }
  })
)

penjualanKategoryRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justHarga = await KategoryPenjualanModel.create(beudoang)
    res.status(201).json(justHarga)
  })
)

penjualanKategoryRouter.put(
    '/:edi',
    asyncHandler(async (req: Request, res: Response) => {
      const {
        id_outlet,
        outlet_name, 
        month, 
        atap, genteng_pasir, baja, baut, plafon, besi_kotak, triplek, asesoris, 
        spandek_pasir, besi, pipa_air, target 
      } = req.body
  
      const justHere = await KategoryPenjualanModel.findById(req.params.edi)
  
      if (justHere) {
        justHere.id_outlet = id_outlet || justHere.id_outlet
        justHere.outlet_name = outlet_name || justHere.outlet_name
        justHere.month = month || justHere.month
        justHere.atap = atap || justHere.atap
        justHere.genteng_pasir = genteng_pasir || justHere.genteng_pasir
        justHere.baja = baja || justHere.baja
        justHere.baut = baut || justHere.baut
        justHere.plafon = plafon || justHere.plafon
        justHere.besi_kotak = besi_kotak || justHere.besi_kotak
        justHere.triplek = triplek || justHere.triplek
        justHere.asesoris = asesoris || justHere.asesoris
        justHere.spandek_pasir = spandek_pasir || justHere.spandek_pasir
        justHere.besi = besi || justHere.besi
        justHere.pipa_air = pipa_air || justHere.pipa_air
        justHere.target = target || justHere.target
  
        const silahkanBebas = await justHere.save()
        res.json(silahkanBebas)
      } else {
        res.status(404).json({ message: 'Harga not found' })
      }
    })
  )
  

penjualanKategoryRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await KategoryPenjualanModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Harga deleted successfully' })
    } else {
      res.status(404).json({ message: 'Harga Not Found' })
    }
  })
)

export default penjualanKategoryRouter
