// import React, { useEffect, useRef, useState } from 'react'
// import {
//   Table,
//   Typography,
//   Row,
//   Col,
//   Menu,
//   Tag,
//   Form,
//   Input,
//   Button,
//   Select,
//   DatePicker,
//   Card,
//   Dropdown,
//   Space,
//   Divider,
//   message,
//   Spin,
// } from 'antd'
// import {
//   useAddTransactionMutation,
//   useGetTransactionByIdQuery,
//   useUpdateTransactionMutation,
// } from '../../hooks/transactionHooks'
// import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
// import { AiOutlinePrinter } from 'react-icons/ai'
// import PosPrintKomponent from './PosPrintCok'
// import moment from 'moment'
// import dayjs from 'dayjs'
// 
// import { saveToApiNextPayment } from './NextPayment'
// import { useReactToPrint } from 'react-to-print'
// import Receipt from './printNota'
// import ReceiptJalan from './ReceiptJalan'
// import { useIdInvoice } from './takeSingleInvoice'
// 
// import { useGetContactsQuery } from '../../hooks/contactHooks'
// import { useGetAkunBanksQueryDb } from '../../hooks/akunBankHooks'
// import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
// import { NumericFormat } from 'react-number-format'

// import type { Dayjs } from 'dayjs'
// import { useVoidInvoice } from './voidInvoice'
// import { Transaction } from '../../types/Transaction'
// import { useUnvoidInvoice } from './unvoidInvoice'
// import SingleDate from '../SingleDate'

// import {
//   EyeOutlined,
//   FileSearchOutlined,
//   RetweetOutlined,
//   RollbackOutlined,
//   RotateLeftOutlined,
//   EditOutlined,
//   CloseCircleOutlined,
//   UndoOutlined,
//   PrinterOutlined,
//   CarOutlined,
// } from '@ant-design/icons'

// const { Title, Text } = Typography
// const { Option } = Select

// const PembayaranKledo: React.FC = () => {
//   const [showButtons, setShowButtons] = useState(false)
//   const currentDate = dayjs()
//   const [startDate, setStartDate] = useState<Dayjs>(currentDate)

//   const handleStartDateChange = (date: Dayjs | null) => {
//     if (date) {
//       setStartDate(date)
//     }
//   }
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowButtons(true)
//     }, 2000)

//     return () => clearTimeout(timer)
//   }, [])
//   const { ref_number } = useParams<{ ref_number?: string }>()

//   const updatePosMutation = useUpdateTransactionMutation()
//   //
//   const { data: allTransactions } = useGetTransactionByIdQuery(
//     ref_number as string
//   )
//   const { data: contacts } = useGetContactsQuery()
//   const { data: akunBanks } = useGetAkunBanksQueryDb()

//   const { getIdAtInvoice } = useIdInvoice(ref_number || '')
//   console.log({ getIdAtInvoice })
//   const invoiceId = getIdAtInvoice ? getIdAtInvoice.id : null
//   console.log('id dari kledo yang kotrol semua', invoiceId)

//   const refNumber = getIdAtInvoice ? getIdAtInvoice.ref_number : null
//   console.log('ref_number dari database keldo', refNumber)

//   const getPosDetail = allTransactions?.find(
//     (transaction: any) => transaction.ref_number === ref_number
//   )

//   const gudangName = getPosDetail?.warehouses?.[0]?.name
//   const gudangId = getPosDetail?.warehouses?.[0]?.warehouse_id
//   const id = getPosDetail?.id
//   console.log('ref_number dari database sendiri', id)
//   const tagName = getPosDetail?.tages?.map((tag: any) => tag.name) || []

//   const amount = getPosDetail?.amount ?? 0
//   const witholdings = getPosDetail?.witholdings || []
//   const items = getPosDetail?.items || []
//   const totalDownPayment = witholdings
//     .filter((witholding: any) => witholding.status === 0)
//     .reduce((sum: number, witholding: any) => {
//       return sum + (witholding.down_payment || 0)
//     }, 0)

