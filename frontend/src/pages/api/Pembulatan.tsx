// import React, { useState, useEffect } from 'react'
// import { Select, Badge, Table, Button, Form } from 'antd'
// import { useStokBarang } from './StokBarang'

// import { useIdNamaBarang } from './NamaBarang'
// import Input from 'antd/es/input/Input'
// import DateRange from '../DateRange'

// import { useIdNamaTag } from './NamaTag'
// import { useIdContact } from './NamaContact'

// import { SaveApi } from './SaveApi'
// import { v4 as uuidv4 } from 'uuid'

// const { Option } = Select

// const StockSelectorTable = () => {
//   const { dataStokBarang, fetchStokBarang } = useStokBarang()
//   const { idaDataBarang } = useIdNamaBarang()


//   const { saveInvoiceData } = SaveApi()

//   const [productQuantities, setProductQuantities] = useState<{
//     [key: string]: number
//   }>({})
//   const [selectedFinanceAccountIds, setSelectedFinanceAccountIds] = useState<
//     string[]
//   >([])
//   console.log({ selectedFinanceAccountIds })
//   const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
//     null
//   )

//   // const [dataSource, setDataSource] = useState<
//   //   { id: string; name: string; qty: number }[]
//   // >([])
//   const [dataSource, setDataSource] = useState<any[]>([])
//   const [selectedContactGroup, setSelectedContactGroup] = useState<any | null>(
//     null
//   )
//   const { loading, idContact } = useIdContact(selectedContactGroup)

//   const [selectedContact, setSelectedContact] = useState<number | null>(null)
//   //kontak

//   const handleContactChange = (value: number) => {
//     setSelectedContact(value)
//   }

//   useEffect(() => {
//     if (selectedFinanceAccountIds.length > 0 && selectedWarehouseId !== null) {
//       selectedFinanceAccountIds.forEach((productId: any) => {
//         fetchStokBarang(productId, Number(selectedWarehouseId))
//       })
//     }
//   }, [selectedFinanceAccountIds, selectedWarehouseId])

//   useEffect(() => {
//     if (dataStokBarang) {
//       setProductQuantities((prevQuantities) => ({
//         ...prevQuantities,
//         [dataStokBarang.productId]: dataStokBarang.qty,
//       }))
//     }
//   }, [dataStokBarang])
//   const customDisplayRender = (value: any) => {
//     return ''
//   }
//   const handleProductChange = (values: string[]) => {
//     setSelectedFinanceAccountIds(values)
//   }
//   const [searchValue, setSearchValue] = useState('')

//   const handleSearch = (value: string) => {
//     setSearchValue(value)
//   }

//   const [dropdownVisible, setDropdownVisible] = useState(false)
//   const discountRates = [
//     { label: 'Retail 10%', percentage: 10 },
//     { label: 'Applikator 16%', percentage: 16 },
//     { label: 'Toko 18%', percentage: 18 },
//     { label: 'Nego 19%', percentage: 19 },
//     { label: 'Khusus 21%', percentage: 21 },
//   ]
//   const calculateDiscount = (price: number, percentage: number): number => {
//     const discountAmount = (price * percentage) / 100
//     const discountedPrice = price - discountAmount

//     const roundedPrice = Math.ceil(discountedPrice / 1000) * 1000

//     return roundedPrice
//   }
//   const calculateSubtotal = (price: number, qty: number): string => {
//     const subtotal = price * qty

//     const roundedSubtotal = Math.ceil(subtotal / 1000) * 1000

//     return roundedSubtotal.toLocaleString('id-ID')
//   }
//   const handleDiscountChange = (value: string, record: any) => {
//     const selectedDiscount = discountRates.find((rate) => rate.label === value)
//     if (selectedDiscount) {
//       const newPrice = calculateDiscount(
//         record.price,
//         selectedDiscount.percentage
//       )
//       setDataSource((prev) =>
//         prev.map((item: any) =>
//           item.finance_account_id === record.finance_account_id
//             ? {
//                 ...item,
//                 price: newPrice,
//                 selectedDiscount: value,
//                 subtotal: calculateSubtotal(newPrice, item.qty),
//               }
//             : item
//         )
//       )
//     }
//   }
//   const warehouseMap = idWarehouse.reduce((map: any, warehouse: any) => {
//     map[warehouse.id] = warehouse.name
//     return map
//   }, {})
//   const warehouseId = warehouseMap[selectedWarehouseId as any]
//   const untukTag = idWarehouse.reduce((map: any, warehouse: any) => {
//     map[warehouse.id] = warehouse.name
//     return map
//   }, {})
//   const forTag = untukTag[selectedWarehouseId as any]

//   const handleWarehouseChange = (value: number | string) => {
//     setSelectedWarehouseId(value)
//     const matchingTag = idDataTag.find((tag) => tag.name === forTag)
//     setSelectedContact(null)

