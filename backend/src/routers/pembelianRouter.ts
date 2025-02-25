import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { PembelianModel } from '../models/PembelianModel'

export const pembelianRouter = express.Router()
import dayjs from 'dayjs'
pembelianRouter.get(
  '/discount-summary',
  asyncHandler(async (req: Request, res: Response) => {
    const { start_date, end_date } = req.query;

    const matchStage: any = {
      reason_id: "unvoid", // ✅ Filter reason_id langsung dari transaksi
    };

    if (start_date && end_date) {
      matchStage.trans_date = {
        $gte: start_date,
        $lte: end_date,
      };
    }

    const discountSummary = await PembelianModel.aggregate([
      { $match: matchStage }, // ✅ Filter hanya transaksi dengan reason_id "unvoid"
      { $unwind: "$items" }, // Membuka array items
      {
        $group: {
          _id: {
            warehouse_id: "$warehouse_id",
            discount_percent: "$items.discount_percent",
          },
          total_discount_amount: { $sum: "$items.discount_amount" },
          invoice_ids: { $addToSet: "$_id" }, // Mengumpulkan transaksi unik (nota)
        },
      },
      {
        $project: {
          _id: 0,
          warehouse_id: "$_id.warehouse_id",
          discount_percent: "$_id.discount_percent",
          total_discount_amount: 1,
          invoice_count: { $size: "$invoice_ids" }, // Menghitung jumlah nota unik
        },
      },
      { $sort: { warehouse_id: 1, discount_percent: 1 } },
    ]);

    res.json(discountSummary);
  })
);

pembelianRouter.get(
  '/qty-summary',
  asyncHandler(async (req: Request, res: Response) => {
    const { start_date, end_date } = req.query;

    const matchStage: any = {
      reason_id: "unvoid", // ✅ Filter reason_id langsung dari transaksi
    };

    if (start_date && end_date) {
      matchStage.trans_date = {
        $gte: start_date,
        $lte: end_date,
      };
    }

    const discountSummary = await PembelianModel.aggregate([
      { $match: matchStage }, // ✅ Filter hanya transaksi dengan reason_id "unvoid"
      { $unwind: "$items" }, // Membuka array items
      {
        $group: {
          _id: {
            warehouse_id: "$warehouse_id",
            finance_account_id: "$items.finance_account_id",
          },
          total_qty: { $sum: "$items.qty" },
          invoice_ids: { $addToSet: "$_id" }, // Mengumpulkan transaksi unik (nota)
        },
      },
      {
        $project: {
          _id: 0,
          warehouse_id: "$_id.warehouse_id",
          qty: "$_id.qty",
          finance_account_id: "$_id.finance_account_id",
          total_qty: 1,
        },
      },
      { $sort: { warehouse_id: 1, qty: 1 } },
    ]);

    res.json(discountSummary);
  })
);

pembelianRouter.get(
  '/',
  asyncHandler(async (req: any, res: any) => {
    const { warehouseId, startDate, endDate } = req.query

    if (!warehouseId || isNaN(Number(warehouseId))) {
      return res.status(400).json({ message: 'Invalid warehouseId' })
    }

    try {
      const numericWarehouseId = Number(warehouseId)

      // Format tanggal
      const todayDate = dayjs().format('YYYY-MM-DD')
      const formattedStartDate = startDate
        ? dayjs(startDate).format('YYYY-MM-DD')
        : todayDate
      const formattedEndDate = endDate
        ? dayjs(endDate).format('YYYY-MM-DD')
        : todayDate

      // Validasi range tanggal
      if (formattedStartDate > formattedEndDate) {
        return res.status(400).json({ message: 'Invalid date range' })
      }

      // Query berdasarkan rentang tanggal
      let pembelians
      const dateFilter = {
        trans_date: {
          $gte: formattedStartDate,
          $lte: formattedEndDate,
        },
      }

      if (numericWarehouseId === 2) {
        pembelians = await PembelianModel.find(dateFilter)
      } else {
        pembelians = await PembelianModel.find({
          warehouse_id: numericWarehouseId,
          ...dateFilter,
        })
      }

      res.json(pembelians)
    } catch (error) {
      console.error('Error querying pembelians:', error)
      res.status(500).json({ message: 'Server error occurred.' })
    }
  })
)
pembelianRouter.get(
  '/by-contact/:contact_id',
  asyncHandler(async (req: any, res: any) => {
    const contact_id = parseInt(req.params.contact_id, 10);
    if (isNaN(contact_id)) {
      return res.status(400).json({ message: 'Invalid contact_id' });
    }

    const posData = await PembelianModel.find({ contact_id: contact_id });

    if (posData && posData.length > 0) {
      res.json(posData);
    } else {
      res.status(404).json({ message: 'Pembelians not found' });
    }
  })
);

