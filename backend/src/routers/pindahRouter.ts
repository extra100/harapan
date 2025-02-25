import asyncHandler from 'express-async-handler'
import { WarehouseTransferModel } from '../models/pindahModel'
import express, { Request, Response } from 'express'
import dayjs from 'dayjs'

export const warehouseTransferRouter = express.Router()
warehouseTransferRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { date_from, date_to, warehouse_id } = req.query

    const conditions: any = {}

    if (date_from && date_to) {
      conditions.trans_date = date_from
      console.log('Date conditionsssss:', conditions.trans_date)
    }

    if (warehouse_id) {
      conditions.warehouse_id = Number(warehouse_id)
      console.log('Warehouse conditioneee:', conditions.warehouse_id)
    }

    const transactions = await WarehouseTransferModel.find(conditions)

    res.json(transactions)
  })
)

warehouseTransferRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const transferData = req.body

      const addTransfer = await WarehouseTransferModel.findOneAndUpdate(
        { ref_number: transferData.ref_number },
        transferData,
        { new: true, upsert: true }
      )
      res.status(200).json(addTransfer)
    } catch (error) {
      console.error('Error saat membuat transfer:', error)
      res.status(500).json({ message: 'Terjadi kesalahan pada server' })
    }
  })
)
warehouseTransferRouter.get(
  '/by-warehouseanddate',
  asyncHandler(async (req: any, res: any) => {
    const { warehouseId, startDate, endDate } = req.query;

    console.log('Request received with parameters:', { warehouseId, startDate, endDate }); // Log parameter yang diterima

    if (!warehouseId || isNaN(Number(warehouseId))) {
      return res.status(400).json({ message: 'Invalid warehouseId' });
    }

    try {
      const numericWarehouseId = Number(warehouseId);

      // Format tanggal
      const todayDate = dayjs().format('YYYY-MM-DD');
      const formattedStartDate = startDate
        ? dayjs(startDate).format('YYYY-MM-DD')
        : todayDate;
      const formattedEndDate = endDate
        ? dayjs(endDate).format('YYYY-MM-DD')
        : todayDate;

      console.log('Formatted Dates:', { formattedStartDate, formattedEndDate }); // Log tanggal yang telah diformat

      if (formattedStartDate > formattedEndDate) {
        return res.status(400).json({ message: 'Invalid date range' });
      }

      let transactions;
      const dateFilter = {
        trans_date: {
          $gte: formattedStartDate,
          $lte: formattedEndDate,
        },
      };

      console.log('Date filter applied:', dateFilter); // Log filter tanggal yang digunakan di query

      if (numericWarehouseId === 2) {
        transactions = await WarehouseTransferModel.find(dateFilter);
      } else {
        transactions = await WarehouseTransferModel.find({
          from_warehouse_id: numericWarehouseId,
          ...dateFilter,
        });
      }

      console.log('Transactions found:', transactions); // Log transaksi yang ditemukan
      console.log('Received parameters:', { warehouseId, startDate, endDate });
      console.log('Formatted Dates:', { formattedStartDate, formattedEndDate });
      console.log('Query filter:', dateFilter);
      
      res.json(transactions);
    } catch (error) {
      console.error('Error querying transactions:', error);
      res.status(500).json({ message: 'Server error occurred.' });
    }
  })
);

warehouseTransferRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const transfers = await WarehouseTransferModel.find()
      res.status(200).json(transfers)
    } catch (error) {
      console.error('Error saat mengambil transfer:', error)
      res.status(500).json({ message: 'Terjadi kesalahan pada server' })
    }
  })
)

warehouseTransferRouter.get(
  '/:ref_number',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await WarehouseTransferModel.find({
      ref_number: req.params.ref_number,
    })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await WarehouseTransferModel.findById(
        req.params.ref_number
      )
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)
warehouseTransferRouter.get(
  '/by-idGudang/:idGudang',
  asyncHandler(async (req: any, res: any) => {
    const idGudang = parseInt(req.params.idGudang); // Match parameter name
    if (isNaN(idGudang)) {
      return res.status(400).json({ message: 'Invalid idGudang' });
    }

    const posData = await WarehouseTransferModel.find({ to_warehouse_id: idGudang });


    if (posData && posData.length > 0) {
      res.json(posData);
    } else {
      res.status(404).json({ message: 'Gudang not found' });
    }
  })
);


warehouseTransferRouter.get(
  '/by-warehouseanddate',
  asyncHandler(async (req: any, res: any) => {
    console.log('Handler executed'); // Log tambahan

    const { warehouseId, startDate, endDate } = req.query;

    if (!warehouseId || isNaN(Number(warehouseId))) {
      console.log('Invalid warehouseId:', warehouseId); // Log tambahan
      return res.status(400).json({ message: 'Invalid warehouseId' });
    }

    try {
      const numericWarehouseId = Number(warehouseId);

      // Use today's date if no startDate or endDate are provided
      const todayDate = dayjs().format('YYYY-MM-DD');
      const formattedStartDate = startDate
        ? dayjs(startDate).format('YYYY-MM-DD')
        : todayDate;
      const formattedEndDate = endDate
        ? dayjs(endDate).format('YYYY-MM-DD')
        : todayDate;

      // Ensure valid date range
      if (formattedStartDate > formattedEndDate) {
        console.log('Invalid date range'); // Log tambahan
        return res.status(400).json({ message: 'Invalid date range' });
      }

      // Set up the date range filter for the query
      const dateFilter = {
        trans_date: {
          $gte: formattedStartDate,
          $lte: formattedEndDate,
        },
      };

      let pindah;
      // If the warehouseId is 2, get the first matching record (you can modify if needed)
      if (numericWarehouseId === 2) {
        pindah = await WarehouseTransferModel.find(dateFilter);
      } else {
        // If not, find records where the `to_warehouse_id` matches and the date filter applies
        pindah = await WarehouseTransferModel.find({
          from_warehouse_id: numericWarehouseId,
          ...dateFilter,
        });
      }

      console.log('Fetched data:', pindah); // Log data that is fetched

      // Send the data as response
      res.json(pindah);
    } catch (error) {
      console.error('Error querying pindah:', error); // Log error
      res.status(500).json({ message: 'Server error occurred.' });
    }
  })
);




