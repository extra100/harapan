import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import AmbilDetailBarangDariKledoRouter from './src/routers/AmbilDetailBarangDariKledoRouter'

import akunBankRouter from './src/routers/akunBankRouter'
import { barangRouter } from './src/routers/barangRouter'
import barangTerjualRouter from './src/routers/barangTerjualRouter'
// import barangRouter from './routers/barangRouter'

import { contactRouter } from './src/routers/contactRouter'

import { keyRouter } from './src/routers/keyRouter'
import { orderRouter } from './src/routers/orderRouter'
import outletRouter from './src/routers/outletRouter'
import perhitunganRouter from './src/routers/perthitunganRouter'
import warehouseTransferRouter from './src/routers/pindahRouter'
import ppRouter from './src/routers/PpRouter'
import productRouter from './src/routers/productRouter'
import { returnRouter } from './src/routers/returnRouter'
import soldBarangRouter from './src/routers/soldBarangRouter'
import tagRouter from './src/routers/tagRouter'
import transactionRouter from './src/routers/transactionRouter'
import transaksiPolosanRouter from './src/routers/transaksiPolosanRouter'
import { userRouter } from './src/routers/userRouter'
import warehouseRouter from './src/routers/warehousesRouter'
import AmbilDetailBarangDariGoretRouter from './src/routers/AmbilDetailBarangDariGoretRouter'
import barangTetukRouter from './src/routers/barangTetukRouter'
import pelangganRouter from './src/routers/pelangganRouter'
import { controlRouter } from './src/routers/controlRouter'
import pembelianRouter from './src/routers/pembelianRouter'
import { biayaRouter } from './src/routers/biayaRouter'
import pembiayaanRouter from './src/routers/pembiayaanRouter'
import pembiayaanHutangRouter from './src/routers/pembiayaanHutangRouter'
import isiSaldoKasKecilRouter from './src/routers/isiSaldoKasKecilRouter'
import typeKontakRouter from './src/routers/typeKontakRouter'
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
app.use('/api/biayas', biayaRouter)

app.use('/api/pelanggans', pelangganRouter)
app.use('/api/typekontaks', typeKontakRouter)

app.use('/api/barangs', barangRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/pembelians', pembelianRouter)
app.use('/api/pps', ppRouter)
app.use('/api/returns', returnRouter)
app.use('/api/pindah', warehouseTransferRouter)

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
app.use('/api/pembiayaans', pembiayaanRouter)
app.use('/api/pembiayaanHutangs', pembiayaanHutangRouter)
app.use('/api/isiSaldoKasKecils', isiSaldoKasKecilRouter)




console.log(path.join(__dirname, 'frontend/dist'))

// app.use(express.static(path.join(__dirname, '../../frontend/dist')))
// app.get('*', (req: Request, res: Response) =>
//   res.sendFile(path.join(__dirname, '../../frontend/index.html'))
// )



app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '5173') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
console.log("Hello, TypeScript!");
console.log('MONGODB_URI:', MONGODB_URI)
console.log('PORT:', PORT)

