import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { TransactionModel } from '../models/transactionModel'

export const transactionRouter = express.Router()
import dayjs from 'dayjs'

// transactionRouter.get(
//   '/',
//   asyncHandler(async (req: Request, res: Response) => {
//     const { date_from, date_to, warehouse_id } = req.query

//     const conditions: any = {}

//     if (date_from && date_to) {
//       conditions.trans_date = date_from
//       console.log('Date condition:', conditions.trans_date)
//     }

//     if (warehouse_id) {
//       conditions.warehouse_id = Number(warehouse_id)
//       console.log('Warehouse condition:', conditions.warehouse_id)
//     }

//     const transactions = await TransactionModel.find(conditions)

//     res.json(transactions)
//   })
// )

transactionRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await TransactionModel.create(posData)
    res.status(201).json(justPos)
  })
)

// transactionRouter.get(
//   '/',
//   asyncHandler(async (req: Request, res: Response) => {
//     const bebas = await TransactionModel.find({})
//     res.json(bebas)
//   })
// )
// transactionRouter.get(
//   '/',
//   asyncHandler(async (req: any, res: any) => {
//     const { warehouseId } = req.query

//     if (!warehouseId || isNaN(Number(warehouseId))) {
//       return res.status(400).json({ message: 'Invalid warehouseId' })
//     }

//     try {
//       const numericWarehouseId = Number(warehouseId)
//       const transactions = await TransactionModel.find({
//         warehouse_id: numericWarehouseId,
//       })

//       res.json(transactions)
//     } catch (error) {
//       res.status(500).json({ message: 'Server error occurred.' })
//     }
//   })
// )
// transactionRouter.get(
//   '/',
//   asyncHandler(async (req: any, res: any) => {
//     const { warehouseId } = req.query

//     if (!warehouseId || isNaN(Number(warehouseId))) {
//       return res.status(400).json({ message: 'Invalid warehouseId' })
//     }

//     try {
//       const numericWarehouseId = Number(warehouseId)

//       // Tanggal hari ini
//       const todayDate = dayjs().format('YYYY-MM-DD') // Format tanggal seperti di database
//       // const todayDate = dayjs('2024-12-16').format('YYYY-MM-DD')

//       console.log('Today Date:', todayDate) // Debug tanggal hari ini

//       // Filter transaksi
//       const transactions = await TransactionModel.find({
//         warehouse_id: numericWarehouseId,
//         trans_date: todayDate, // Filter berdasarkan string
//       })

//       console.log('Filtered Transactions:', transactions) // Debug hasil query
//       res.json(transactions)
//     } catch (error) {
//       console.error('Error querying transactions:', error) // Debug error
//       res.status(500).json({ message: 'Server error occurred.' })
//     }
//   })
// )

// transactionRouter.get(
//   '/',
//   asyncHandler(async (req: any, res: any) => {
//     const { warehouseId, date } = req.query

//     if (!warehouseId || isNaN(Number(warehouseId))) {
//       return res.status(400).json({ message: 'Invalid warehouseId' })
//     }

//     try {
//       const numericWarehouseId = Number(warehouseId)

//       const todayDate = date
//         ? dayjs(date).format('YYYY-MM-DD')
//         : dayjs().format('YYYY-MM-DD')

//       let transactions

//       if (numericWarehouseId === 2) {
//         transactions = await TransactionModel.find({
//           trans_date: todayDate,
//         })
//       } else {
//         transactions = await TransactionModel.find({
//           warehouse_id: numericWarehouseId,
//           trans_date: todayDate,
//         })
//       }

//       res.json(transactions)
//     } catch (error) {
//       console.error('Error querying transactions:', error)
//       res.status(500).json({ message: 'Server error occurred.' })
//     }
//   })
// )
transactionRouter.get(
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
      let transactions
      const dateFilter = {
        trans_date: {
          $gte: formattedStartDate,
          $lte: formattedEndDate,
        },
      }

      if (numericWarehouseId === 2) {
        transactions = await TransactionModel.find(dateFilter)
      } else {
        transactions = await TransactionModel.find({
          warehouse_id: numericWarehouseId,
          ...dateFilter,
        })
      }

      res.json(transactions)
    } catch (error) {
      console.error('Error querying transactions:', error)
      res.status(500).json({ message: 'Server error occurred.' })
    }
  })
)

transactionRouter.get(
  '/:ref_number',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await TransactionModel.find({
      ref_number: req.params.ref_number,
    })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await TransactionModel.findById(req.params.ref_number)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)

transactionRouter.put(
  '/by-id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    const transaction = await TransactionModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (req.body.id) {
      transaction.id = req.body.id
    }

    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      transaction.items = transaction.items.map((item) => {
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
      const updatedTransaction = await transaction.save()

      res.json(updatedTransaction)
    }
  })
)
// transactionRouter.put(
//   '/by-memo/:memo',
//   asyncHandler(async (req: any, res: any) => {
//     const transaction = await TransactionModel.findOne({
//       memo: req.params.memo, // Cari berdasarkan memo
//     })