//   asyncHandler(async (req: any, res: any) => {
//     const idBarang = parseInt(req.params.idBarang, 10); // Correctly access `idBarang`
//     if (isNaN(idBarang)) {
//       return res.status(400).json({ message: 'Invalid idBarang' });
//     }

//     // Query pembelians where any item's `finance_account_id` matches `idBarang`
//     const posData = await PembelianModel.find({
//       'items.finance_account_id': idBarang,
//     });

//     if (posData && posData.length > 0) {
//       res.json(posData);
//     } else {
//       res.status(404).json({ message: 'Pembelians not found' });
//     }
//   })
// );
pembelianRouter.get(
  '/by-name/:name',
  asyncHandler(async (req: any, res: any) => {
    const name = decodeURIComponent(req.params.name);
    console.log('Received name:', name);

    if (!name) {
      return res.status(400).json({ message: 'Invalid name' });
    }

    try {
      const posData = await PembelianModel.find({
        'items.name': name,
      });

      console.log('Query result:', posData);

      if (posData && posData.length > 0) {
        res.json(posData);
      } else {
        res.status(404).json({ message: 'Pembelians not found' });
      }
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

pembelianRouter.get(
  '/filter',
  asyncHandler(async (req: Request, res: Response) => {
    const { trans_date, warehouse_id, contact_id } = req.query;
    
    const filter: any = {};
    
    if (trans_date) {
      filter.trans_date = trans_date;
    }
    if (warehouse_id) {
      filter.warehouse_id = Number(warehouse_id);
    }
    if (contact_id) {
      filter.contact_id = Number(contact_id);
    }
    
    const pembelians = await PembelianModel.find(filter);
    res.json(pembelians);
  })
);

pembelianRouter.get(
  '/:ref_number',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await PembelianModel.find({
      ref_number: req.params.ref_number,
    })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await PembelianModel.findById(req.params.ref_number)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)

pembelianRouter.post(
  '/',
  asyncHandler(async (req: any, res: any) => {
    const posData = req.body

    // Cek apakah sudah ada transaksi dengan memo yang sama
    const existingPembelian = await PembelianModel.findOne({ memo: posData.memo })

    if (existingPembelian) {
      return res.status(400).json({ message: 'Transaksi dengan memo yang sama sudah ada!' })
    }

    const justPos = await PembelianModel.create(posData)
    res.status(201).json(justPos)
  })
)


pembelianRouter.get(
  '/',
  asyncHandler(async (req: any, res: any) => {
    const { warehouseId, startDate, endDate } = req.query

    if (!warehouseId || isNaN(Number(warehouseId))) {
      return res.status(400).json({ message: 'Invalid warehouseId' })
    }

    try {
      const numericWarehouseId = Number(warehouseId)

      // Format tanggal
      const todayDate = dayjs().format('YYYY-MM-DD')
      const formattedStartDate = startDate
        ? dayjs(startDate).format('YYYY-MM-DD')
        : todayDate
      const formattedEndDate = endDate
        ? dayjs(endDate).format('YYYY-MM-DD')
        : todayDate
      if (formattedStartDate > formattedEndDate) {
        return res.status(400).json({ message: 'Invalid date range' })
      }

      let pembelians
      const dateFilter = {
        trans_date: {
          $gte: formattedStartDate,
          $lte: formattedEndDate,
        },
      }

      if (numericWarehouseId === 2) {
        pembelians = await PembelianModel.find(dateFilter)
      } else {
        pembelians = await PembelianModel.find({
          warehouse_id: numericWarehouseId,
          ...dateFilter,
        })
      }

      res.json(pembelians)
    } catch (error) {
      console.error('Error querying pembelians:', error)
      res.status(500).json({ message: 'Server error occurred.' })
    }
  })
)



pembelianRouter.put(
  '/by-id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    const pembelian = await PembelianModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!pembelian) {
      return res.status(404).json({ message: 'Pembelian not found' })
    }

    if (req.body.id) {
      pembelian.id = req.body.id
    }

    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      pembelian.items = pembelian.items.map((item) => {
        // cocokan payload kence database
        const updatedItem = req.body.items.find(
          (i: any) => i.finance_account_id === item.finance_account_id
        )

        if (updatedItem) {
          // update isi items isik data bru
          return { ...item, id: updatedItem.id }
        }

        return item
      })

      // Simpan jok database
      const updatedPembelian = await pembelian.save()

      res.json(updatedPembelian)
    }
  })
)