//   const due = amount - totalDownPayment
//   const totalDiscount = items.reduce((total: number, item: any) => {
//     return total + (item.discount_amount || 0)
//   }, 0)
//   const subTotal = totalDiscount + amount

// 

//   const [amountPaid, setAmountPaid] = useState<number | null>(null)
//   const formatNumber = (num: number) => {
//     return num.toLocaleString('en-US')
//   }

//   const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseFloat(e.target.value)

//     if (!isNaN(value) && value <= due) {
//       setAmountPaid(value)
//     } else {
//       alert('Jumlah bayar tidak boleh melebihi total tagihan')
//     }
//   }
//   const handleSetAmountPaid = () => {
//     setAmountPaid(due)
//   }
//   const [contactName, setContactName] = useState<string>('Unknown Contact')

//   useEffect(() => {
//     if (allTransactions && contacts) {
//       const contactId = getPosDetail?.contacts?.[0]?.id
//       const contact = contacts.find((c: any) => c.id === contactId)
//       if (contact) {
//         setContactName(contact.name)
//       }
//     }
//   }, [allTransactions, contacts])
// 

//   const [selectedBank, setSelectedBank] = useState<any | null>(null)

//   const today = dayjs().format('DD-MM-YYYY')
//   const { saveNextPayment } = saveToApiNextPayment()
//   const handleVoid = (values: any) => {
//     if (refNumber) {
//       const existingInvoice = allTransactions?.find(
//         (transaction) => transaction.ref_number === refNumber
//       )

//       if (existingInvoice) {
//         const updatedInvoice: Transaction = {
//           ...existingInvoice,
//           reason_id: 'void',
//           // id: Number(invoiceId),
//         }

//         updatePosMutation.mutate(updatedInvoice, {
//           onSuccess: () => {
//             message.success('Transaksi berhasil dibatalkan!')
//             setLoadingSpinner(true)

//             setTimeout(() => {
//               setLoadingSpinner(false)
//               navigate('/listpp')
//             }, 3000)
//           },
//           onError: (error) => {
//             message.error(`Terjadi kesalahan: ${error.message}`)
//           },
//         })
//       } else {
//         message.error('Melebihi batas pembatalan:')
//       }
//     } else {
//       message.error('Menyebabkan double data')
//     }
//   }

//   const [loadingSpinner, setLoadingSpinner] = useState(false) // State untuk mengontrol spinner

//   const handleUnVoid = (values: any) => {
//     if (refNumber) {
//       const existingInvoice = allTransactions?.find(
//         (transaction) => transaction.ref_number === refNumber
//       )

//       if (existingInvoice) {
//         const updatedInvoice: Transaction = {
//           ...existingInvoice,
//           reason_id: 'unvoid',
//         }

//         updatePosMutation.mutate(updatedInvoice, {
//           onSuccess: () => {
//             message.success('Transaksi berhasil diunvoid!')
//             setLoadingSpinner(true)

//             setTimeout(() => {
//               setLoadingSpinner(false)
//               navigate('/listvoid')
//             }, 3000)
//           },
//           onError: (error) => {
//             message.error(`Terjadi kesalahan: ${error.message}`)
//           },
//         })
//       } else {
//         message.error('Invoice dengan ref_number tidak ditemukan.')
//       }
//     } else {
//       message.error('Tidak ada ref_number yang valid ditemukan.')
//     }
//   }

//   const handleFormSubmit = async (values: any) => {
//     try {
//       // Cek apakah refNumber valid
//       if (!refNumber) {
//         console.error('No valid ref_number found.')
//         return
//       }

//       // Temukan invoice yang ada
//       const existingInvoice = allTransactions?.find(
//         (transaction) => transaction.ref_number === refNumber
//       )

//       if (!existingInvoice) {
//         console.error('Invoice with ref_number not found:', refNumber)
//         return
//       }

//       // Proses unvoid terlebih dahulu
//       if (!hasVoided) {
//         await unvoidInvoice() // Unvoid transaksi
//         message.success('Pemesanan berhasil!')

