import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import AmbilDetailBarangDariKledoRouter from './routers/AmbilDetailBarangDariKledoRouter'
import { controlRouter } from './routers/controlRouter'
import akunBankRouter from './routers/akunBankRouter'
import { barangRouter } from './routers/barangRouter'
import barangTerjualRouter from './routers/barangTerjualRouter'
import { contactRouter } from './routers/contactRouter'
import { keyRouter } from './routers/keyRouter'
import { orderRouter } from './routers/orderRouter'
import outletRouter from './routers/outletRouter'
import perhitunganRouter from './routers/perthitunganRouter'
import productRouter from './routers/productRouter'
import ppRouter from './routers/PpRouter'
import warehouseTransferRouter from './routers/pindahRouter'
import { returnRouter } from './routers/returnRouter'
import soldBarangRouter from './routers/soldBarangRouter'
import tagRouter from './routers/tagRouter'
import transactionRouter from './routers/transactionRouter'
import transaksiPolosanRouter from './routers/transaksiPolosanRouter'
import { userRouter } from './routers/userRouter'
import warehouseRouter from './routers/warehousesRouter'
import AmbilDetailBarangDariGoretRouter from './routers/AmbilDetailBarangDariGoretRouter'
import barangTetukRouter from './routers/barangTetukRouter'
import pelangganRouter from './routers/pelangganRouter'
import penjualanKategoryRouter from './routers/penjualanKategoryRouter'
import pembelianRouter from './routers/pembelianRouter'

dotenv.config()
const MONGODB_URI =
  process.env.MONGODB_URI || ''
mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })
  mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB:', MONGODB_URI))
  .catch(err => console.error('Error connecting to MongoDB:', err))

const app = express()
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',    // Untuk pengembangan lokal
      'http://wakanda90.id',      // Domain produksi
      'https://wakanda90.id',     // Domain produksi dengan HTTPS
      'http://46.202.164.51',     // Akses menggunakan IP
    ],
  })
);

app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({ extended: true, limit: '200mb' }))

app.use('/api/products', productRouter)
app.use('/api/warehouses', warehouseRouter)
app.use('/api/tags', tagRouter)
app.use('/api/barangs', barangTetukRouter)
app.use('/api/akunbanks', akunBankRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/pelanggans', pelangganRouter)
app.use('/api/barangs', barangRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/pembelians', pembelianRouter)
app.use('/api/pps', ppRouter)
app.use('/api/returns', returnRouter)
app.use('/api/pindah', warehouseTransferRouter)
app.use('/api/penjualankategory', penjualanKategoryRouter)

app.use('/api/transaksipolosans', transaksiPolosanRouter)

app.use('/api/sold-barang', soldBarangRouter)

app.use('/api/users', userRouter)
app.use('/api/outlets', outletRouter)
app.use('/api/orders', orderRouter)
app.use('/api/controls', controlRouter)

app.use('/api/keys', keyRouter)
// app.use('/api/pindah', warehouseTransferRouter)
app.use('/api/barters', barangTerjualRouter)
app.use('/api/perhitungans', perhitunganRouter)
app.use('/api/ambidetailbarangdarikledos', AmbilDetailBarangDariKledoRouter)
app.use('/api/ambidetailbarangdarigorets', AmbilDetailBarangDariGoretRouter)

console.log(path.join(__dirname, 'frontend/dist'))

// app.use(express.static(path.join(__dirname, '../../frontend/dist')))
// app.get('*', (req: Request, res: Response) =>
//   res.sendFile(path.join(__dirname, '../../frontend/index.html'))
// )

app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
console.log("Hello, TypeScript!");
console.log('MONGODB_URI:', MONGODB_URI)
console.log('PORT:', PORT)
