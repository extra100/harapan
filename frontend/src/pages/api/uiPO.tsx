// <import React, { useState } from 'react'
// import { Select, Form, Table, Spin, Typography } from 'antd'
// import { useIdNamaBarang } from './NamaBarang'

// import { useProductStocks } from './Po'

// const { Option } = Select
// const { Title } = Typography

// const ProductStocksPage: React.FC = () => {
//   const [productId, setProductId] = useState<string>('')
//   const [warehouseDariId, setWarehouseDariId] = useState<string>('')
//   const [warehouseTujuanId, setWarehouseTujuanId] = useState<string>('')


//   const { idaDataBarang } = useIdNamaBarang()

//   const combinedWarehouseIds = `${warehouseDariId},${warehouseTujuanId}`

//   const { stocks, loading } = useProductStocks(productId, combinedWarehouseIds)
//   console.log({ stocks })

//   const handleProductChange = (value: string) => {
//     setProductId(value)
//   }

//   const handleWarehouseDariChange = (value: string) => {
//     setWarehouseDariId(value)
//   }

//   const handleWarehouseTujuanChange = (value: string) => {
//     setWarehouseTujuanId(value)
//   }

//   const tableData = stocks.flatMap((productStock: any) =>
//     Object.entries(productStock.stocks).map(
//       ([warehouseId, stock]: [string, any]) => ({
//         key: `${productStock.id}-${warehouseId}`,
//         productId: productStock.id,
//         warehouseId,
//         qty: stock.qty,
//         isWarehouseDari: warehouseId === warehouseDariId,
//         isWarehouseTujuan: warehouseId === warehouseTujuanId,
//       })
//     )
//   )

//   const columns = [
//     {
//       title: 'Product ID',
//       dataIndex: 'productId',
//       key: 'productId',
//     },
//     {
//       title: 'Warehouse ID',
//       dataIndex: 'warehouseId',
//       key: 'warehouseId',
//     },
//     {
//       title: 'Quantity',
//       dataIndex: 'qty',
//       key: 'qty',
//       render: (text: any, record: any) => (
//         <span
//           style={{
//             color: record.isWarehouseDari
//               ? 'green'
//               : record.isWarehouseTujuan
//               ? 'blue'
//               : 'black',
//           }}
//         >
//           {text}
//         </span>
//       ),
//     },
//   ]

//   return (
//     <div style={{ padding: '20px' }}>
//       <Title level={2}>Select Products and Warehouses</Title>
//       <Form layout="inline" style={{ marginBottom: '20px' }}>
//         <Form.Item label="Product ID">
//           <Select
//             value={productId}
//             onChange={handleProductChange}
//             placeholder="Select a Product"
//             style={{ width: 200 }}
//           >
//             {idaDataBarang.map((product: any) => (
//               <Option key={product.id} value={product.id}>
//                 {product.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item label="Warehouse Dari">
//           <Select
//             value={warehouseDariId}
//             onChange={handleWarehouseDariChange}
//             placeholder="Select a Warehouse"
//             style={{ width: 200 }}
//           >
//             {idWarehouse.map((warehouse: any) => (
//               <Option key={warehouse.id} value={warehouse.id}>
//                 {warehouse.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item label="Warehouse Tujuan">
//           <Select
//             value={warehouseTujuanId}
//             onChange={handleWarehouseTujuanChange}
//             placeholder="Select a Warehouse"
//             style={{ width: 200 }}
//           >
//             {idWarehouse.map((warehouse: any) => (
//               <Option key={warehouse.id} value={warehouse.id}>
//                 {warehouse.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//       </Form>

//       <div>
//         {loading ? (
//           <Spin tip="Loading stocks..." />
//         ) : (
//           <Table
//             columns={columns}
//             dataSource={tableData}
//             pagination={false}
//             bordered
//             size="middle"
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// export default ProductStocksPage
<>
</>