//     setSelectag(matchingTag ? matchingTag.id : null)
//     const bangke = idWarehouse.reduce((map: any, warehouse: any) => {
//       map[warehouse.id] = warehouse.name
//       return map
//     }, {})
//     const namaBangke = bangke[value as any]

//     const findMatchingBank = (namaGudang: string) => {
//       return fiAc?.children?.find((bank) =>
//         bank.name.startsWith(`KAS PENJUALAN_${namaGudang}`)
//       )
//     }

//     const matchingBank = findMatchingBank(namaBangke)

//     if (matchingBank) {
//       setSelectedBank(matchingBank.name)
//     }
//   }

//   const handleOkClick = () => {
//     setDropdownVisible(false)
//     const selectedItems = idaDataBarang.filter((item: any) =>
//       selectedFinanceAccountIds.includes(item.id)
//     )
//     setDataSource((prev) => [
//       ...prev,
//       ...selectedItems
//         .filter(
//           (item) =>
//             !prev.some(
//               (existingItem) => existingItem.finance_account_id === item.id
//             )
//         )
//         .map((item) => ({
//           finance_account_id: item.id,
//           finance_account_name: item.name,
//           price: item.price,
//           unit_id: 5,
//           qty: 1,
//           selectedDiscount: 'Retail 10%',
//           subtotal: item.price,
//           unit: item.unit?.id,
//         })),
//     ])
//     setSelectedFinanceAccountIds(selectedFinanceAccountIds.map(String))
//   }

//   const handleQtyChange = (value: number, record: any) => {
//     setDataSource((prev) =>
//       prev.map((item) =>
//         item.finance_account_id === record.finance_account_id
//           ? {
//               ...item,
//               qty: value,
//               subtotal: calculateSubtotal(item.price, value),
//             }
//           : item
//       )
//     )
//   }

//   const handleDelete = (key: string) => {
//     setDataSource((prev) =>
//       prev.filter((pos) => pos.finance_account_id !== key)
//     )
//   }
//   const [selectedDates, setSelectedDates] = useState<[string, string]>(['', ''])

//   const [selectedDifference, setSelectedDifference] = useState<number>(0)
//   const handleDateRangeSave = (
//     startDate: string,
//     endDate: string,
//     difference: number
//   ) => {
//     setSelectedDates([startDate, endDate])
//     setSelectedDifference(difference)
//   }

//   const { idDataTag } = useIdNamaTag()
//   const [selectTag, setSelectag] = useState<number | null>(null)

//   const [paymentForm] = Form.useForm()
//   const handleTag = (value: number) => {
//     setSelectag(value)
//   }
//   const calculateTotalSubtotal = () => {
//     const total = dataSource.reduce((total, item) => total + item.subtotal, 0)
//     return total.toLocaleString('id-ID')
//   }
//   const [amountPaid, setAmountPaid] = useState('')

//   const handleAmountPaidChange = (e: any) => {
//     setAmountPaid(e.target.value)
//   }


//   const [selectedBank, setSelectedBank] = useState<any | null>(null)

//   const formatDate = (dateString: any) => {
//     const [day, month, year] = dateString.split('-')
//     return `${year}-${month}-${day}`
//   }
//   const generateShortInvoiceId = (): string => {
//     const uuid = uuidv4()
//     const last4OfUUID = uuid.substr(uuid.length - 4)
//     const shortNumber = parseInt(last4OfUUID, 16) % 10000
//     return `INV${String(shortNumber).padStart(4, '0')}`
//   }
//   const [currentIdPos, setcurrentIdPos] = useState(generateShortInvoiceId())

//   const handleSave = () => {
//     const saveTag = idDataTag.reduce((map: any, warehouse: any) => {
//       map[warehouse.name] = warehouse.id
//       return map
//     }, {})
//     const saveIdTag = saveTag[forTag as any]

//     const accountMap = fiAc?.children?.reduce((map: any, warehouse: any) => {
//       map[warehouse.name] = warehouse.id
//       return map
//     }, {})
//     const accountId = accountMap[selectedBank as any]

