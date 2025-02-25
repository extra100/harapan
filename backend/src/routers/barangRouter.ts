import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { BarangModel } from '../models/barangModel'

export const barangRouter = express.Router()

barangRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const barangs = await BarangModel.find()
      res.json(barangs)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

barangRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const productData = req.body
      delete productData._id

      const newProduct = await BarangModel.create(productData)
      res.status(201).json(newProduct)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)
barangRouter.put(
  "/:edi",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("📩 Request Diterima:", req.body);

    const { _id, id, name, code, price, pos_product_category_id, qty } = req.body;
    const cumaDisiniUsaha = await BarangModel.findById(req.params.edi);

    if (cumaDisiniUsaha) {
      console.log("🔍 Barang Ditemukan:", cumaDisiniUsaha);

      cumaDisiniUsaha.qty = qty || cumaDisiniUsaha.qty;
      const updateBarang = await cumaDisiniUsaha.save();

      console.log("✅ Barang Berhasil Diperbarui:", updateBarang);
      res.json(updateBarang);
    } else {
      console.log("❌ Barang Tidak Ditemukan!");
      res.status(404).json({ message: "Usaha not found" });
    }
  })
);

