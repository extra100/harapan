import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import App from './App'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from './Store'
import CartPage from './pages/CartPage'
import SignupPage from './pages/SignupPage'
import ShippingAddressPage from './pages/ShippingAddressPage'
import PaymentMethodPage from './pages/PaymentMethodPage'
import PlaceOrderPage from './pages/PlaceOrderPage'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import ProfilePage from './pages/ProfilePage'
import SigninPage from './pages/SinginPage'
import ProtectedRoute from './components/protectedRoute'

import OutletPage from './pages/outlet/OutletPage'

// import TransactionPages from './pages/transaction/TransactionPage'

import StokBarangPage from './pages/api/StokBarangPage'

// import WarehouseDropdown from './pages/api/WarehouseDropdown'
import { SaveApi } from './pages/api/SaveApi'
import SaveInvoiceComponent from './pages/api/SaveApiFe'
// import KasPenjualan from './pages/api/KasoPenjualan'

import FinanceAccountIDSameTable from './pages/transaction/POS/FinanceAccountIDSameTables'
// import FinanceAccountDisplay from './pages/api/FiaFe'

import DetailKledo from './pages/api/DetailKLedo'
import WarehouseStock from './pages/api/Gerah'
import StokWarehouseComponent from './pages/api/Gerah'
import SelectIdForm from './pages/api/awal'
import nestedObjectooo from './pages/api/NestedObject'
import NestedObjectooo from './pages/api/NestedObject'
import Hafalan from './pages/api/Hafal'
// import TransferMasukGudang from './pages/api/TransferGudang'

import ListTransaksi from './pages/api/KledoList'
// import ProductStocksTable from './pages/api/uiPO'
// import ListPindah from './pages/api/listPindah'
import WarehouseTransferDetail from './pages/api/detailPindah'
import ProductLookup from './pages/api/SingleProductPage'
import ProductsComponent from './pages/api/Cepatin'
import ProductList from './pages/api/Cepatin'
import ProductTable from './pages/api/Cepatin'

import BatchProcessWarehouses from './pages/saveWarehouse'
import BatchProcessTags from './pages/api/SaveTags'
import BatchProcessContacts from './pages/api/SaveContact'
import BarangList from './pages/api/barangPage'

import Receipt from './pages/api/printNota'
import ListStok from './pages/api/semuaStok'
import ReceiptJalan from './pages/api/ReceiptJalan'
import BatchProcessProducts from './pages/api/saveProduct'
import BatchProcessBarangTerjuals from './pages/api/saveBarangTerjual'
import BatchProcessAkunBanks from './pages/api/saveAkunBank'
import SimpanMutasi from './pages/api/simpanMutasi'
import Aneh from './pages/api/returnInvoicePage'
import Polosan from './pages/Polosan'
import TransactionList from './pages/ListTransaksi'
import PerhitunganComponent from './pages/api/perhitungan'
import SoldKomponen from './pages/api/barangSold'
import BarangSold from './pages/api/barangSold'
// import ListSiapDiValidasi from './pages/api/ListSiapDivalidasi'
import ValidatePindah from './pages/api/ValidatePindah'
// import ListSudahDivalidasi from './pages/api/ListSudahDiValidasi'
import SudahDivalidasi from './pages/api/SudahDivalidasi'
// import ListSudahValidasiMasuk from './pages/api/ListSudahValidasiMasuk'
import ListVoid from './pages/ListVoid'
import ListReturn from './pages/ListReturn'
import DeleteWitholdingPage from './pages/api/hapusArrayAtWitholding'
import VoidWithlodingArray from './pages/api/voidArrayWitholdings'
// import PP from './pages/api/pp'
import ListPp from './pages/api/ListPp'
import DetailPemesananPenjualan from './pages/api/DetailPemesananPenjualan'
import OkPemesanan from './pages/api/OkPemesanan'
// import PembayaranKledo from './pages/api/PembayaranKledo'
import LaporanStock from './pages/api/LaporanStock'
import ProductHistory from './pages/api/ProductHistory'
import AmbilDetailBarangDariKledo from './pages/AmbilDetailBarangKledo/AmbilDetailBarangDariKledo'
import AmbilDetailBarangDariGoret from './pages/AmbilDetailBarangKledo/AmbilDetailBarangDariGoret'
// import IdUnikDariKledo from './pages/api/SimpanIdUnikDariKledo'
import SimpanIdUnikDariKledoPenjualan from './pages/api/simpanIdUnikDariKledoPenjualan'
import LaporanKeuangan from './pages/api/LaporanKeuangan'
import LaporanKeListTransaksi from './pages/api/LaporanKeListTransaksi'
// import FilterContactBasedIdAndGroupid from './pages/api/PageFilteredContactBasedIdAndGroupId'
import DetailPiutangKontak from './pages/api/DetailPiutangPerKontak'
import BarangTetuk from './pages/api/BarangTetukList'
import EditTransaksi from './pages/api/editTransactions'
import BatchProcessPelangggans from './pages/api/savePelanggan'