//     const invoiceData = {
//       trans_date: formatDate(selectedDates[0]),
//       due_date: formatDate(selectedDates[1]),
//       contact_id: selectedContact,
//       contact_shipping_address_id: null,
//       sales_id: null,
//       status_id: 1,
//       include_tax: 0,
//       term_id: 1,
//       ref_number: currentIdPos,
//       memo: '',
//       attachment: [],
//       items: dataSource.map((item) => ({
//         finance_account_id: item.finance_account_id,
//         tax_id: null,
//         desc: '',
//         qty: item.qty,
//         price: item.price,
//         amount: item.subtotal,
//         price_after_tax: item.price,
//         amount_after_tax: item.subtotal,
//         tax_manual: 0,
//         discount_percent: 0,
//         unit: item.unit.id,
//       })),
//       witholdings: [
//         {
//           witholding_account_id: accountId,
//           witholding_amount: 0,
//           witholding_percent: 0,
//         },
//       ],
//       warehouse_id: selectedWarehouseId,
//       additional_discount_percent: 0,
//       additional_discount_amount: 0,
//       message: '',
//       tags: [saveIdTag],
//       shipping_cost: 0,
//       shipping_date: null,
//       shipping_comp_id: null,
//       shipping_tracking: null,
//       delivery_ids: null,
//       down_payment: amountPaid,
//       down_payment_bank_account_id: accountId,
//       witholding_percent: 0,
//       witholding_amount: 0,
//       witholding_account_id: accountId,
//       column_name: '',
//     }

//     saveInvoiceData(invoiceData)
//     // addPosMutation.mutate(invoiceData as any)
//   }

//   const columns = [
//     {
//       title: 'Barang',
//       dataIndex: 'finance_account_id',
//       key: 'finance_account_id',
//       render: (id: any) => (
//         <div>
//           <Select
//             showSearch
//             placeholder="Barang"
//             style={{ width: '320px' }}
//             optionFilterProp="children"
//             filterOption={(input, option) =>
//               option?.children?.toString()
//                 ? option.children
//                     .toString()
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 : false
//             }
//             onChange={handleProductChange}
//             defaultValue={id}
//           >
//             {idaDataBarang?.map((product) => (
//               <Select.Option key={product.id} value={product.id}>
//                 {product.name} -
//                 <Badge
//                   count={productQuantities[product.id] || 0}
//                   style={{ marginLeft: '10px' }}
//                 />
//               </Select.Option>
//             ))}
//           </Select>
//         </div>
//       ),
//     },

//     {
//       title: 'Harga',
//       dataIndex: 'price',
//       key: 'price',
//       render: (text: number, record: any) => (
//         <div style={{ textAlign: 'center' }}>
//           <div>{Math.floor(text).toLocaleString('id-ID')}</div>{' '}
//           <Select
//             defaultValue={record.selectedDiscount}
//             style={{ width: '120px', fontSize: '12px', marginTop: '4px' }}
//             onChange={(value) => handleDiscountChange(value, record)}
//             bordered={false}
//           >
//             {discountRates.map((rate) => (
//               <Select.Option key={rate.label} value={rate.label}>
//                 {rate.label}
//               </Select.Option>
//             ))}
//           </Select>
//         </div>
//       ),
//     },
//     {
//       title: 'Qty',
//       dataIndex: 'qty',
//       key: 'qty',
//       render: (text: any, record: any) => (
//         <div>
//           <Input
//             type="number"
//             value={text}
//             min={1}
//             style={{ textAlign: 'center' }}
//             onChange={(e) => handleQtyChange(Number(e.target.value), record)}
//           />
//         </div>
//       ),
//     },
//     {
//       title: 'Subtotal',
//       dataIndex: 'subtotal',
//       key: 'subtotal',
//       render: (text: number) => (
//         <div style={{ textAlign: 'center' }}>
//           {Math.floor(text).toLocaleString('id-ID')}
//         </div>
//       ),
//     },

//     {
//       title: 'Action',
//       key: 'action',
//       render: (text: any, record: any) => (
//         <Button
//           type="primary"
//           danger
//           onClick={() => handleDelete(record.finance_account_id)}
//         >
//           Delete
//         </Button>
//       ),
//     },
//   ]

//   return (
//     <div>
//       <Form.Item>
//         <DateRange
//           onChange={(dates) => {
//             setSelectedDates(dates)
//           }}
//           onDifferenceChange={(diff) => {
//             setSelectedDifference(diff)
//           }}
//           onSave={handleDateRangeSave}
//         />
//       </Form.Item>
//       <div>
//         <Select
//           placeholder="Warehouse"
//           showSearch
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
//           onChange={handleWarehouseChange}
//           value={selectedWarehouseId}
//         >
//           {idWarehouse?.map((warehouse) => (
//             <Select.Option key={warehouse.id} value={warehouse.id}>
//               {warehouse.name}
//             </Select.Option>
//           ))}
//         </Select>
//         <Select
//           showSearch
//           placeholder="Contact"
//           style={{ width: '300px' }}
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             (option?.children as unknown as string)
//               .toLowerCase()
//               .includes(input.toLowerCase())
//           }
//           value={selectedContact}
//           onChange={handleContactChange}
//         >
//           {idContact
//             ?.filter((contact: any) => {
//               const match = contact.group_name === warehouseId

