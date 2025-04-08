// import React, { useContext, useEffect, useState } from 'react'
// import {
//   Table,
//   DatePicker,
//   Row,
//   Col,
//   Typography,
//   Select,
//   Modal,
//   Button,
// } from 'antd'
// import moment from 'moment'
// import { TakeInvoicesFromKledoBasedOnDate } from '../takeInvoiceFromKledoBasedOnDate'
// import { formatDate } from './FormatDate'
// import {
//   updateDenganMemoDariKledo,
//   useGetFilteredTransaksisQuery,
// } from '../../hooks/transactionHooks'
// import {
//   updateDenganIdUnikDariKledo,
//   useGetTransactionByIdQuery,
// } from '../../hooks/transactionHooks'
// import { useNavigate, useParams } from 'react-router-dom'
// const { Title } = Typography
// const { Option } = Select
// import dayjs from 'dayjs'
// import UserContext from '../../contexts/UserContext'
// import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
// import { useGetBarangsQuery } from '../../hooks/barangHooks'
// import { TakePembayaranBankTrans } from '../TakePembayaranBankTrans'
// import { TakeInvFormKledoBasedAndDate, TakeInvFormKledoBasedWarehouseAndDate } from "./TakeInvFormKledoBasedWarehouseAndDate";

// const SuitExApiWithOwnDbBasedDate: React.FC = () => {
//   const navigate = useNavigate()
//   const { ref_number } = useParams<{ ref_number?: string }>()
//   const { refNumber } = useParams<{ refNumber: string }>() // Mengambil parameter `memo` dari URL

//   const userContext = useContext(UserContext)
//   const { user } = userContext || {}
//   let idOutletLoggedIn = ''
//   if (user) {
//     idOutletLoggedIn = user.id_outlet
//   }

//   const [transDateFrom, setTransDateFrom] = useState<string | null>(
//     dayjs().format('YYYY-MM-DD')
//   )
//   const [transDateTo, setTransDateTo] = useState<string | null>(
//     dayjs().format('YYYY-MM-DD')
//   )
//   const [search, setSearch] = useState<any | null>(refNumber)
//   // console.log({ search })
//   const handleDateFromChange = (date: dayjs.Dayjs | null) => {
//     setTransDateFrom(date ? date.format('YYYY-MM-DD') : null)
//   }

//   const handleDateToChange = (date: dayjs.Dayjs | null) => {
//     setTransDateTo(date ? date.format('YYYY-MM-DD') : null)
//   }

//       const { getInvKledoBaseddDate } =
//       TakeInvFormKledoBasedAndDate(
//         transDateTo,
//         transDateFrom,
//       );
//   const { data: gudangdb } = useGetWarehousesQuery()
//   const { data: barangs } = useGetBarangsQuery()
//   const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(
//     idOutletLoggedIn
//   )
//   console.log({ getInvKledoBaseddDate })
//   const handleWarehouseChange = (value: string) => {
//     setSelectedWarehouse(value)
//   }
//   useEffect(() => {
//     const initialWarehouse = gudangdb?.find(
//       (gudang: any) => gudang.id === idOutletLoggedIn
//     )
//     if (initialWarehouse) {
//       setSelectedWarehouse(initialWarehouse.name)
//     }
//   }, [gudangdb, idOutletLoggedIn])

//   const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
//   const [isModalVisible, setIsModalVisible] = useState(false)
//   const [selectedData, setSelectedData] = useState<any | null>(null)
//   const { data: allTransactions } = useGetTransactionByIdQuery(
//     refNumber as string
//   )
//   // const idUnique = selectedData?.id || 0

//   const { loading, getInvFromKledoBasedDate } =
//     TakeInvoicesFromKledoBasedOnDate(
//       transDateFrom,
//       transDateTo,
//       selectedWarehouse,
//       search as any
//     )
//   console.log({ getInvFromKledoBasedDate })
//   const discountAmounts = getInvFromKledoBasedDate.flatMap(
//     (invoice: any) =>
//       invoice.items?.map((item: any) => item.discount_amount) || []
//   )

//   const qtyAmount = getInvFromKledoBasedDate.flatMap(
//     (invoice: any) => invoice.items?.map((item: any) => item.qty) || []
//   )
//   const amountKledo = getInvFromKledoBasedDate.flatMap(
//     (invoice: any) => invoice.amount || []
//   )

//   console.log({ amountKledo })
//   console.log({ qtyAmount })

//   const { data: filteredTransaksis, isLoading: loadingOwnDb } =
//     useGetFilteredTransaksisQuery({
//       transDateFrom,
//       transDateTo,
//       selectedWarehouse,
//     })
//   console.log({ filteredTransaksis })
//   const handleStatusChange = (value: number) => {
//     setSelectedStatus(value)
//   }