//         // Update reason_id setelah unvoid berhasil
//         const updatedInvoice: Transaction = {
//           ...existingInvoice,
//           // reason_id: 'unvoid', // Update reason_id di sini
//           id: Number(invoiceId),
//         }

//         // Kirim pembaruan ke server untuk memperbarui reason_id
//         await new Promise<void>((resolve, reject) => {
//           updatePosMutation.mutate(updatedInvoice, {
//             onSuccess: () => {
//               setHasVoided(true) // Cegah unvoid ulang
//               resolve() // Tanda berhasil
//             },
//             onError: (error) => {
//               message.error(`Gagal memperbarui: ${error.message}`)
//               reject(error)
//             },
//           })
//         })
//       }

//       // Jika unvoid berhasil atau sudah diunvoid sebelumnya, lanjutkan dengan pembayaran
//       const accountMap = fiAc?.children?.reduce((map: any, warehouse: any) => {
//         map[warehouse.name] = warehouse.id
//         return map
//       }, {})

//       const accountId = accountMap[selectedBank as any] || bankAccountId

//       const invoiceData = {
//         id: invoiceId || 0,
//         witholdings: [
//           {
//             witholding_account_id: accountId,
//             name: selectedBank || bankAccountName,
//             down_payment: amountPaid || 0,
//             witholding_percent: 0,
//             witholding_amount: amountPaid || 0,
//             status: 0,
//             trans_date: selectedDates,
//           },
//         ],
//       }

//       const updatedWithholdings = [
//         ...existingInvoice.witholdings,
//         ...invoiceData.witholdings,
//       ]

//       const finalUpdatedInvoice = {
//         ...existingInvoice,
//         witholdings: updatedWithholdings,
//         // reason_id: 'unvoid', // Pastikan reason_id tetap diperbarui di sini
//         id: invoiceData.id, // Menambahkan id jika diperlukan di objek invoice final
//       }

//       // Mutasi ke server untuk memperbarui invoice dengan withholdings baru
//       await new Promise<void>((resolve, reject) => {
//         updatePosMutation.mutate(finalUpdatedInvoice as any, {
//           onSuccess: () => {
//             resolve()
//           },
//           onError: (error) => {
//             console.error('Error updating invoice:', error)
//             reject(error)
//           },
//         })
//       })

//       // Buat payload untuk pembayaran baru
//       const payload = {
//         id: invoiceId,
//         amount: amountPaid,
//         attachment: [],
//         bank_account_id: accountId,
//         business_tran_id: invoiceId || id,
//         witholding_amount: amountPaid,
//         memo: values.catatan || null,
//         trans_date: selectedDates,
//         witholdings: [],
//       }

//       // Simpan pembayaran baru ke server
//       const response = await saveNextPayment(payload)
//       console.log('Payment saved successfully:', response)
//       message.success('Pembayaran berhasil disimpan!')
//     } catch (error) {
//       console.error('Error handling form submit:', error)
//     }
//   }

//   // Fungsi tombol klik untuk memulai proses submit
//   const handleButtonClick = () => {
//     handleFormSubmit({})
//   }

//   const printNota = useRef<HTMLDivElement>(null)

//   const printNotaHandler = useReactToPrint({
//     content: () => printNota.current,
//   })

//   const printSuratJalan = useRef<HTMLDivElement>(null)

//   const printSuratJalanHandler = useReactToPrint({
//     content: () => printSuratJalan.current,
//   })

//   const akunBank = useGetAkunBanksQueryDb()

//   const tele = akunBank?.data

//   const matchingTele = tele?.find((item) => {
//     const nameParts = item.name.split('_')
//     return nameParts[1] === gudangName
//   })

//   const [bankAccountName, setBankAccountName] = useState<string | null>(null)

//   const [bankAccountId, setBankAccountId] = useState<string | null>(null)

//   const [warehouseName, setWarehouseName] = useState<string | null>(null)
//   const { data: gudangdb } = useGetWarehousesQuery()

//   const getWarehouseName = () => {
//     if (!gudangdb || !gudangId) return null

