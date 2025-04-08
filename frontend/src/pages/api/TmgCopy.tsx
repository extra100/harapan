// import React, { useState } from 'react'
// import { Button, Card, DatePicker, Form, Input, Select, Table } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'

// import { useIdNamaBarang } from './NamaBarang'

// import { useProductStocks } from './Po'

// const { Option } = Select

// const ProductStocksPage: React.FC = () => {
//   const [warehouseDariId, setWarehouseDariId] = useState<string>('')
//   const [warehouseTujuanId, setWarehouseTujuanId] = useState<string>('')
//   const [dataSource, setDataSource] = useState<any[]>([])


//   const { idaDataBarang } = useIdNamaBarang()

//   const combinedWarehouseIds = `${warehouseDariId},${warehouseTujuanId}`

//   const { stocks, loading } = useProductStocks(
//     dataSource
//       .map((row) => row.id)
//       .filter(Boolean)
//       .join(','),
//     combinedWarehouseIds
//   )

//   const handleProductChange = (id: string, key: number) => {
//     setDataSource((prevDataSource) =>
//       prevDataSource.map((row) => (row.key === key ? { ...row, id: id } : row))
//     )
//   }

//   const handleWarehouseDariChange = (value: string) => {
//     setWarehouseDariId(value)
//   }

//   const handleWarehouseTujuanChange = (value: string) => {
//     setWarehouseTujuanId(value)
//   }

//   const addRow = () => {
//     setDataSource([
//       ...dataSource,
//       {
//         key: dataSource.length,
//         id: '',
//         stok_terkini: '',
//       },
//     ])
//   }

//   const removeRow = (key: number) => {
//     setDataSource(dataSource.filter((row) => row.key !== key))
//   }

//   const columns = [
//     {
//       title: 'Barang',
//       dataIndex: 'id',
//       key: 'id',
//       render: (id: any, record: any) => (
//         <Select
//           showSearch
//           placeholder="Barang"
//           style={{ width: '320px' }}
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             option?.children?.toString()
//               ? option.children
//                   .toString()
//                   .toLowerCase()
//                   .includes(input.toLowerCase())
//               : false
//           }
//           onChange={(value) => handleProductChange(value, record.key)}
//           value={id}
//         >
//           {idaDataBarang?.map((product) => (
//             <Option key={product.id} value={product.id}>
//               {product.name}
//             </Option>
//           ))}
//         </Select>
//       ),
//     },

//     {
//       title: 'Current Qty',
//       dataIndex: 'stok_terkini',
//       key: 'stok_terkini',
//       render: (_: any, record: any) => {
//         const productStock = stocks.find(
//           (stock) => String(stock.id) === String(record.id)
//         )
//         const qtyDari = productStock?.stocks?.[warehouseDariId]?.qty || 0
//         const qtyTujuan = productStock?.stocks?.[warehouseTujuanId]?.qty || 0

//         return (
//           <>
//             <div>
//               <span>Dari: {qtyDari}</span>
//             </div>
//             <div>
//               <span>Tujuan: {qtyTujuan}</span>
//             </div>
//           </>
//         )
//       },
//     },

//     {
//       title: '',
//       key: 'action',
//       render: (_: any, record: any) => (
//         <Button danger onClick={() => removeRow(record.key)}>
//           &times;
//         </Button>
//       ),
//     },
//   ]

//   const onFinish = (values: any) => {
//     console.log('Form values: ', values)
//   }

//   return (
//     <div style={{ maxWidth: '100%', margin: '20px auto' }}>
//       <Card
//         title="Transfer UFA"
//         style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
//       >
//         <Form layout="vertical" onFinish={onFinish}>
//           <div className="row">
//             <div className="col-md-6">
//               <Form.Item
//                 name="Dari PINSOK"
//                 label="Dari PINSOK"
//                 rules={[{ required: true }]}
//               >
//                 <Select
//                   placeholder="Pilih Outlet"
//                   onChange={handleWarehouseDariChange}
//                 >
//                   {idWarehouse?.map((warehouse) => (
//                     <Option key={warehouse.id} value={warehouse.id}>
//                       {warehouse.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 name="TUJUAN IBO"
//                 label="TUJUAN IBO"
//                 rules={[{ required: true }]}
//               >
//                 <Select
//                   placeholder="Pilih Outlet"
//                   onChange={handleWarehouseTujuanChange}
//                 >
//                   {idWarehouse?.map((warehouse) => (
//                     <Option key={warehouse.id} value={warehouse.id}>
//                       {warehouse.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-md-6">
//               <Form.Item
//                 name="tanggal"
//                 label="Tanggal"
//                 rules={[{ required: true }]}
//               >
//                 <DatePicker style={{ width: '100%' }} />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item name="nomor" label="Nomor">
//                 <Input value="WT/00264" readOnly />
//               </Form.Item>
//             </div>
//           </div>
//           <Form.Item name="referensi" label="Referensi">
//             <Input placeholder="Referensi" />
//           </Form.Item>
//           <Table
//             dataSource={dataSource}
//             columns={columns}
//             pagination={false}
//             rowKey="key"
//           />
//           <Button
//             type="dashed"
//             onClick={addRow}
//             style={{ width: '100%', marginTop: 16 }}
//           >
//             <PlusOutlined /> Tambah Baris
//           </Button>
//           <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
//             Simpan
//           </Button>
//         </Form>
//       </Card>
//     </div>
//   )
// }

// export default ProductStocksPage
<></>