//   const handleRowClick = (record: any) => {
//     const selectedTransaction = getInvFromKledoBasedDate?.find(
//       (transaksi: any) => transaksi.id === record.id
//     )

//     if (!selectedTransaction) {
//       console.error('Transaksi tidak ditemukan!')
//       return
//     }

//     setSelectedData(selectedTransaction)
//     setIsModalVisible(true)
//   }
//   //

//   const getPosDetail = allTransactions?.find(
//     (transaction: any) => transaction.memo === search
//   )
//   console.log({ getPosDetail })

//   const idBank = getPosDetail?.witholdings?.[0]?.witholding_account_id
//   const name = getPosDetail?.witholdings?.[0]?.name
//   const whPersen = getPosDetail?.witholdings?.[0]?.witholding_percent
//   const whAmount = getPosDetail?.witholdings?.[0]?.witholding_amount
//   const idMonggo = getPosDetail?.witholdings?.[0]?._id
//   const nilai = getPosDetail?.memo

//   const { getBankTrans } = TakePembayaranBankTrans(
//     nilai as any
//     // idBank as any
//   ) || {
//     getBankTrans: [],
//   }
//   // console.log({ idBank })
//   // console.log({ getBankTrans })
//   const firstPayment =
//     getBankTrans && getBankTrans.length > 0 ? getBankTrans[0] : null
//   const amount = firstPayment?.amount || 0
//   const statusId = firstPayment?.status_id || 0
//   const tanggalBayar = firstPayment?.trans_date || 0
//   const idUnique = firstPayment?.id || 0

//   // console.log({ firstPayment })

//   const updateHanyaId = updateDenganMemoDariKledo()

//   const memo =
//     selectedData?.memo ||
//     allTransactions?.find(
//       (transaction: any) => transaction.id === selectedData?.id
//     )?.memo

//   //
//   const updateInvoiceId = async () => {
//     if (!selectedData) {
//       console.error('Tidak ada data yang dipilih untuk diperbarui.')
//       return
//     }

//     const invoiceId = selectedData.id
//     const totalAmount = selectedData.amount
//     // console.log({ totalAmount })
//     const due = selectedData.due
//     // console.log({ totalAmount })

//     const idPadaItems =
//     selectedData.items?.map((item: any, index: number) => ({
//       id: item.id,
//       finance_account_id: item.finance_account_id,
//       price: getPosDetail?.items?.[index]?.price || 0, 
//       amount: item.amount,
//       discount_amount: item.discount_amount,
//     })) || [];
  

//     const idPadaWitholdings =
//       getPosDetail?.witholdings?.map((item: any) => ({
//         down_payment: amount, // Contoh nilai down_payment
//         status: 0,
//         id: idUnique,
//         witholding_account_id: idBank,
//         name: name,
//         trans_date: tanggalBayar,
//         witholding_amount: whAmount,
//         witholding_percent: whPersen,
//         _id: idMonggo,
//       })) || []

//     try {
//       const response = await updateHanyaId.mutateAsync({
//         memo,
//         id: invoiceId,
//         amount: totalAmount,
//         due: due,
//         items: idPadaItems,
//         witholdings: idPadaWitholdings,
//       })

//       console.log('Invoice ID dan items berhasil diperbarui:', response)
//     } catch (error) {
//       console.error('Gagal memperbarui Invoice ID dan items:', error)
//     }
//   }

//   const closeModal = () => {
//     setIsModalVisible(false)
//     setSelectedData(null)
//   }

//   const columns = [
//     {
//       title: 'No',
//       key: 'no',
//       render: (_: any, __: any, index: number) => index + 1,
//     },
//     {
//       title: 'Kledo',
//       dataIndex: 'id_kledo',
//       key: 'id_kledo',
//       ellipsis: true,
//     },
//     {
//       title: 'Wakanda',
//       dataIndex: 'id_own_db',
//       key: 'id_own_db',
//       ellipsis: true,
//     },
//     {
//       title: 'Inv',
//       dataIndex: 'ref_number',
//       key: 'ref_number',
//       ellipsis: true,
//     },
//     {
//       title: 'Tanggal Transaksi',
//       dataIndex: 'trans_date',
//       key: 'trans_date',
//       render: (text: string) => formatDate(text),
//     },
//     {
//       title: 'Gudang',
//       dataIndex: 'warehouse_id',
//       key: 'warehouse_name',
//       ellipsis: true,
//       render: (warehouse_id: string) => {
//         const warehouse = gudangdb?.find(
//           (gudang: { id: any; name: any }) => gudang.id === warehouse_id
//         )
//         return warehouse ? warehouse.name : 'Unknown'
//       },
//     },
//   ]