//     const selectedWarehouse = gudangdb.find(
//       (warehouse: { id: number; name: string }) =>
//         warehouse.id === Number(gudangId)
//     )
//     return selectedWarehouse ? selectedWarehouse.name : null
//   }

//   useEffect(() => {
//     const name = getWarehouseName()
//     setWarehouseName(name)
//     if (name) {
//     }
//   }, [gudangdb, gudangId])
//   const getBankAccountName = () => {
//     if (!akunBanks || !warehouseName) return null

//     const matchingBankAccount = akunBanks.find((bank: { name: string }) => {
//       const parts = bank.name.split('_')
//       return parts[1] === warehouseName
//     })
//     return matchingBankAccount ? matchingBankAccount.name : null
//   }
//   useEffect(() => {
//     const name = getBankAccountName()
//     setBankAccountName(name)
//   }, [warehouseName, akunBanks])
//   const getBankAccountId = () => {
//     if (!akunBanks || !warehouseName) return null

//     const matchingBankAccount = akunBanks.find(
//       (bank: { name: any; id: any }) => {
//         const parts = bank.name.split('_')
//         return parts[1] === warehouseName
//       }
//     )
//     return matchingBankAccount ? matchingBankAccount.id : null
//   }
//   const matchingName = matchingTele?.name
//   useEffect(() => {
//     if (bankAccountName) {
//       setSelectedBank(bankAccountName)
//     }
//   }, [bankAccountName])
//   useEffect(() => {
//     const id = getBankAccountId()
//     setBankAccountId(id as any)
//   }, [warehouseName, akunBanks])

//   const [refNumbers, setRefNumber] = useState('')
//   const { voidInvoice, voidLoading, voidError, voidSuccess } = useVoidInvoice(
//     refNumber as any
//   )
//   const { unvoidInvoice, unvoidLoading, unvoidError, unvoidSuccess } =
//     useUnvoidInvoice(refNumber as any)
//   const [selectedDates, setSelectedDates] = useState<string>()

//   const handleDateRangeSave = (startDate: string) => {
//     setSelectedDates(startDate)
//   }
//   const formatDate = (dateString: any) => {
//     const [day, month, year] = dateString.split('-')
//     return `${year}-${month}-${day}`
//   }

//   const navigate = useNavigate()

//   const menu = (
//     <Menu>
//       <Menu.Item key="lihatAudit" icon={<FileSearchOutlined />}>
//         Lihat Audit
//       </Menu.Item>
//       {getPosDetail?.reason_id === 'void' && (
//         <Menu.Item
//           key="unvoid"
//           icon={<UndoOutlined />}
//           onClick={() => {
//             unvoidInvoice()
//             handleUnVoid(null)
//           }}
//           disabled={voidLoading}
//         >
//           {voidLoading ? 'Proses UnVoid...' : 'UnVoid'}
//         </Menu.Item>
//       )}
//       {getPosDetail?.reason_id === 'unvoid' && (
//         <Menu.Item
//           key="void"
//           icon={<CloseCircleOutlined />}
//           onClick={() => {
//             voidInvoice()
//             handleVoid(null)
//           }}
//           disabled={voidLoading}
//         >
//           {voidLoading ? 'Proses Void...' : 'Void'}
//         </Menu.Item>
//       )}

//       <Menu.Item
//         key="retur"
//         icon={<RollbackOutlined />}
//         onClick={() => {
//           navigate(`/returninvoice/${ref_number}`)
//         }}
//       >
//         Retur
//       </Menu.Item>

//       <Menu.Item key="edit" icon={<EditOutlined />}>
//         Edit
//       </Menu.Item>
//     </Menu>
//   )
//   const columns = [
//     {
//       title: 'No',
//       key: 'no',
//       align: 'center',
//       render: (_: any, __: any, index: number) => (
//         <div style={{ textAlign: 'center' }}>{index + 1}</div>
//       ),
//     },
//     {
//       title: 'Barang',
//       dataIndex: 'name',
//       key: 'name',
//       align: 'center',
//       render: (name: string) => (
//         <div style={{ textAlign: 'left' }}>
//           {name !== undefined ? name : ''}
//         </div>
//       ),
//     },

