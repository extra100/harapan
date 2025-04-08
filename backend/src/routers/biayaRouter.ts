import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { BiayaModel } from '../models/BiayaModel'

export const biayaRouter = express.Router()

biayaRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const contacts = await BiayaModel.find()
      res.json(contacts)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)


biayaRouter.post(
  '/',
  asyncHandler(async (req: any, res: any) => {
    const posData = {
      name: req.body.name,
      kategori: req.body.kategori || '-', 
     
    }


    try {
      const justPos = await BiayaModel.create(posData)
      res.status(201).json(justPos)
    } catch (error) {
      console.error('Error creating contact:', error)
      res.status(500).json({ message: 'Error creating contact', error })
    }
  })
)
biayaRouter.put(
  "/:edi",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("📩 Request Diterima:", req.body);

    const { _id, name, kategori } = req.body;
    const cumaDisiniUsaha = await BiayaModel.findById(req.params.edi);

    if (cumaDisiniUsaha) {
      console.log("🔍 Barang Ditemukan:", cumaDisiniUsaha);

      // Update qty & price (pastikan price dikonversi ke number)
      cumaDisiniUsaha.name = name || cumaDisiniUsaha.name;
      cumaDisiniUsaha.kategori = kategori || cumaDisiniUsaha.kategori;

      const updateBarang = await cumaDisiniUsaha.save();
      console.log("✅ Barang Berhasil Diperbarui:", updateBarang);
      res.json(updateBarang);
    } else {
      console.log("❌ Barang Tidak Ditemukan!");
      res.status(404).json({ message: "Barang tidak ditemukan" });
    }
  })
);