//   const itemsColumns = [
//     {
//       title: 'Product',
//       dataIndex: 'finance_account_id',
//       key: 'product_name',
//       ellipsis: true,
//       render: (finance_account_id: string) => {
//         const barang = barangs?.find(
//           (gudang: { id: any; name: any }) => gudang.id === finance_account_id
//         )
//         return barang ? barang.name : 'Unknown'
//       },
//     },

//     {
//       title: 'Qty',
//       dataIndex: 'qty',
//       key: 'qty',
//     },
//   ]

//   const checkIfRowIsRed = (rowId: string) => {
//     const matchingRow = filteredTransaksis?.find(
//       (transaksi: any) => transaksi.id === rowId
//     )
//     return matchingRow ? false : true
//   }

//   const combinedData = [
//     ...(getInvFromKledoBasedDate?.map((row: any) => {
//       const matchingRow = filteredTransaksis?.find(
//         (transaksi) => transaksi.id === row.id
//       )
//       return {
//         ...row,
//         id_kledo: row.id,
//         id_own_db: matchingRow?.id,
//         isRed: !matchingRow,
//       }
//     }) ?? []),
//     ...(filteredTransaksis
//       ?.filter(
//         (transaksi) =>
//           !getInvFromKledoBasedDate?.some((row: any) => row.id === transaksi.id)
//       )
//       .map((transaksi: any) => ({
//         ...transaksi,
//         id_kledo: null,
//         id_own_db: transaksi.id,
//         isRed: true,
//       })) ?? []),
//   ]

//   return (
//     <div style={{ width: '1400px', margin: '0 auto', padding: '20px' }}>
//       <Row gutter={[16, 16]} justify="center">
//         <Col span={24}>
//           <Title level={4}></Title>
//         </Col>
//         <Col span={6}>
//           <DatePicker
//             format="YYYY-MM-DD"
//             onChange={handleDateFromChange as any}
//             placeholder="Dari Tanggal"
//             style={{ width: '100%' }}
//             defaultValue={dayjs(transDateFrom, 'YYYY-MM-DD')}
//           />
//         </Col>
//         <Col span={6}>
//           <DatePicker
//             format="YYYY-MM-DD"
//             onChange={handleDateToChange as any}
//             placeholder="Sampai Tanggal"
//             style={{ width: '100%' }}
//             defaultValue={dayjs(transDateTo, 'YYYY-MM-DD')}
//           />
//         </Col>
//         <Col span={6}>
//           <Select
//             placeholder="Pilih Gudang"
//             onChange={handleWarehouseChange}
//             value={selectedWarehouse}
//             style={{ width: '100%' }}
//             showSearch
//             optionFilterProp="children"
//             filterOption={(input, option) =>
//               (option?.children as any)
//                 .toLowerCase()
//                 .includes(input.toLowerCase())
//             }
//             disabled={!user?.isAdmin} // Nonaktifkan Select jika user bukan admin
//           >
//             {gudangdb &&
//               gudangdb.map((gudang: { id: any; name: any }) => (
//                 <Select.Option key={gudang.id} value={gudang.id}>
//                   {gudang.name}
//                 </Select.Option>
//               ))}
//           </Select>
//         </Col>
//       </Row>
//       <Table
//         dataSource={getInvFromKledoBasedDate}
//         columns={columns}
//         rowKey="id"
//         // loading={loadingOwnDb}
//         pagination={{ pageSize: 100 }}
//         style={{ marginTop: '20px' }}
//         // rowClassName={(record) => (record.isRed ? 'red-row' : '')}
//         onRow={(record) => ({
//           onClick: () => handleRowClick(record),
//         })}
//       />
//       <Modal
//         title="Detail Data"
//         visible={isModalVisible}
//         onCancel={closeModal}
//         footer={
//           <Button
//             onClick={() => {
//               updateInvoiceId()
//               navigate(`/detailkledo/${memo}`)
//             }}
//           >
//             Sinkronkan
//           </Button>
//         }
//         width={700}
//       >
//         {selectedData && (
//           <div>
//             <p>
//               <strong>ID UNIK:</strong> {selectedData.id}
//             </p>

//             <p>
//               <strong>No INV:</strong> {selectedData.ref_number}
//             </p>

//             <p>
//               <text>Warehouse Name:</text>{' '}
//               {gudangdb?.find(
//                 (gudang: { id: any; name: string }) =>
//                   gudang.id === selectedData.warehouse_id
//               )?.name || 'Unknown'}
//             </p>

//             <p>
//               <strong>Pelanggan:</strong> {selectedData.name}
//             </p>

//             <p>
//               <strong>Tgl Trans:</strong> {formatDate(selectedData.trans_date)}
//             </p>
//             <Table
//               dataSource={selectedData.items}
//               columns={itemsColumns}
//               rowKey="id"
//               pagination={false}
//             />
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default SuitExApiWithOwnDbBasedDate
<></>