//     {
//       title: 'Qty',
//       dataIndex: 'qty',
//       key: 'qty',
//       align: 'center',
//       render: (qty: number) => (
//         <div style={{ textAlign: 'center' }}>
//           {qty !== undefined ? qty : '0'}
//         </div>
//       ),
//     },
//     {
//       title: 'Satuan',
//       key: 'unit_id',
//       dataIndex: 'unit_id',
//       align: 'center',
//     },
//     {
//       title: 'Harga',
//       dataIndex: 'price',
//       key: 'price',
//       align: 'center',
//       render: (price: number) => (
//         <div style={{ textAlign: 'right' }}>
//           {price !== undefined ? `${price.toLocaleString()}` : 'Rp 0'}
//         </div>
//       ),
//     },
//     {
//       title: 'Total',
//       dataIndex: 'amount',
//       key: 'amount',
//       align: 'center',
//       render: (amount: number) => (
//         <div style={{ textAlign: 'right' }}>
//           {amount !== undefined ? `${amount.toLocaleString()}` : 'Rp 0'}
//         </div>
//       ),
//     },
//   ]
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false)
//     }, 2000)
//     return () => clearTimeout(timer)
//   }, [])

//   const [hasVoided, setHasVoided] = useState(false) // Track if void operation has already executed

//   const [submitTriggered, setSubmitTriggered] = useState(false)

//   // useEffect(() => {
//   //   const voidAndUpdate = async () => {
//   //     if (submitTriggered && refNumber && !hasVoided) {
//   //       const existingInvoice = allTransactions?.find(
//   //         (transaction) => transaction.ref_number === refNumber
//   //       )

//   //       if (existingInvoice) {
//   //         try {
//   //           // Perform void operation first
//   //           await unvoidInvoice()
//   //           message.success('Pemesanan berhasil!')

//   //           const updatedInvoice: Transaction = {
//   //             ...existingInvoice,
//   //             reason_id: 'unvoid', // Update reason to 'unvoid'
//   //           }

//   //           // Update the transaction after voiding
//   //           updatePosMutation.mutate(updatedInvoice, {
//   //             onSuccess: () => {
//   //               setLoadingSpinner(true)
//   //               setTimeout(() => {
//   //                 setLoadingSpinner(false)
//   //                 // Perform additional actions if needed, e.g., navigate or update state
//   //               }, 3000)
//   //             },
//   //             onError: (error) => {
//   //               message.error(
//   //                 `Terjadi kesalahan saat memperbarui: ${error.message}`
//   //               )
//   //             },
//   //           })

//   //           setHasVoided(true) // Prevent further executions
//   //         } catch (error) {}
//   //       }
//   //     }
//   //   }

//   //   // Execute the async function
//   //   if (submitTriggered) {
//   //     voidAndUpdate()
//   //   }
//   // }, [
//   //   submitTriggered, // Run effect when submit button is clicked
//   //   refNumber,
//   //   allTransactions,
//   //   hasVoided,
//   //   updatePosMutation,
//   //   voidInvoice,
//   // ])

//   // // Function to handle button click
//   // const handleButtonClick = () => {
//   //   // Trigger the useEffect logic
//   //   setSubmitTriggered(true)
//   //   // Optionally call handleFormSubmit to handle additional form values if needed
//   //   handleFormSubmit('') // Example call with an empty string
//   // }

//   return (
//     <div style={{ padding: '20px' }}>
//       <Card
//         title={
//           <Row align="middle" justify="space-between">
//             <Col>
//               {getPosDetail?.status_id === 1 && (
//                 <Tag color="red">Belum Dibayar</Tag>
//               )}
//               {getPosDetail?.status_id === 2 && (
//                 <Tag color="orange">Dibayar Sebagian</Tag>
//               )}
//               {getPosDetail?.status_id === 3 && <Tag color="green">Lunas</Tag>}
//               {getPosDetail?.status_id === undefined && (
//                 <Title level={5}>Detail Tagihan</Title>
//               )}
//             </Col>

