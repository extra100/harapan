// import React, { useContext, useState } from 'react'
// import { Button, Input, Table } from 'antd'
// import { useGetPindahBywWarehouseAndDate, useGetWarehouseTransferByWarehouseId, useGetWarehouseTransfersQuery } from '../../hooks/pindahHooks'

// import { useNavigate } from 'react-router-dom'
// import UserContext from '../../contexts/UserContext'

// const ListSudahDivalidasi: React.FC = () => {
//   const userContext = useContext(UserContext)
//   const { user } = userContext || {}
//   let idOutletLoggedIn = 0
//   if (user) {
//     idOutletLoggedIn = Number(user.id_outlet)
//   }

//   const startDate = '2025-01-16'
//   const endDate = '2025-01-16'
//  const {
//     data: dataPindah,
//   } = useGetPindahBywWarehouseAndDate(idOutletLoggedIn, startDate, endDate)

//   const {
//     data: transfers
//   } = useGetWarehouseTransferByWarehouseId(idOutletLoggedIn)
//   console.log({transfers})

//   const navigate = useNavigate()

//   const warehouseMap = React.useMemo(() => {
//     const map: Record<number, string> = {}
//     idWarehouse.forEach((warehouse) => {
//       map[warehouse.id] = warehouse.name
//     })
//     return map
//   }, [idWarehouse])
//   const [searchTerm, setSearchTerm] = useState('')
//   const dataSource = Array.isArray(transfers)
//     ? transfers
//         .filter((transfer: any) => {
//           const isCommonCriteriaMet =
//             transfer.code === 2 &&
//             transfer.from_warehouse_id !== idOutletLoggedIn &&
//             (String(transfer.ref_number || '').includes(searchTerm) ||
//               String(transfer.from_warehouse_id || '').includes(searchTerm))

//           if (user?.isAdmin) {
//             return isCommonCriteriaMet
//           }

//           const isNonAdminCriteriaMet =
//             transfer.code === 2 &&
//             transfer.to_warehouse_id === idOutletLoggedIn

//           return isNonAdminCriteriaMet
//         })
//         .sort(
//           (a: any, b: any) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )
//     : []

//   const handleRowClick = (record: any) => {
//     navigate(`/sudah-validasi/${record.ref_number}`)
//   }
//   const [activeButton, setActiveButton] = useState('')
//   const handleButtonClick = (value: any) => {
//     setActiveButton(value)

//     if (value === '1') {
//       navigate('/listsiapvalidasi')
//     } else if (value === '2') {
//       navigate('/listsudahdivalidasikeluar')
//     } else if (value === '3') {
//       navigate('/ListSudahValidasiMasuk')
//     } else if (value === '4') {
//       navigate('/listpindah')
//     } else if (value === '5') {
//       navigate('/admin')
//     }
//   }
//   const columns = [
//     {
//       title: 'Dari',
//       dataIndex: 'from_warehouse_id',
//       key: 'from_warehouse_id',
//       render: (id: number) => warehouseMap[id] || id,
//     },
//     {
//       title: 'Tujuan',
//       dataIndex: 'to_warehouse_id',
//       key: 'to_warehouse_id',
//       render: (id: number) => warehouseMap[id] || id,
//     },
//     {
//       title: 'INV',
//       dataIndex: 'ref_number',
//       key: 'ref_number',
//     },
//     {
//       title: 'Ket',
//       dataIndex: 'memo',
//       key: 'memo',
//     },
//     {
//       title: 'Tanggal',
//       dataIndex: 'trans_date',
//       key: 'trans_date',
//     },
//   ]

//   return (
//     <>
//       <div style={{ width: '800px' }}>
//         <div style={{ marginBottom: '16px' }}>
//           <Input
//             placeholder="Pencarian No"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ width: '300px' }}
//           />
//         </div>

//         <Button
//           id="btn-filter-1"
//           value="1"
//           type="default"
//           className={activeButton === '1' ? 'btn-default-selected' : ''}
//           style={{ borderRadius: '0px' }}
//           onClick={() => handleButtonClick('1')}
//         >
//           <span>Validasi Permintaan</span>
//         </Button>
//         <Button
//           id="btn-filter-2"
//           value="2"
//           type="default"
//           className={activeButton === '2' ? 'btn-default-selected' : ''}
//           style={{ borderRadius: '0px' }}
//           onClick={() => handleButtonClick('2')}
//         >
//           <span>Sudah Divalidasi Keluar</span>
//         </Button>
//         <Button
//           id="btn-filter-1"
//           value="1"
//           type="default"
//           className={activeButton === '3' ? 'btn-default-selected' : ''}
//           style={{ borderRadius: '0px' }}
//           onClick={() => handleButtonClick('3')}
//         >
//           <span>Sudah Divalidasi Masuk</span>
//         </Button>
//         <Button
//           id="btn-filter-4"
//           value="4"
//           type="default"
//           className={activeButton === '4' ? 'btn-default-selected' : ''}
//           style={{ borderRadius: '0px' }}
//           onClick={() => handleButtonClick('4')}
//         >
//           <span>List Permintaan</span>
//         </Button>
//         {user?.isAdmin && (
//           <Button
//             id="btn-filter-5"
//             value="5"
//             type="default"
//             className={activeButton === '5' ? 'btn-default-selected' : ''}
//             style={{ borderRadius: '0px' }}
//             onClick={() => handleButtonClick('5')}
//           >
//             <span>Khusus Extra</span>
//           </Button>
//         )}

//         <Table
//           columns={columns}
//           dataSource={dataSource}
//           rowKey="ref_number"
//           pagination={{ pageSize: 10 }}
//           onRow={(record) => ({
//             onClick: () => handleRowClick(record),
//           })}
//         />
//       </div>
//     </>
//   )
// }

// export default ListSudahDivalidasi
<>
</>