warehouseTransferRouter.put(
  '/by-id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    const mutation = await WarehouseTransferModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!mutation) {
      return res.status(404).json({ message: 'Mutasi Tak Ditemukan' })
    }

    if (req.body.id) {
      mutation.id = req.body.id
    }

    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      mutation.items = mutation.items.map((item) => {
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
      const updatedMutation = await mutation.save()

      res.json(updatedMutation)
    }
  })
)
warehouseTransferRouter.put(
  '/by-id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    // Cari mutasi berdasarkan `ref_number`
    const mutation = await WarehouseTransferModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!mutation) {
      return res.status(404).json({ message: 'Mutasi Tak Ditemukan' })
    }

    // Perbarui hanya `id` jika ada di body request
    if (req.body.id) {
      mutation.id = req.body.id
    } else {
      return res.status(400).json({ message: 'ID tidak ditemukan di payload' })
    }

    // Simpan perubahan ke database
    const updatedMutation = await mutation.save()

    // Kirim respons dengan data yang diperbarui
    res.json(updatedMutation)
  })
)

warehouseTransferRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      let warehouseTransfer = await WarehouseTransferModel.findOne({
        ref_number: req.params.eid,
      })

      if (!warehouseTransfer) {
        warehouseTransfer = await WarehouseTransferModel.findById(
          req.params.eid
        )
      }

      if (warehouseTransfer) {
        const {
          from_warehouse_id,
          to_warehouse_id,
          from_warehouse_name,
          to_warehouse_name,
          ref_number,
          memo,
          items,
          attachment,
          trans_date,
          eksekusi,
          code, // Ambil code dari req.body
        } = req.body

        warehouseTransfer.from_warehouse_id =
          from_warehouse_id || warehouseTransfer.from_warehouse_id
          
        warehouseTransfer.eksekusi =
        eksekusi || warehouseTransfer.eksekusi
        warehouseTransfer.to_warehouse_id =
          to_warehouse_id || warehouseTransfer.to_warehouse_id
        warehouseTransfer.from_warehouse_name =
          from_warehouse_name || warehouseTransfer.from_warehouse_name
        warehouseTransfer.to_warehouse_name =
          to_warehouse_name || warehouseTransfer.to_warehouse_name
        warehouseTransfer.ref_number =
          ref_number || warehouseTransfer.ref_number
        warehouseTransfer.memo = memo || warehouseTransfer.memo
        warehouseTransfer.items = items || warehouseTransfer.items
        warehouseTransfer.attachment =
          attachment || warehouseTransfer.attachment
        warehouseTransfer.trans_date =
          trans_date || warehouseTransfer.trans_date

        // Update code
        warehouseTransfer.code = code || warehouseTransfer.code

        const updatedTransfer = await warehouseTransfer.save()

        res.status(200).json(updatedTransfer)
      } else {
        res.status(404).json({ message: 'Warehouse transfer not found' })
      }
    } catch (error) {
      console.error('Error updating warehouse transfer:', error)
      res.status(500).json({ message: 'Server error' })
    }
  })
)
warehouseTransferRouter.delete(
  '/:refNumber', // Use refNumber instead of idin
  asyncHandler(async (req, res) => {
    const { refNumber } = req.params
    const transfer = await WarehouseTransferModel.findOneAndDelete({
      ref_number: refNumber,
    })

    if (transfer) {
      res.json({ message: 'Data deleted successfully' })
    } else {
      res.status(404).json({ message: 'Data not found' })
    }
  })
)
warehouseTransferRouter.put(
  '/:id',
  asyncHandler(async (req: any, res: any) => {
    const { id } = req.params; // Ambil ID dari parameter URL
    const { eksekusi } = req.body; // Ambil data eksekusi dari body request

    try {
      // Validasi input jika diperlukan
      if (!eksekusi) {
        return res.status(400).json({ message: 'Kolom eksekusi diperlukan' });
      }

      // Cari dokumen berdasarkan ID dan perbarui kolom eksekusi
      const updatedTransfer = await WarehouseTransferModel.findByIdAndUpdate(
        id,
        { $set: { eksekusi } },
        { new: true } // Kembalikan dokumen setelah diperbarui
      );

      if (!updatedTransfer) {
        return res.status(404).json({ message: 'Transfer tidak ditemukan' });
      }

      res.status(200).json(updatedTransfer); // Kirim respons dokumen yang diperbarui
    } catch (error) {
      console.error('Error saat memperbarui transfer:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  })
);

export default warehouseTransferRouter