//             <Dropdown
//               overlay={menu}
//               trigger={['click']}
//               placement="bottomRight"
//             >
//               <a
//                 className="ant-dropdown-link"
//                 onClick={(e) => e.preventDefault()}
//               >
//                 {loading ? (
//                   <Spin size="small" /> // Menampilkan spinner saat loading
//                 ) : (
//                   <svg
//                     viewBox="64 64 896 896"
//                     focusable="false"
//                     data-icon="more"
//                     width="2em" // Lebar ikon
//                     height="2em" // Tinggi ikon
//                     fill="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path d="M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z" />
//                   </svg>
//                 )}
//               </a>
//             </Dropdown>

//             <Col>
//               {showButtons && (
//                 <>
//                   <div>
//                     <button onClick={printNotaHandler}>Print Nota</button>
//                     <div style={{ display: 'none' }}>
//                       <Receipt ref={printNota} />
//                     </div>
//                   </div>

//                   <div>
//                     <button onClick={printSuratJalanHandler}>
//                       Print Surat Jalan
//                     </button>
//                     <div style={{ display: 'none' }}>
//                       <ReceiptJalan ref={printSuratJalan} />
//                     </div>
//                   </div>
//                 </>
//               )}
//             </Col>
//             {/* <Col>
//               {showButtons && (
//                 <>
//                   <div>
//                     <button onClick={printNotaHandler}>Print Nota</button>
//                     <div style={{ display: 'none' }}>
//                       <Receipt ref={printNota} />
//                     </div>
//                   </div>

//                   <div>
//                     <button onClick={printSuratJalanHandler}>
//                       Print Surat Jalan
//                     </button>
//                     <div style={{ display: 'none' }}>
//                       <ReceiptJalan ref={printSuratJalan} />
//                     </div>
//                   </div>
//                 </>
//               )}
//             </Col> */}
//           </Row>
//         }
//         bordered
//       >
//         <Row>
//           <Col span={12}>
//             <div style={{ marginBottom: '0px' }}>
//               <Text strong>Pelanggan:</Text>
//             </div>
//             <Title level={5} style={{ marginBottom: 0 }}>
//               {contactName}
//             </Title>
//           </Col>
//           <Col span={12}>
//             <div style={{ marginBottom: '0px' }}>
//               <Text strong>NOMOR:</Text>
//             </div>
//             <Title level={5}>{getPosDetail?.ref_number || []}</Title>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <div style={{ marginBottom: '0px' }}>
//               <Text strong>Tgl. Transaksi:</Text>
//             </div>
//             <Title level={5}>{getPosDetail?.trans_date || []}</Title>
//           </Col>
//           <Col span={12}>
//             <div style={{ marginBottom: '0px' }}>
//               <Text strong>Tgl. Jatuh Tempo:</Text>
//             </div>
//             <Title level={5}>{getPosDetail?.due_date || []}</Title>
//           </Col>
//         </Row>
//         <Row>
//           <Col span={12}>
//             <div style={{ marginBottom: '0px' }}>
//               <Text strong>Gudang:</Text>
//             </div>
//             <Title level={5}>{gudangName}</Title>
//           </Col>
//           <Col span={12}>
//             <div style={{ marginBottom: '0px' }}>
//               <Text strong>Tag:</Text>
//             </div>
//             <Title level={5}>{tagName}</Title>
//           </Col>
//         </Row>
//       </Card>

//       {/* Transaction Table */}
//       <Table
//         dataSource={getPosDetail?.items || []}
//         columns={columns as any}
//         pagination={false}
//         rowKey="_id"
//         style={{ marginTop: '20px' }}
//       />