import ControlPage from './pages/api/ControlPage'
import MyTablePage from './pages/api/MyTablePage'

import EditTransaksiTes from './pages/api/editTransaksiTes'
import SimpanIdUnikDariMutasi from './pages/api/simpanIdUnikDatiMutasi'
import Nota from './pages/api/NotaKosong'
import NotaPage from './pages/api/NotPage'
import EditMutasi from './pages/api/EditMutasi'
import SimpanIdUnikDariReturn from './pages/api/simpanIdUnikDariReturn'
import EditPembayaran from './pages/api/EditPembayaran'
// import ListSiapDiValdiasiOutletKhusus from './pages/api/ListSiapDiValdiasiOutletKhusus'
// import SuitExApiWithOwnDbBasedDate from './pages/api/suitExApiWithOwnDatabase'
import BagdePenjualan from './badgePenjualan'
import SuitMutasiExDanKledo from './pages/api/SuitMutasiExDanKledo'
import SaveReturDetailSourceKledo from './pages/api/saveReturDetailSourceKledo'
import BayarHutangRetur from './pages/api/BayarHutangRetur'
// import GetIdNextPaymnet from './pages/api/GetIdNextPaymnet'
import BarangTable from './pages/api/BarangTable'
import BarangSearchPage from './pages/api/BarangSearchPage'
import PelangganTable from './pages/api/PelangganTabel'
import TableWarehouse from './pages/api/WarehouseTable'
// import PelangganSearchPage from './pages/api/PelangganSearchPage'
// import CariBeda from './pages/api/CariBeda'
import WarehouseStockManager from './pages/api/WarehouseStokManager'
import KopiNota from './pages/api/KopiNota'
import DownloadStok from './pages/AmbilDetailBarangKledo/DownloadStok'
// import PenjualanPemesanan from './pages/api/PenjualanPemesanan'
import ListPenjualanPemesanan from './pages/api/ListPenjualanPemesanan'
// import EditPenjualanPemesanan from './pages/api/EditPenjualanPemesanan'
// import KopiPenjualan from './pages/api/KopiPenjualan'
import AuditQty from './pages/api/AuditQty'
import { SalesPerProductCategoryUI } from './pages/kategoribarang/ProductKategory'
import TransactionFilter from './hooks/OmsertJenisHarga'
import DiscountSummaryComponent from './hooks/DiscountSummaryComponent'
import QtySummaryComponent from './hooks/QtySummaryComponent'
import WarehouseStockTable from './pages/api/WarehouseStockTable'
import CompareTransfers from './pages/api/CompareTransfers'
import ResentFailedPo from './pages/api/ResentFailedPo'
import RevalidatePindah from './pages/api/RevalidatePindah'
import PembelianUI from './pages/api/PembelianUI'
import ListPembelian from './pages/api/ListPembelian'
import DetailPembelian from './pages/api/DetailPembelian'
import WithholdingTable from './pages/api/WithholdingTables'
import EditPembayaranBeli from './pages/api/EditPembayaranBeli'
import AddPelangganForm from './pages/AddPelangganForm'
import AddBiayaForm from './pages/AddBiayaForm'
import TabelBiaya from './pages/api/TabelBiaya'
import PenambahanBiaya from './pages/api/PenambahanBiaya'
import DetailPembiayaan from './pages/api/DetailPembiayaan'
import ListPembiayaan from './pages/api/ListPembiayaan'
import PrintNotaBiaya from './pages/api/PrintNotaBiaya'
import PenambahanHutangKaryawan from './pages/api/PenambahanHutangKaryawan'
import IsiSaldoKasKecil from './pages/api/IsiSaldoKasKecil'
import AddTypeKontakForm from './pages/AddTypeKontakForm'