//     if (!transaction) {
//       return res.status(404).json({ message: 'Transaction not found' })
//     }

//     if (req.body.id) {
//       transaction.id = req.body.id
//     }

//     if (Array.isArray(req.body.items) && req.body.items.length > 0) {
//       transaction.items = transaction.items.map((item) => {
//         // Cocokan payload dengan database
//         const updatedItem = req.body.items.find(
//           (i: any) => i.finance_account_id === item.finance_account_id
//         )

//         if (updatedItem) {
//           // Update isi items dengan data baru
//           return { ...item, id: updatedItem.id }
//         }

//         return item
//       })
//     }

//     // Simpan ke database
//     const updatedTransaction = await transaction.save()

//     res.json(updatedTransaction)
//   })
// )
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
transactionRouter.put(
  '/by-memo/:memo',
  asyncHandler(async (req: any, res: any) => {
    // Cari transaksi berdasarkan memo
    const transaction = await TransactionModel.findOne({
      memo: req.params.memo,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Perbarui ID transaksi jika tersedia dalam body request
    if (req.body.id) {
      // console.log('Updating ID:', req.body.id)
      transaction.id = req.body.id
    }
    if (req.body.amount) {
      console.log('Updating amount:', req.body.amount);
      transaction.amount = req.body.amount;
    }

    // Perbarui due jika ada
    if (req.body.due) {
      // console.log('Updating due:', req.body.due);
      transaction.due = req.body.due;
    }

    // Perbarui item jika ada
    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      transaction.items = transaction.items.map((item) => {
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
          const targetWitholding = transaction.witholdings.find(
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
              `Skipping update: Witholding with _id ${updateWitholding._id} not found in transaction.`
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
      const updatedTransaction = await transaction.save()
      console.log('Transaction Updated:', updatedTransaction)

      // Kembalikan respon JSON
      res.json(updatedTransaction)
    } catch (err) {
      console.error('Error while saving updated transaction:', err)
      res.status(500).json({ message: 'Failed to update transaction.' })
    }
  })
)

transactionRouter.put(
  '/by-contact_id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    console.log('Ref Number in Request:', req.params.ref_number)

    const transaction = await TransactionModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (req.body.contact_id) transaction.contact_id = req.body.contact_id
    if (req.body.term_id) transaction.term_id = req.body.term_id
    if (req.body.trans_date) transaction.trans_date = req.body.trans_date
    if (req.body.due_date) transaction.due_date = req.body.due_date
    if (req.body.id) transaction.id = req.body.id

    if (Array.isArray(req.body.contacts) && req.body.contacts.length > 0) {
      transaction.contacts = req.body.contacts
    }
    if (Array.isArray(req.body.tages) && req.body.tages.length > 0) {
      transaction.tages = req.body.tages
    }
    const updatedTransaction = await transaction.save()
    return res.json(updatedTransaction)
  })
)

transactionRouter.put(
  '/full-update/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    let transaction = await TransactionModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (req.body.witholdings && Array.isArray(req.body.witholdings)) {
      transaction.witholdings = req.body.witholdings
    }

    if (req.body.reason_id) {
      transaction.reason_id = req.body.reason_id
    }

    const updatedTransaction = await transaction.save()

    res.json(updatedTransaction)
  })
)

// transactionRouter.delete(
//   '/:idol',
//   asyncHandler(async (req, res) => {
//     const teneDwang = await TransactionModel.findByIdAndDelete(req.params.idol)
//     if (teneDwang) {
//       res.json({ message: 'Pos deleted successfully' })
//     } else {
//       res.status(404).json({ message: 'Pos Not Found' })
//     }
//   })
// )
transactionRouter.delete(
  '/:ref_number/witholdings/:witholdingId',
  asyncHandler(async (req: Request, res: Response) => {
    console.log('Request params:', req.params)

    const { ref_number, witholdingId } = req.params
    const transaction = await TransactionModel.findOne({ ref_number })

    if (transaction) {
      console.log('Transaction found:', transaction)

      transaction.witholdings = transaction.witholdings.filter(
        (witholding: any) => witholding._id.toString() !== witholdingId
      )

      await transaction.save()
      console.log('Witholding removed successfully')
      res.json({ message: 'Witholding removed successfully' })
    } else {
      console.error('Transaction not found')
      res.status(404).json({ message: 'Transaction not found' })
    }
  })
)

transactionRouter.patch(
  '/:ref_number/witholding/:witholdingId',
  asyncHandler(async (req: any, res: any) => {
    const { ref_number, witholdingId } = req.params
    const { status } = req.body

    const transaction = await TransactionModel.findOne({
      ref_number,
      'witholdings._id': witholdingId,
    })

    if (!transaction) {
      return res
        .status(404)
        .json({ message: 'Transaction or witholding not found' })
    }

    const withholding = transaction.witholdings.find(
      (witholding: any) => witholding._id.toString() === witholdingId
    )

    if (!withholding) {
      return res.status(404).json({ message: 'Withholding not found' })
    }

    withholding.status = status // Update the percent

    await transaction.save()
    res.status(200).json({ message: 'Withholding updated successfully' })
  })
)