//       <div
//         style={{
//           padding: '24px',
//           backgroundColor: '#fff',
//           borderRadius: '8px',
//           boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//         }}
//       >
//         <Row gutter={16}>
//           <Col span={12}></Col>
//           <Col span={12}>
//             <Row>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Text strong>Sub Total</Text>
//               </Col>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Text strong>{formatNumber(subTotal)}</Text>
//               </Col>
//             </Row>
//             <Row style={{ marginTop: '8px' }}>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Text strong>Total Diskon</Text>
//               </Col>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Text strong>{formatNumber(totalDiscount)}</Text>
//               </Col>
//             </Row>
//             <Row style={{ marginTop: '8px' }}>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Text strong>Total setelah diskon</Text>
//               </Col>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Text strong>{formatNumber(amount)}</Text>
//               </Col>
//             </Row>
//             <Row style={{ marginTop: '8px' }}>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Title level={4}>Total</Title>
//               </Col>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Title level={4}>{formatNumber(amount)}</Title>
//               </Col>
//             </Row>
//             <Divider style={{ margin: '16px 0' }} />

//             <>
//               {witholdings
//                 .filter((witholding: any) => witholding.status === 0)
//                 .map((witholding: any, index: number) => (
//                   <Row key={index} style={{ marginTop: '8px' }}>
//                     <Col span={12} style={{ textAlign: 'left' }}>
//                       <a href={`/voidwitholdingpersen/${ref_number}`}>
//                         <Text strong>{witholding.name}</Text>
//                       </a>
//                     </Col>
//                     <Col span={12} style={{ textAlign: 'right' }}>
//                       <Text strong>
//                         {formatNumber(witholding.down_payment)}
//                       </Text>
//                     </Col>
//                   </Row>
//                 ))}
//             </>

//             <Row style={{ marginTop: '8px' }}>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Text strong style={{ fontSize: '20px' }}>
//                   {' '}
//                   Sisa Tagihan
//                 </Text>
//               </Col>
//               <Col span={12} style={{ textAlign: 'right' }}>
//                 <Text strong style={{ fontSize: '20px' }}>
//                   {' '}
//                   {formatNumber(due)}
//                 </Text>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </div>
//       <Card title="Pembayaran" style={{ marginTop: '20px' }}>
//         <Form layout="vertical" onFinish={handleFormSubmit}>
//           <Row gutter={16}>
//             <Col span={12}>
//               <span
//                 style={{
//                   // ...labelStyle,
//                   fontSize: '16px',

//                   cursor: 'pointer',
//                 }}
//                 onClick={handleSetAmountPaid}
//               >
//                 Jumlah Bayar
//               </span>
//               <span
//                 style={{
//                   // ...labelColonStyle,
//                   fontSize: '16px',
//                 }}
//               >
//                 :
//               </span>

//               <NumericFormat
//                 placeholder="Nilai Pembayaran"
//                 value={amountPaid as any}
//                 thousandSeparator="."
//                 decimalSeparator=","
//                 decimalScale={2}
//                 allowNegative={false}
//                 onValueChange={(values) => {
//                   const { floatValue } = values
//                   setAmountPaid(floatValue || 0)
//                 }}
//                 customInput={Input}
//                 max={due}
//                 style={{
//                   width: '100%',
//                   textAlign: 'right',
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                   color: '#007BFF',
//                 }}
//               />
//             </Col>

//             <Col span={12}>
//               <Form.Item>
//                 <SingleDate
//                   onChange={(dates) => {
//                     setSelectedDates(dates)
//                   }}
//                   onSave={handleDateRangeSave}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Select
//                 showSearch // Menampilkan kolom pencarian
//                 placeholder="Pilih bank"
//                 value={selectedBank}
//                 onChange={(value) => setSelectedBank(value)}
//                 style={{ width: '100%' }}
//                 optionFilterProp="children"
//                 filterOption={(input: any, option: any) =>
//                   option?.children
//                     ?.toString()
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 }
//               >
//                 {akunBanks?.map((e) => (
//                   <Select.Option key={e.id} value={e.name}>
//                     {e.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="catatan">
//                 <Input placeholder="Catatan" />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row justify="end">
//             <Col>
//               <Form.Item>
//                 <button type="button" onClick={handleButtonClick}>
//                   Submit
//                 </button>
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </Card>
//     </div>
//   )
// }

// export default PembayaranKledo
;<></>