// import MutasiSuratJalan from './pages/api/MutasiSuratJalan'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
    <Route index element={<Navigate to="/printstokauditmanual" replace />} />

      <Route path="cart" element={<CartPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        //
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/outlet" element={<OutletPage />} />
      </Route>
      <Route path="/ibo" element={<StokBarangPage />} />
      <Route path="/buy" element={<PembelianUI />} />
      {/* <Route path="/pemesananpenjualan" element={<PP />} /> */}
      <Route path="/save" element={<SaveInvoiceComponent />} />
      <Route path="/saveMutasi" element={<SimpanMutasi />} />
      <Route path="/gerah" element={<StokWarehouseComponent />} />
      <Route path="/awal" element={<SelectIdForm />} />
      <Route path="/neob" element={<NestedObjectooo />} />
      <Route path="/hafal" element={<Hafalan />} />
      {/* <Route path="/tmg" element={<TransferMasukGudang />} /> */}
      <Route path="/saveproduct" element={<BatchProcessProducts />} />
      <Route path="/savebarang" element={<BatchProcessProducts />} />
      <Route path="/savewarehouses" element={<BatchProcessWarehouses />} />
      <Route path="/savetag" element={<BatchProcessTags />} />
      <Route path="/savebarangtetuk" element={<BarangTetuk />} />
      <Route path="/saveakunbank" element={<BatchProcessAkunBanks />} />
      <Route path="/savecontact" element={<BatchProcessContacts />} />
      <Route path="/simpanpelanggan" element={<BatchProcessPelangggans />} />
      {/* <Route path="/po" element={<ProductStocksTable />} /> */}
      <Route path="/langsungstok" element={<ListStok />} />
      {/* <Route path="/penjualanpemesanan" element={<PenjualanPemesanan />} /> */}
      <Route path="/control" element={<ControlPage />} />
      <Route path="/mytable" element={<MyTablePage showTable={false} />} />{' '}
      {/* Bisa dikirim sebagai default */}
      {/* <Route path="/simpanlangsung" element={<SaveApi />} /> */}
      <Route path="/terjual" element={<BatchProcessBarangTerjuals />} />
      <Route
        path="/FinanceAccountIDSameTable"
        element={<FinanceAccountIDSameTable />}
      />
      {/* <Route path="/fiac" element={<FinanceAccountDisplay />} /> */}
      <Route path="/listkledo" element={<ListTransaksi />} />
      <Route path="/listkledo" element={<ListTransaksi />} />
      <Route path="/listpembiayaan" element={<ListPembiayaan />} />
      <Route path="/listpenjualanpemesanan" element={<ListPenjualanPemesanan />} />
      <Route
        path="/laporankelisttransaksi"
        element={<LaporanKeListTransaksi />}
      />
      {/* <Route
        path="/filteriddangroupidcontact"
        element={<FilterContactBasedIdAndGroupid />}
      /> */}
      <Route path="/detailpiutangperkontak" element={<DetailPiutangKontak />} />
      {/* <Route
        path="/getinvbasedondate/:refNumber"
        element={<SuitExApiWithOwnDbBasedDate />}
      /> */}
      {/* <Route path="/getnextpaymnet/:refNumber" element={<GetIdNextPaymnet />} /> */}
      <Route
        path="/getinvmutasibasedondate"
        element={<SuitMutasiExDanKledo />}
      />
      <Route path="/cekmasalah" element={<BagdePenjualan />} />
      <Route path="/laporanstok" element={<LaporanStock />} />
      <Route path="/laporankeuangan" element={<LaporanKeuangan />} />
      <Route path="/product-history/:id" element={<ProductHistory />} />
      <Route path="/listpp" element={<ListPp />} />
      <Route path="/listvoid" element={<ListVoid />} />
      <Route path="/laporanstok" element={<ListVoid />} />
      <Route path="/listreturn" element={<ListReturn />} />
      <Route path="/returpayment/:ref_number" element={<BayarHutangRetur />} />
      <Route
        path="/pembayaranretur/:memorandum/:selectedDate"
        element={<SaveReturDetailSourceKledo />}
      />
      <Route path="/detailkledo/:ref_number" element={<DetailKledo />} />
      <Route path="/pembiayaankledo/:ref_number" element={<DetailPembiayaan />} />
      <Route path="/detailpembelian/:ref_number" element={<DetailPembelian />} />
      {/* <Route path="/editpenjualanpemesanan/:ref_number" element={<EditPenjualanPemesanan />} /> */}
      {/* <Route path="/editpenjualanpemesanan/:ref_number" element={<EditPenjualanPemesanan />} /> */}
      {/* <Route path="/kopipenjualan/:ref_number" element={<KopiPenjualan />} /> */}

      <Route path="/kopiinvoice/:ref_number" element={<KopiNota />} />
      {/* New Route for InvoiceTable */}
      <Route
        path="/detailpemesananpenjualan/:ref_number"
        element={<DetailPemesananPenjualan />}
      />
      {/* <Route
        path="/simpanidunikdarikledo/:ref_number"
        element={<IdUnikDariKledo />}
      /> */}
      <Route
        path="/simpanidunikdarikledopenjualan/:ref_number"
        element={<SimpanIdUnikDariKledoPenjualan />}
      />
      <Route
        path="/simpanidunikdarikledomutasi/:ref_number"
        element={<SimpanIdUnikDariMutasi />}
      />
      <Route
        path="/simpanidunikdarikledoreturn/:memo"
        element={<SimpanIdUnikDariReturn />}
      />
      {/* <Route
        path="/pembayarankledo/:ref_number"
        element={<PembayaranKledo />}
      /> */}
      <Route path="/okepemesanan/:ref_number" element={<OkPemesanan />} />
      <Route path="/returninvoice/:ref_number" element={<Aneh />} />
      <Route path="/edittransaksi/:ref_number" element={<EditTransaksi />} />
      <Route path="/editpembayaran/:memorandum" element={<EditPembayaran />} />
      <Route path="/editpembayaranbeli/:memorandum" element={<EditPembayaranBeli />} />
      <Route path="/update/:id" element={<EditTransaksiTes />} />
      <Route path="/printnota/:ref_number" element={<Receipt />} />
      <Route path="/printsuratjalan/:ref_number" element={<ReceiptJalan />} />
      <Route path="/single" element={<ProductLookup />} />
      <Route path="/tabelbarang" element={<ProductTable />} />
      <Route path="/barangdb" element={<BarangList />} />
      <Route path="/polosan" element={<Polosan />} />
      <Route path="/bismillah" element={<TransactionList />} />
      <Route path="/perhitungannya" element={<PerhitunganComponent />} />
      <Route path="/hitunglah" element={<BarangSold />} />
      <Route path="/printnota" element={<Receipt />} />
      <Route path="/printnotabiaya" element={<PrintNotaBiaya />} />
      {/* <Route path="/listpindah" element={<ListPindah />} /> */}
      <Route path="/notakosong" element={<Nota />} />
      <Route path="/printnotakosong" element={<NotaPage />} />
      <Route path="/listpembelian" element={<ListPembelian />} />
      <Route
        path="/hapusarray/:ref_number"
        element={<DeleteWitholdingPage />}
      />
      <Route
        path="/voidwitholdingpersen/:ref_number"
        element={<VoidWithlodingArray />}
      />
      <Route
        path="/transfer-detail/:ref_number"
        element={<WarehouseTransferDetail />}
      />
      {/* <Route path="/listsiapvalidasi" element={<ListSiapDiValidasi />} />
      <Route path="/admin" element={<ListSiapDiValdiasiOutletKhusus />} />
      <Route
        path="/listsudahdivalidasikeluar"
        element={<ListSudahDivalidasi />}
      />
      <Route
        path="/ListSudahValidasiMasuk"
        element={<ListSudahValidasiMasuk />}
      /> */}
      <Route path="/validasi-pindah/:ref_number" element={<ValidatePindah />} />
      <Route path="/ulangvalidasi/:ref_number" element={<RevalidatePindah />} />
      <Route path="/editmutasi/:ref_number" element={<EditMutasi />} />
      <Route path="/sudah-validasi/:ref_number" element={<SudahDivalidasi />} />
      <Route
        path="/ambildetailbarangdarikledo"
        element={<AmbilDetailBarangDariKledo />}
      />
      <Route
        path="/downloadstok"
        element={<DownloadStok />}
      />
      <Route
        path="/ambildetailbarangdariGoret"
        element={<AmbilDetailBarangDariGoret />}
      />
      <Route path="/tabelbarangs" element={<BarangTable />} />
      <Route path="/tabelbiayas" element={<TabelBiaya />} />
      <Route path="/tambahbarang" element={<BarangSearchPage />} />
      <Route path="/tabelpelanggans" element={<PelangganTable />} />
      {/* <Route path="/tambahpelanggan" element={<PelangganSearchPage />} /> */}
      <Route path="/tabeloutlets" element={<TableWarehouse />} />
      {/* <Route path="/caribedainvoice" element={<CariBeda />} /> */}
      <Route path="/semuastokoutlet" element={<WarehouseStockManager />} />
      <Route path="/auditqty" element={<AuditQty />} />
      <Route path="/productkategori" element={<SalesPerProductCategoryUI />} />
      <Route path="/omsetjenisharga" element={<TransactionFilter />} />
      <Route path="/diskonsummary" element={<DiscountSummaryComponent />} />
      <Route path="/qtysummary" element={<QtySummaryComponent />} />
      <Route path="/printstokauditmanual" element={<WarehouseStockTable />} />
      <Route path="/bandingkanpo" element={<CompareTransfers />} />
      <Route path="/kirimulanggagalpo" element={<ResentFailedPo />} />
      <Route path="/kasdanbank" element={<WithholdingTable />} />
      <Route path="/addpelanggan" element={<AddPelangganForm />} />
      <Route path="/addbiaya" element={<AddBiayaForm />} />
      <Route path="/penambahanbiaya" element={<PenambahanBiaya />} />
      <Route path="/penambahanhutang" element={<PenambahanHutangKaryawan />} />
      <Route path="/isisaldokaskecil" element={<IsiSaldoKasKecil />} />
      <Route path="/addtypekontak" element={<AddTypeKontakForm />} />
      
      
    </Route>
  )
)

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      {/* <PayPalScriptProvider options={{ 'client-id': 'sb' }} deferLoading={true}> */}
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
      {/* </PayPalScriptProvider> */}
    </StoreProvider>
  </React.StrictMode>
)