export default transactionRouter

// import express, { Request, Response } from 'express'
// import asyncHandler from 'express-async-handler'

// import { TransactionModel } from '../models/transactionModel'

// export const transactionRouter = express.Router()
// transactionRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const posData = req.body

//     const justPos = await TransactionModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )

// transactionRouter.get(
//   '/',
//   asyncHandler(async (req: Request, res: Response) => {
//     const bebas = await TransactionModel.find({})
//     res.json(bebas)
//   })
// )

// transactionRouter.get(
//   '/:ref_number',
//   asyncHandler(async (req: Request, res: Response) => {
//     const posData = await TransactionModel.find({
//       ref_number: req.params.ref_number,
//     })
//     if (posData && posData.length > 0) {
//       res.json(posData)
//     } else {
//       const posById = await TransactionModel.findById(req.params.ref_number)
//       if (posById) {
//         res.json(posById)
//       } else {
//         res.status(404).json({ message: 'Pos not found' })
//       }
//     }
//   })
// )
// // PUT endpoint to update transaction by ref_number
// transactionRouter.put(
//   '/:ref_number',
//   asyncHandler(async (req: any, res: any) => {
//     // Cari transaksi berdasarkan ref_number yang diberikan dalam URL
//     let transaction = await TransactionModel.findOne({
//       ref_number: req.params.ref_number,
//     })

//     // Jika transaksi tidak ditemukan, kirimkan respons 404
//     if (!transaction) {
//       return res.status(404).json({ message: 'Transaction not found' })
//     }

//     // Periksa apakah field `witholdings` ada dalam request body dan update jika ada
//     if (req.body.witholdings && Array.isArray(req.body.witholdings)) {
//       // Update field `witholdings` pada transaksi yang ditemukan
//       transaction.witholdings = req.body.witholdings
//     }

//     // Lakukan update pada field lain (misalnya `reason_id` atau lainnya)
//     if (req.body.id) {
//       transaction.id = req.body.id
//     }
//     if (req.body.id) {
//       transaction.id = req.body.id
//     }

//     // Tambahkan pembaruan untuk field lain yang diperlukan sesuai dengan model transaksi

//     // Simpan transaksi yang diperbarui ke database
//     const updatedTransaction = await transaction.save()

//     // Kirimkan respons dengan data transaksi yang diperbarui
//     res.json(updatedTransaction)
//   })
// )
transactionRouter.put(
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
    const transaction = await TransactionModel.findOne({ ref_number })
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Cari witholding yang sesuai dengan witholdingId
    const witholding = transaction.witholdings.find(
      (item: any) => item._id.toString() === witholdingId
    )

    if (!witholding) {
      return res.status(404).json({ message: 'Witholding not found' })
    }

    // Update fields with new values
    witholding.trans_date = trans_date || witholding.trans_date
    witholding.down_payment = down_payment || witholding.down_payment

    // Simpan transaksi yang sudah diperbarui
    await transaction.save()

    // Kirim kembali data transaksi yang sudah diperbarui
    res.json(transaction)
  })
)

// // transactionRouter.delete(
// //   '/:idol',
// //   asyncHandler(async (req, res) => {
// //     const teneDwang = await TransactionModel.findByIdAndDelete(req.params.idol)
// //     if (teneDwang) {
// //       res.json({ message: 'Pos deleted successfully' })
// //     } else {
// //       res.status(404).json({ message: 'Pos Not Found' })
// //     }
// //   })
// // )

// transactionRouter.delete(
//   '/:ref_number/witholdings/:witholdingId',
//   asyncHandler(async (req: Request, res: Response) => {
//     const { ref_number, witholdingId } = req.params

//     const transaction = await TransactionModel.findOne({ ref_number })

//     if (transaction) {
//       transaction.witholdings = transaction.witholdings.filter(
//         (witholding: any) => witholding._id.toString() !== witholdingId
//       )

//       await transaction.save()
//       res.json({ message: 'Witholding removed successfully' })
//     } else {
//       res.status(404).json({ message: 'Transaction not found' })
//     }
//   })
// )
// transactionRouter.patch(
//   '/:ref_number/witholding/:witholdingId',
//   asyncHandler(async (req: any, res: any) => {
//     const { ref_number, witholdingId } = req.params
//     const { status } = req.body

//     const transaction = await TransactionModel.findOne({
//       ref_number,
//       'witholdings._id': witholdingId,
//     })

//     if (!transaction) {
//       return res
//         .status(404)
//         .json({ message: 'Transaction or witholding not found' })
//     }

//     const withholding = transaction.witholdings.find(
//       (witholding: any) => witholding._id.toString() === witholdingId
//     )

//     if (!withholding) {
//       return res.status(404).json({ message: 'Withholding not found' })
//     }

//     withholding.status = status // Update the percent

//     await transaction.save()
//     res.status(200).json({ message: 'Withholding updated successfully' })
//   })
// )

// export default transactionRouter
