// import React, { useState, useEffect } from 'react'
// import { Select, Badge } from 'antd'
// import { useStokBarang } from './StokBarang'

// import { useIdNamaBarang } from './NamaBarang'

// const { Option } = Select

// const StockSelectorTable = () => {
//   const { dataStokBarang, fetchStokBarang } = useStokBarang()
//   const { idaDataBarang } = useIdNamaBarang()


//   const [productQuantities, setProductQuantities] = useState<{
//     [key: string]: number
//   }>({})
//   const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
//   const [selectedWarehouseId, setSelectedWarehouseId] = useState<
//     number | string | null
//   >(null)

//   useEffect(() => {
//     if (selectedProductIds.length > 0 && selectedWarehouseId !== null) {
//       selectedProductIds.forEach((productId) => {
//         fetchStokBarang(productId, Number(selectedWarehouseId))
//       })
//     }
//   }, [selectedProductIds, selectedWarehouseId])

//   useEffect(() => {
//     if (dataStokBarang) {
//       setProductQuantities((prevQuantities) => ({
//         ...prevQuantities,
//         [dataStokBarang.productId]: dataStokBarang.qty,
//       }))
//     }
//   }, [dataStokBarang])

//   const handleProductChange = (values: string[]) => {
//     setSelectedProductIds(values)
//   }

//   const handleWarehouseChange = (value: number | string) => {
//     setSelectedWarehouseId(value)
//   }

//   const renderOption = (productId: string) => {
//     const product = idaDataBarang.find((p: any) => p.id === productId)
//     const quantity = productQuantities[productId] || 0
//     return (
//       <Option key={productId} value={productId}>
//         {product?.name}{' '}
//         <Badge count={quantity} style={{ marginLeft: '10px' }} />
//       </Option>
//     )
//   }

//   return (
//     <div>
//       <Select
//         placeholder="Outlet"
//         showSearch
//         style={{ width: '320px' }}
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option?.children?.toString()
//             ? option.children
//                 .toString()
//                 .toLowerCase()
//                 .includes(input.toLowerCase())
//             : false
//         }
//         onChange={handleWarehouseChange}
//         value={selectedWarehouseId}
//       >
//         {idWarehouse?.map((warehouse) => (
//           <Select.Option key={warehouse.id} value={warehouse.id}>
//             {warehouse.name}
//           </Select.Option>
//         ))}
//       </Select>

//       <Select
//         mode="multiple"
//         showSearch
//         placeholder="Barang"
//         style={{ width: '320px', marginTop: '10px' }}
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option?.children?.toString()
//             ? option.children
//                 .toString()
//                 .toLowerCase()
//                 .includes(input.toLowerCase())
//             : false
//         }
//         onChange={handleProductChange}
//         value={selectedProductIds}
//       >
//         {idaDataBarang.map((product: any) => renderOption(product.id))}
//       </Select>
//     </div>
//   )
// }

// export default StockSelectorTable
<>
</>