//               return match
//             })
//             .map((item) => (
//               <Select.Option key={item.id} value={item.id}>
//                 {item.name}
//               </Select.Option>
//             ))}
//         </Select>
//         <Select
//           placeholder="Tag"
//           showSearch
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
//           onChange={handleTag}
//           value={forTag}
//         >
//           {idDataTag?.map((product) => (
//             <Select.Option key={product.id} value={product.id}>
//               {product.name}
//             </Select.Option>
//           ))}
//         </Select>
//         <Input value={currentIdPos} style={{ width: '25%' }} />

//         <Button
//           type="primary"
//           onClick={handleOkClick}
//           style={{ marginTop: '10px' }}
//         >
//           OK
//         </Button>
//         <Select
//           mode="multiple"
//           placeholder="Barang"
//           style={{ width: '100%', marginTop: '10px' }}
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             option?.children?.toString()
//               ? option.children
//                   .toString()
//                   .toLowerCase()
//                   .includes(input.toLowerCase())
//               : false
//           }
//           onChange={handleProductChange}
//           value={selectedFinanceAccountIds}
//           showSearch
//           onSearch={handleSearch}
//           open={dropdownVisible}
//           onDropdownVisibleChange={(open) => setDropdownVisible(open)}
//           dropdownRender={(menu) => (
//             <div style={{ minWidth: '800px', padding: '8px' }}>
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   fontWeight: 'bold',
//                   padding: '8px',
//                   borderBottom: '1px solid #e8e8e8',
//                 }}
//               >
//                 <span style={{ flex: 2 }}>Nama Barang</span>
//                 <span style={{ flex: 1 }}>Price</span>
//                 <span style={{ flex: 2 }}>Satuan</span>
//                 {discountRates.map((rate) => (
//                   <span key={rate.label} style={{ flex: 1 }}>
//                     {rate.label}
//                   </span>
//                 ))}
//               </div>
//               <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
//                 {menu}
//               </div>
//             </div>
//           )}
//           tagRender={customDisplayRender as any}
//         >
//           {idaDataBarang
//             .filter((item) =>
//               item.name.toLowerCase().includes(searchValue.toLowerCase())
//             )
//             .map((product) => {
//               // Pembulatan harga ke ribuan terdekat
//               const roundedPrice = Math.round(product.price / 1000) * 1000
//               return (
//                 <Select.Option
//                   key={product.id}
//                   value={product.id}
//                   label={product.id}
//                 >
//                   <div
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       padding: '8px',
//                       borderBottom: '1px solid #e8e8e8',
//                     }}
//                   >
//                     <span style={{ flex: 2 }}>
//                       {product.name}
//                       <Badge
//                         count={productQuantities[product.id] || 0}
//                         style={{ marginLeft: '10px' }}
//                       />
//                     </span>

//                     <span style={{ flex: 1 }}>
//                       {roundedPrice.toLocaleString('id-ID')}
//                     </span>
//                     <span style={{ flex: 1 }}>{product.unit?.id}</span>
//                     {discountRates.map((rate) => {
//                       const discountedPrice =
//                         Math.round(
//                           (product.price -
//                             (product.price * rate.percentage) / 100) /
//                             1000
//                         ) * 1000
//                       return (
//                         <span key={rate.label} style={{ flex: 1 }}>
//                           {discountedPrice.toLocaleString('id-ID')}
//                         </span>
//                       )
//                     })}
//                   </div>
//                 </Select.Option>
//               )
//             })}
//         </Select>

//         <Table
//           dataSource={dataSource}
//           columns={columns}
//           rowKey="id"
//           style={{ marginTop: '20px' }}
//         />
//         <Form style={{ marginTop: '16px', width: '20%' }}>
//           <h3>Total : {calculateTotalSubtotal()}</h3>
//         </Form>
//         <Form
//           form={paymentForm}
//           layout="vertical"
//           style={{ marginTop: '16px', width: '20%' }}
//         >
//           <Form.Item
//             label="Jumlah Bayar"
//             name="amountPaid"
//             rules={[{ required: true, message: 'Harap masukkan jumlah bayar' }]}
//           >
//             <Input
//               type="number"
//               value={amountPaid}
//               onChange={handleAmountPaidChange}
//             />
//           </Form.Item>
//           <Select
//             placeholder="Pilih bank"
//             value={selectedBank as any}
//             onChange={(value) => setSelectedBank(value)}
//             style={{ marginTop: '16px', width: '100%' }}
//           >
//             {fiAc?.children?.map((e) => (
//               <Select.Option key={e.id} value={e.name}>
//                 {e.name}
//               </Select.Option>
//             ))}
//           </Select>

//           <Form.Item>
//             <Button
//               onClick={handleSave}
//               type="primary"
//               style={{ marginTop: '10px' }}
//             >
//               SIMPAN
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   )
// }

// export default StockSelectorTable
<>
</>