type Witholding = {
  _id: string // Properti _id harus ada
  down_payment: number
  status: number
  witholding_account_id?: number
  witholding_amount?: number
  witholding_percent?: number
  trans_date?: string
  name?: string
}
pembelianRouter.put(
  '/by-memo/:memo',
  asyncHandler(async (req: any, res: any) => {
    // Cari transaksi berdasarkan memo
    const pembelian = await PembelianModel.findOne({
      memo: req.params.memo,
    })

    if (!pembelian) {
      return res.status(404).json({ message: 'Pembelian not found' })
    }

    // Perbarui ID transaksi jika tersedia dalam body request
    if (req.body.id) {
      // console.log('Updating ID:', req.body.id)
      pembelian.id = req.body.id
    }
    if (req.body.amount) {
      console.log('Updating amount:', req.body.amount);
      pembelian.amount = req.body.amount;
    }

    // Perbarui due jika ada
    if (req.body.due) {
      // console.log('Updating due:', req.body.due);
      pembelian.due = req.body.due;
    }

    // Perbarui item jika ada
    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      pembelian.items = pembelian.items.map((item) => {
        const updatedItem = req.body.items.find(
          (i: any) => i.finance_account_id === item.finance_account_id
        )

        if (updatedItem) {
          return {
            ...item,
            id: updatedItem.id,
            price: updatedItem.price,
            amount: updatedItem.amount,
            discount_amount: updatedItem.discount_amount,
          }
        }

        return item
      })
    }

    // Perbarui witholdings berdasarkan _id
    if (
      Array.isArray(req.body.witholdings) &&
      req.body.witholdings.length > 0
    ) {
      req.body.witholdings.forEach((updateWitholding: any) => {
        if (updateWitholding._id) {
          // Cari elemen berdasarkan _id
          const targetWitholding = pembelian.witholdings.find(
            (witholding: any) =>
              witholding._id.toString() === updateWitholding._id
          )

          if (targetWitholding) {
            // Update elemen yang ditemukan
            Object.assign(targetWitholding, {
              // down_payment: updateWitholding.down_payment,
              status: updateWitholding.status,
              witholding_account_id: updateWitholding.witholding_account_id,
              witholding_amount: updateWitholding.witholding_amount,
              witholding_percent: updateWitholding.witholding_percent,
              trans_date: updateWitholding.trans_date,
              name: updateWitholding.name,
              id: updateWitholding.id,
            })
          } else {
            console.log(
              `Skipping update: Witholding with _id ${updateWitholding._id} not found in pembelian.`
            )
          }
        } else {
          console.log(
            'Skipping witholding update due to missing _id:',
            updateWitholding
          )
        }
      })
    } else {
      console.log('No witholding data received or witholdings array is empty.')
    }

    // Simpan perubahan ke database
    try {
      const updatedPembelian = await pembelian.save()
      console.log('Pembelian Updated:', updatedPembelian)

      // Kembalikan respon JSON
      res.json(updatedPembelian)
    } catch (err) {
      console.error('Error while saving updated pembelian:', err)
      res.status(500).json({ message: 'Failed to update pembelian.' })
    }
  })
)

pembelianRouter.put(
  '/by-contact_id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    console.log('Ref Number in Request:', req.params.ref_number)

    const pembelian = await PembelianModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!pembelian) {
      return res.status(404).json({ message: 'Pembelian not found' })
    }

    if (req.body.contact_id) pembelian.contact_id = req.body.contact_id
    if (req.body.term_id) pembelian.term_id = req.body.term_id
    if (req.body.trans_date) pembelian.trans_date = req.body.trans_date
    if (req.body.due_date) pembelian.due_date = req.body.due_date
    if (req.body.id) pembelian.id = req.body.id

    if (Array.isArray(req.body.contacts) && req.body.contacts.length > 0) {
      pembelian.contacts = req.body.contacts
    }
    if (Array.isArray(req.body.tages) && req.body.tages.length > 0) {
      pembelian.tages = req.body.tages
    }
    const updatedPembelian = await pembelian.save()
    return res.json(updatedPembelian)
  })
)

pembelianRouter.put(
  '/full-update/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    const pembelian = await PembelianModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!pembelian) {
      return res.status(404).json({ message: 'Pembelian not found' })
    }

    if (req.body.witholdings && Array.isArray(req.body.witholdings)) {
      pembelian.witholdings = req.body.witholdings
    }

    if (req.body.reason_id) {
      pembelian.reason_id = req.body.reason_id
    }

    const updatedPembelian = await pembelian.save()

    res.json(updatedPembelian)
  })
)

pembelianRouter.delete(
  '/:ref_number/witholdings/:witholdingId',
  asyncHandler(async (req: Request, res: Response) => {
    console.log('Request params:', req.params)

    const { ref_number, witholdingId } = req.params
    const pembelian = await PembelianModel.findOne({ ref_number })

    if (pembelian) {
      console.log('Pembelian found:', pembelian)

      pembelian.witholdings = pembelian.witholdings.filter(
        (witholding: any) => witholding._id.toString() !== witholdingId
      )

      await pembelian.save()
      console.log('Witholding removed successfully')
      res.json({ message: 'Witholding removed successfully' })
    } else {
      console.error('Pembelian not found')
      res.status(404).json({ message: 'Pembelian not found' })
    }
  })
)

pembelianRouter.patch(
  '/:ref_number/witholding/:witholdingId',
  asyncHandler(async (req: any, res: any) => {
    const { ref_number, witholdingId } = req.params
    const { status } = req.body

    const pembelian = await PembelianModel.findOne({
      ref_number,
      'witholdings._id': witholdingId,
    })

    if (!pembelian) {
      return res
        .status(404)
        .json({ message: 'Pembelian or witholding not found' })
    }

    const withholding = pembelian.witholdings.find(
      (witholding: any) => witholding._id.toString() === witholdingId
    )

    if (!withholding) {
      return res.status(404).json({ message: 'Withholding not found' })
    }

    withholding.status = status // Update the percent

    await pembelian.save()
    res.status(200).json({ message: 'Withholding updated successfully' })
  })
)

export default pembelianRouter

pembelianRouter.put(
  '/:ref_number/witholdings/:witholdingId',
  asyncHandler(async (req: any, res: any) => {
    const { ref_number, witholdingId } = req.params
    const { trans_date, down_payment } = req.body

    // Cek apakah ref_number dan witholdingId ada
    if (!ref_number || !witholdingId) {
      return res
        .status(400)
        .json({ message: 'Missing ref_number or witholdingId' })
    }

    // Cari transaksi berdasarkan ref_number
    const pembelian = await PembelianModel.findOne({ ref_number })
    if (!pembelian) {
      return res.status(404).json({ message: 'Pembelian not found' })
    }

    // Cari witholding yang sesuai dengan witholdingId
    const witholding = pembelian.witholdings.find(
      (item: any) => item._id.toString() === witholdingId
    )

    if (!witholding) {
      return res.status(404).json({ message: 'Witholding not found' })
    }

    // Update fields with new values
    witholding.trans_date = trans_date || witholding.trans_date
    witholding.down_payment = down_payment || witholding.down_payment

    // Simpan transaksi yang sudah diperbarui
    await pembelian.save()

    // Kirim kembali data transaksi yang sudah diperbarui
    res.json(pembelian)
  })
)
