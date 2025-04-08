// import React, { useState, useEffect, useContext } from 'react'
// import {
//   Select,
//   Badge,
//   Table,
//   Button,
//   Form,
//   Collapse,
//   Row,
//   Col,
//   Typography,
//   DatePicker,
// } from 'antd'
// import { useStokBarang } from './StokBarang'

// import { useIdNamaBarang } from './NamaBarang'
// import Input from 'antd/es/input/Input'
// import DateRange from '../DateRange'
// import TextArea from 'antd/es/input/TextArea'

// import { useIdNamaTag } from './NamaTag'
// import { useIdContact } from './NamaContact'

// import { SaveApi } from './SaveApi'
// import { v4 as uuidv4 } from 'uuid'
// import { useAddTransactionMutation } from '../../hooks/transactionHooks'
// import { Navigate } from 'react-router-dom'
// import { useGetBarangsQuery } from '../../hooks/barangHooks'
// import { useGetContactsQuery } from '../../hooks/contactHooks'
// import { saveToApiNextPayment } from './NextPayment'
// import { useNavigate } from 'react-router-dom'
// import { useWarehouseStock } from './fetchSemuaStok'
// import UserContext from '../../contexts/UserContext'
// import NumberFormat, {
//   NumberFormatBase,
//   NumericFormat,
// } from 'react-number-format'
// import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
// import { useGetTagsQueryDb } from '../../hooks/tagHooks'
// import { AnyRecord } from 'dns'
// import { useGetAkunBanksQueryDb } from '../../hooks/akunBankHooks'
// import { DeleteOutlined } from '@ant-design/icons'

// const { Option } = Select
// const { Title, Text } = Typography

// const StockSelectorTable = () => {
//   const { Panel } = Collapse
//   const navigate = useNavigate()

//   const { dataStokBarang, fetchStokBarang } = useStokBarang()

//   const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
//     null
//   )
//   const [selectedWarehouse, setSelectedWarehouse] = useState<any>(undefined)

//   const [selectedDate, setSelectedDate] = useState<string | undefined>()
//   const { warehouseStock } = useWarehouseStock(
//     selectedDate || '',
//     selectedWarehouseId
//   )

//   const userContext = useContext(UserContext)
//   const { user } = userContext || {}

//   const { idaDataBarang } = useIdNamaBarang()
//   const { data: barangs } = useGetBarangsQuery()
//   const { data: gudangdb } = useGetWarehousesQuery()
//   const { data: akunBanks } = useGetAkunBanksQueryDb()

//   const { data: tagDb } = useGetTagsQueryDb()



//   const [selectedContactGroup, setSelectedContactGroup] = useState<any | null>(
//     null
//   )
//   const { loading, idContact } = useIdContact(selectedContactGroup)
//   const { data: contacts } = useGetContactsQuery()

//   const { saveInvoiceData } = SaveApi()
//   //

//   const [warehouseName, setWarehouseName] = useState<string | null>(null)
//   const getWarehouseName = () => {
//     if (!gudangdb || !selectedWarehouseId) return null

//     const selectedWarehouse = gudangdb.find(
//       (warehouse: { id: number; name: string }) =>
//         warehouse.id === Number(selectedWarehouseId)
//     )
//     return selectedWarehouse ? selectedWarehouse.name : null
//   }

//   useEffect(() => {
//     const name = getWarehouseName()
//     setWarehouseName(name)
//     if (name) {
//     }
//   }, [gudangdb, selectedWarehouseId])

//   const [tagName, setTagName] = useState<string[] | null>(null)
//   console.log({ tagName })
//   const [bankAccountName, setBankAccountName] = useState<string | null>(null)

//   const [bankAccountId, setBankAccountId] = useState<string | null>(null)

//   const getTagName = () => {
//     if (!tagDb || !warehouseName) return null

//     const matchingTags = tagDb.filter(
//       (tag: { name: string }) => tag.name === warehouseName
//     )

//     return matchingTags.length > 0 ? matchingTags.map((tag) => tag.name) : null
//   }
//   useEffect(() => {
//     const names = getTagName()
//     setTagName(names)
//   }, [warehouseName, tagDb])

//   const tagId = tagName
//     ? tagDb?.filter((tag) => tagName.includes(tag.name)).map((tag) => tag.id)
//     : null

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

//   useEffect(() => {
//     const id = getBankAccountId()
//     setBankAccountId(id as any)
//   }, [warehouseName, akunBanks])
//   const addPosMutation = useAddTransactionMutation()

//   const [productQuantities, setProductQuantities] = useState<{
//     [key: string]: number
//   }>({})

//   const [selectedFinanceAccountIds, setSelectedFinanceAccountIds] = useState<
//     string[]
//   >([])

//   useEffect(() => {
//     if (user) {
//       setSelectedWarehouseId(user.id_outlet)
//     }
//   }, [user])
//   const [dataSource, setDataSource] = useState<any[]>([])

//   useEffect(() => {
//     if (selectedFinanceAccountIds.length > 0 && selectedWarehouseId !== null) {
//       selectedFinanceAccountIds.forEach((productId: any) => {
//         fetchStokBarang(productId, Number(selectedWarehouseId))
//       })
//     }
//   }, [selectedFinanceAccountIds, selectedWarehouseId])

//   useEffect(() => {
//     if (warehouseStock) {
//       setProductQuantities((prevQuantities) => {
//         const newQuantities = { ...prevQuantities }

//         warehouseStock.forEach((stockItem: any) => {
//           newQuantities[stockItem.productId] = stockItem.qty
//         })

//         return newQuantities
//       })
//     }
//   }, [warehouseStock])

//   const customDisplayRender = (value: any) => {
//     return ''
//   }
//   const handleProductChange = (values: string[]) => {
//     setSelectedFinanceAccountIds(values)
//   }
//   const [searchValue, setSearchValue] = useState('')

//   const handleSearch = (value: any) => {
//     setSearchValue(value)
//   }

//   const [dropdownVisible, setDropdownVisible] = useState(false)
//   const [selectedPrices, setSelectedPrices] = useState<{
//     [key: string]: string
//   }>({})

//   const discountRates = [
//     { label: 'Retail 10%', percentage: 10 },
//     { label: 'Applikator 16%', percentage: 16 },
//     { label: 'Toko 18%', percentage: 18 },
//     { label: 'Nego 19%', percentage: 19 },
//     { label: 'Khusus 21%', percentage: 21 },
//   ]

//   const [discountedPrices, setDiscountedPrices] = useState<{
//     [key: string]: number
//   }>({})

//   const [priceDifferences, setPriceDifferences] = useState<{
//     [key: string]: number
//   }>({})

//   const [selectedDiscounts, setSelectedDiscounts] = useState<{
//     [key: string]: number
//   }>({})
//   const [selectedProductPrices, setSelectedProductPrices] = useState<
//     Record<string, number>
//   >({})

//   const handlePriceClick = (rateLabel: string, product: any) => {
//     const selectedDiscount = discountRates.find(
//       (rate) => rate.label === rateLabel
//     )
//     setSelectedProductPrices((prevPrices) => ({
//       ...prevPrices,
//       [product.id]: product.price,
//     }))
//     if (selectedDiscount) {
//       setSelectedPrices((prev) => ({
//         ...prev,
//         [product.id]: rateLabel,
//       }))

//       setSelectedDiscounts((prev) => ({
//         ...prev,
//         [product.id]: selectedDiscount.percentage,
//       }))

//       const discountedPrice = (
//         product.price -
//         (product.price * selectedDiscount.percentage) / 100
//       ).toFixed(2)

//       setDiscountedPrices((prev) => ({
//         ...prev,
//         [product.id]: Number(discountedPrice),
//       }))

//       const difference = (product.price - Number(discountedPrice)).toFixed(2)

//       setPriceDifferences((prev) => ({
//         ...prev,
//         [product.id]: Number(difference),
//       }))
//     }
//   }

//   const calculateDiscount = (basePrice: number, percentage: number): number => {
//     return basePrice - basePrice * (percentage / 100)
//   }

//   const calculateSubtotal = (price: number, qty: number) => {
//     return price * qty
//   }
//   const calculateGapPrice = (gapPrice: number, qty: number) => {
//     return gapPrice * qty
//   }
//   const handleDiscountChange = (value: string, record: any) => {
//     const selectedDiscount = discountRates.find((rate) => rate.label === value)

//     const basePrice =
//       selectedProductPrices[record.finance_account_id] || record.basePrice

//     if (selectedDiscount) {
//       const newPrice = calculateDiscount(basePrice, selectedDiscount.percentage)
//       const gapPrice = Number(basePrice) - Number(newPrice)
//       const gapPriceTotal = gapPrice * record.qty

//       setDataSource((prev) =>
//         prev.map((item: any) =>
//           item.finance_account_id === record.finance_account_id
//             ? {
//                 ...item,
//                 price: Number(newPrice),
//                 subtotal: calculateSubtotal(newPrice, item.qty),
//                 selectedDiscountValue: selectedDiscount.percentage,
//                 selectedDiscount: selectedDiscount.label,
//                 gapPrice: gapPrice,
//                 gapPriceTotal: gapPriceTotal,
//               }
//             : item
//         )
//       )
//     } else {
//       setDataSource((prev) =>
//         prev.map((item: any) =>
//           item.finance_account_id === record.finance_account_id
//             ? {
//                 ...item,
//                 price: Number(basePrice),
//                 subtotal: calculateSubtotal(basePrice, item.qty),
//                 selectedDiscountValue: 0,
//                 selectedDiscount: 'Retail',
//                 gapPrice: 0,
//                 gapPriceTotal: 0,
//               }
//             : item
//         )
//       )
//     }
//   }

//   const warehouseMap = gudangdb
//     ? gudangdb.reduce((map: any, warehouse: any) => {
//         map[warehouse.id] = warehouse.name
//         return map
//       }, {})
//     : {}
//   console.log({ warehouseMap })
//   const warehouseId = warehouseMap[selectedWarehouseId as any]
//   const untukTag = gudangdb
//     ? gudangdb.reduce((map: any, warehouse: any) => {
//         map[warehouse.id] = warehouse.name
//         return map
//       }, {})
//     : {}
//   console.log({ untukTag })

//   const forTag = untukTag[selectedWarehouseId as any]
//   console.log({ forTag })

//   useEffect(() => {
//     if (selectedWarehouseId) {
//       setSelectedWarehouseId(selectedWarehouseId)
//       handleWarehouseChange(selectedWarehouseId)
//     }
//   }, [selectedWarehouseId])
//   const handleWarehouseChange = (value: number | string) => {
//     setSelectedWarehouseId(value)

//     // setSelectedContact(null)

//     const matchingTag = Array.isArray(tagDb)
//       ? tagDb.find((tag) => tag.name === forTag)
//       : undefined

//     setSelectag(matchingTag ? [matchingTag.id] : [])
//     const bangke = gudangdb
//       ? gudangdb.reduce((map: any, warehouse: any) => {
//           map[warehouse.id] = warehouse.name
//           return map
//         }, {})
//       : {}

//     const namaBangke = bangke[value as any]

//     const findMatchingBank = (namaGudang: string) => {
//       return akunBanks?.find((bank) =>
//         bank.name.startsWith(`KAS PENJUALAN_${namaGudang}`)
//       )
//     }

//     const matchingBank = findMatchingBank(namaBangke)

//     if (matchingBank) {
//       setSelectedBank(matchingBank.name)
//     } else {
//     }
//   }
//   const retailDiscount =
//     discountRates.find((rate) => rate.label === 'Retail 10%')?.percentage || 0

//   const handleOkClick = () => {
//     setDropdownVisible(false)

//     const selectedItems = barangs!.filter((item: any) =>
//       selectedFinanceAccountIds.includes(item.id)
//     )

//     setDataSource((prev) => {
//       const newItems = selectedItems
//         .filter(
//           (item) =>
//             !prev.some(
//               (existingItem) => existingItem.finance_account_id === item.id
//             )
//         )
//         .map((item) => {
//           const retailPrice = item.price - (item.price * retailDiscount) / 100

//           return {
//             finance_account_id: item.id,
//             finance_account_name: item.name,
//             basePrice: item.price,

//             price: Number(discountedPrices[item.id]) || retailPrice,

//             qty: 1,

//             selectedDiscount: selectedPrices[item.id] || 'Retail 10%',

//             selectedDiscountValue: selectedDiscounts[item.id] || retailDiscount,

//             gapPrice:
//               priceDifferences[item.id] ||
//               (item.price - retailPrice).toFixed(2),

//             subtotal: Number(discountedPrices[item.id]) || retailPrice,

//             satuan: item.unit?.name,
//           }
//         })

//       return [...prev, ...newItems]
//     })

//     setSelectedFinanceAccountIds(selectedFinanceAccountIds.map(String))
//   }

//   const handleQtyChange = (value: number, record: any) => {
//     const basePrice =
//       selectedProductPrices[record.finance_account_id] || record.basePrice
//     const newPrice = calculateDiscount(
//       basePrice,
//       record.selectedDiscountValue || 0
//     )
//     const gapPrice = Number(basePrice) - Number(newPrice)
//     const gapPriceTotal = gapPrice * value

//     setDataSource((prev) =>
//       prev.map((item) =>
//         item.finance_account_id === record.finance_account_id
//           ? {
//               ...item,
//               qty: value,
//               price: newPrice,
//               subtotal: calculateSubtotal(newPrice, value),
//               gapPrice: gapPrice,
//               gapPriceTotal: gapPriceTotal,
//             }
//           : item
//       )
//     )
//   }

//   const handleDelete = (key: any) => {
//     setDataSource((prev) =>
//       prev.filter((pos) => pos.finance_account_id !== key)
//     )

//     setSelectedPrices({})
//     setSelectedFinanceAccountIds([])

//     setAmountPaid(null)
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

//   const [paymentForm] = Form.useForm()

//   const [selectTag, setSelectag] = useState<any[]>([])
//   console.log({ selectTag })
//   const handleTag = (value: any[]) => {
//     setSelectag(value)
//   }
//   const [selectedContact, setSelectedContact] = useState<number | null>(null)

//   const handleContactChange = (value: number) => {
//     setSelectedContact(value)
//   }
//   const selectedReceivable = selectedContact
//     ? idContact.find((contact: any) => contact.id === selectedContact)
//         ?.receivable || 0
//     : '--'

//   const formatRupiah = (number: any) => {
//     return new Intl.NumberFormat('id-ID', {
//       minimumFractionDigits: 0,
//     }).format(number)
//   }
//   const totalReceivable = idContact
//     ?.filter((contact: any) => contact.group_name === warehouseId)
//     .reduce((total: number, contact: any) => {
//       const receivable = parseFloat(contact.receivable) || 0
//       return total + receivable
//     }, 0)
//   const limitizeTrans = totalReceivable > 3800
//   const [totalSubtotal, setTotalSubtotal] = useState<number>(0)

//   const [formattedTotalSubtotal, setFormattedTotalSubtotal] =
//     useState<string>('')

//   useEffect(() => {
//     const calculateTotalSubtotal = () => {
//       const total = dataSource.reduce((total, item) => total + item.subtotal, 0)
//       setTotalSubtotal(total)
//       setFormattedTotalSubtotal(total.toLocaleString('id-ID'))
//     }

//     calculateTotalSubtotal()
//   }, [dataSource])

//   const [amountPaid, setAmountPaid] = useState<number | null>(null)

//   const [piutang, setPiutang] = useState<number>(0)

//   const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseFloat(e.target.value)

//     if (!isNaN(value) && value <= totalSubtotal) {
//       setAmountPaid(value)
//     } else {
//       alert('Jumlah bayar tidak boleh melebihi total tagihan')
//     }
//   }

//   useEffect(() => {
//     setPiutang((totalSubtotal || 0) - (amountPaid || 0))
//   }, [totalSubtotal, amountPaid])



//   const [selectedBank, setSelectedBank] = useState<any | null>(bankAccountName)

//   const [status, setStatus] = useState<number | undefined>()
//   useEffect(() => {
//     setSelectedBank(bankAccountName)
//   }, [bankAccountName])

//   const evaluateStatus = () => {
//     if (amountPaid === null || amountPaid === 0) {
//       return 1
//     } else if (amountPaid > 0 && amountPaid < totalSubtotal) {
//       return 2
//     } else if (amountPaid === totalSubtotal) {
//       return 3
//     }
//     return status
//   }

//   useEffect(() => {
//     const newStatus = evaluateStatus()
//     setStatus(newStatus)
//   }, [amountPaid, totalSubtotal])

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
//   const stringInv = currentIdPos as any

//   const [catatan, setCatatan] = useState('')
//   const [yangMana, setYangMana] = useState()

//   const isSaveDisabled = !selectedContact || !bankAccountId

//   const handleSetAmountPaid = () => {
//     setAmountPaid(totalSubtotal)
//   }
//   const handleSave = () => {
//     if (isSaveDisabled) return

//     const saveTag = tagDb?.reduce((map: any, tag: any) => {
//       map[tag.name] = tag.id
//       return map
//     }, {})

//     const saveIdTags = selectTag
//       .map((id: number) => {
//         const tag = tagDb?.find((item: any) => item.id === id)
//         return tag ? { id: tag.id, name: tag.name } : null
//       })
//       .filter(Boolean)

//     const accountMap = akunBanks?.reduce((map: any, warehouse: any) => {
//       map[warehouse.name] = warehouse.id
//       return map
//     }, {})
//     const accountId = accountMap[selectedBank as any]
//     setYangMana(accountId)

//     const saveNameContact = idContact.reduce((map: any, warehouse: any) => {
//       map[warehouse.id] = warehouse.name
//       return map
//     }, {})
//     const saveContactName = saveNameContact[selectedContact as any]

//     const saveNamaGudang = idWarehouse.reduce((map: any, warehouse: any) => {
//       map[warehouse.id] = warehouse.name
//       return map
//     }, {})
//     const simpanGudang = saveNamaGudang[selectedWarehouseId as any]

//     const invoiceData = {
//       ref_number: currentIdPos,
//       status_id: status,
//       trans_date: formatDate(selectedDates[0]),
//       due_date: formatDate(selectedDates[1]),
//       contact_id: selectedContact,
//       sales_id: null,
//       include_tax: 0,
//       term_id: 1,
//       memo: '',
//       amount: totalSubtotal,
//       amount_after_tax: 0,
//       warehouse_id: selectedWarehouseId,
//       attachment: [],
//       items: dataSource.map((item) => ({
//         amount: item.subtotal,
//         discount_amount: item.gapPriceTotal || item.gapPrice,
//         finance_account_id: item.finance_account_id,
//         discount_percent: item.selectedDiscountValue || 0,
//         name: item.finance_account_name,
//         tax_id: null,
//         desc: '',
//         qty: item.qty,
//         price: item.price,
//         unit_id: item.unit_id,
//         satuan: item.name,
//       })),
//       witholdings: [
//         {
//           witholding_account_id: accountId || bankAccountId,
//           name: selectedBank || bankAccountName,
//           down_payment: amountPaid || 0,
//           witholding_percent: 0,
//           witholding_amount: 0,
//         },
//       ],
//       contacts: [
//         {
//           id: selectedContact,
//           name: saveContactName,
//         },
//       ],
//       warehouses: [
//         {
//           warehouse_id: selectedWarehouseId,
//           name: simpanGudang,
//         },
//       ],
//       // ...
//       tages: saveIdTags.map((tag) => ({
//         id: tag?.id || tagId,
//         name: tag?.name || tagName,
//       })),
//       due: piutang,
//       down_payment: amountPaid || 0,
//       down_payment_bank_account_id: accountId || bankAccountId,
//       witholding_account_id: accountId || bankAccountId,

//       message: catatan,
//       tags: selectTag || tagId,

//       witholding_amount: 0,
//       witholding_percent: 0,
//       column_name: '',
//     }

//     saveInvoiceData(invoiceData)
//     addPosMutation.mutate(invoiceData as any)
//     navigate('/listkledo')
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
//             style={{ width: '420px' }}
//             optionFilterProp="items"
//             filterOption={(input, option) =>
//               option?.items?.toString()
//                 ? option.items
//                     .toString()
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 : false
//             }
//             onChange={handleProductChange}
//             defaultValue={id}
//           >
//             {barangs?.map((product) => {
//               const stockQuantity =
//                 warehouseStock.find((stock: any) => stock.id === product.id)
//                   ?.stock || 0

//               if (stockQuantity === 0) return null

//               return (
//                 <Select.Option key={product.id} value={product.id}>
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <span style={{ paddingRight: '16px' }}>{product.name}</span>
//                     <Badge
//                       count={stockQuantity}
//                       overflowCount={Infinity}
//                       style={{
//                         backgroundColor: '#52C41A',
//                         borderColor: '#52C41A',
//                         color: 'white',
//                         marginLeft: 'auto',
//                         marginRight: '50px',
//                       }}
//                     />
//                   </div>
//                 </Select.Option>
//               )
//             })}
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
//           <NumericFormat
//             value={text}
//             allowNegative={false}
//             thousandSeparator="."
//             decimalSeparator=","
//             decimalScale={0}
//             onValueChange={(values) => {
//               const { floatValue } = values
//               handleQtyChange(floatValue || 0, record)
//             }}
//             customInput={Input}
//             style={{ textAlign: 'left', width: '70px' }}
//           />
//         </div>
//       ),
//     },
//     {
//       title: 'Satuan',
//       dataIndex: 'satuan',
//       key: 'satuan',
//     },
//     {
//       title: 'Harga',
//       dataIndex: 'price',
//       key: 'price',
//       render: (text: number, record: any) => (
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <div style={{ textAlign: 'right' }}>
//             {Math.floor(record.price).toLocaleString('id-ID')}
//           </div>
//           <Select
//             value={record.selectedDiscount}
//             style={{
//               width: '120px',
//               fontSize: '12px',
//               marginLeft: '6px',
//             }}
//             onChange={(value) => handleDiscountChange(value, record)}
//             bordered={false}
//           >
//             <Select.Option value="Retail">Retail</Select.Option>
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
//       title: '',
//       key: 'action',
//       render: (text: any, record: any) => (
//         <div>
//           <DeleteOutlined
//             style={{
//               color: 'red',
//               border: '0.5px solid red',
//               padding: '4px',
//               fontSize: '16px',
//               lineHeight: '16px',
//               borderRadius: '4px',
//             }}
//             type="primary"
//             onClick={() => handleDelete(record.finance_account_id)}
//           />
//         </div>
//       ),
//     },
//   ]
//   const labelStyle = {
//     display: 'inline-block' as const,
//     minWidth: '120px' as const,
//     textAlign: 'left' as const,
//   }

//   const labelColonStyle = {
//     display: 'inline-block' as const,
//     minWidth: '10px' as const,
//     textAlign: 'left' as const,
//   }
//   return (
//     <>
//       <div
//         style={{
//           background: 'white',
//           padding: '20px',
//           // marginBottom: '10px',
//           borderRadius: '10px 10px 0px 0px',
//           fontSize: '30px',
//           borderBottom: '1px',
//         }}
//       >
//         Tambah Tagihan
//       </div>
//       <div
//         style={{
//           background: 'white',
//           padding: '20px',
//           marginBottom: '20px',
//           borderRadius: '0px 0px 10px 10px',
//         }}
//       >
//         <div style={{ paddingBottom: '0px', border: 'red' }}>
//           <Row gutter={16} style={{ marginBottom: '10px' }}>
//             <Col span={12}>
//               <span style={labelStyle}>Nama Pelanggan</span>
//               <span style={labelColonStyle}>:</span>
//               <Select
//                 showSearch
//                 placeholder="Select a Contact"
//                 style={{ width: '70%' }}
//                 optionFilterProp="label"
//                 filterOption={(input: any, option: any) =>
//                   option?.label
//                     ?.toString()
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 }
//                 value={selectedContact}
//                 onChange={handleContactChange}
//               >
//                 {Array.isArray(contacts) &&
//                   contacts
//                     .filter((contact) => contact.group?.name === warehouseId)
//                     .map((item) => (
//                       <Select.Option
//                         key={item.id}
//                         value={item.id}
//                         label={item.name}
//                       >
//                         {item.name}
//                       </Select.Option>
//                     ))}
//               </Select>
//             </Col>
//             <Col span={12}>
//               <span style={labelStyle}>Outlet</span>
//               <span style={labelColonStyle}>:</span>
//               <Select
//                 placeholder="Warehouse"
//                 showSearch
//                 style={{ width: '70%' }}
//                 optionFilterProp="label"
//                 filterOption={(input: any, option: any) =>
//                   option?.label
//                     ?.toString()
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 }
//                 value={selectedWarehouseId}
//                 onChange={handleWarehouseChange}
//               >
//                 {idWarehouse?.map((warehouse) => (
//                   <Select.Option
//                     key={warehouse.id}
//                     value={warehouse.id}
//                     label={warehouse.name}
//                   >
//                     {warehouse.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Col>
//           </Row>

//           <Row gutter={16} style={{ marginBottom: '10px' }}>
//             <Col span={12}>
//               <span style={labelStyle}>Piutang/Pelanggan</span>
//               <span style={labelColonStyle}>:</span>
//               <Input
//                 style={{ width: '70%' }}
//                 value={formatRupiah(selectedReceivable)}
//                 readOnly
//               />
//             </Col>

//             <Col span={12}>
//               <span style={labelStyle}>Piutang/Outlet</span>
//               <span style={labelColonStyle}>:</span>
//               <Input
//                 style={{ width: '70%' }}
//                 value={formatRupiah(totalReceivable)}
//                 readOnly
//               />
//             </Col>
//           </Row>

//           <Row gutter={16} style={{ marginBottom: '10px' }}>
//             <Col span={12}>
//               <span style={labelStyle}>Platform</span>
//               <span style={labelColonStyle}>:</span>
//               <Input
//                 style={{ width: '70%' }}
//                 value={formatRupiah(20000000)}
//                 readOnly
//               />
//             </Col>
//             <Col span={12}>
//               <span style={labelStyle}>Platform</span>
//               <span style={labelColonStyle}>:</span>
//               <Input
//                 style={{ width: '70%' }}
//                 value={formatRupiah(400000000)}
//                 readOnly
//               />
//             </Col>
//           </Row>
//           <Row gutter={16} style={{ marginBottom: '10px' }}>
//             <Col span={12}>
//               <span style={labelStyle}>No Invoice</span>
//               <span style={labelColonStyle}>:</span>
//               <Input style={{ width: '70%' }} value={currentIdPos} readOnly />
//             </Col>
//             <Col span={12}>
//               <span style={labelStyle}>Nama Tag</span>
//               <span style={labelColonStyle}>:</span>
//               <Select
//                 mode="multiple"
//                 placeholder="Tag"
//                 showSearch
//                 style={{ width: '70%' }}
//                 optionFilterProp="label"
//                 filterOption={(input: any, option: any) =>
//                   option?.label
//                     ?.toString()
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 }
//                 onChange={handleTag}
//                 value={selectTag}
//               >
//                 {Array.isArray(tagDb) &&
//                   tagDb.map((product: any) => (
//                     <Select.Option
//                       key={product.id}
//                       value={product.id}
//                       label={product.name}
//                     >
//                       {product.name}
//                     </Select.Option>
//                   ))}
//               </Select>
//             </Col>
//           </Row>
//         </div>
//         <Form.Item style={{ paddingTop: '0px' }}>
//           <DateRange
//             onChange={(dates) => {
//               setSelectedDates(dates)
//             }}
//             onDifferenceChange={(diff) => {
//               setSelectedDifference(diff)
//             }}
//             onSave={handleDateRangeSave}
//           />
//         </Form.Item>
//         <div>
//           <Button
//             type="primary"
//             onClick={handleOkClick}
//             style={{ marginRight: '20px', width: '120px' }}
//           >
//             Pilih Barang
//           </Button>
//           <Select
//             mode="multiple"
//             placeholder="Pilih Barang"
//             style={{ width: '100%', marginTop: '10px' }}
//             optionFilterProp="items"
//             filterOption={false}
//             onChange={handleProductChange}
//             value={selectedFinanceAccountIds}
//             showSearch
//             onSearch={handleSearch}
//             open={dropdownVisible}
//             onDropdownVisibleChange={(open) => setDropdownVisible(open)}
//             dropdownRender={(menu) => (
//               <div style={{ minWidth: '800px', padding: '8px' }}>
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     fontWeight: 'bold',
//                     padding: '8px',
//                     borderBottom: '1px solid #e8e8e8',
//                     backgroundColor: '#f5f5f5',
//                   }}
//                 >
//                   <span style={{ flex: 2, textAlign: 'left' }}>
//                     Nama Barang
//                   </span>
//                   <span style={{ flex: 1, textAlign: 'center' }}>Qty</span>
//                   <span style={{ flex: 1, textAlign: 'center' }}>Price</span>
//                   {/* <span style={{ flex: 1, textAlign: 'center' }}>Satuan</span> */}

//                   {discountRates.map((rate) => (
//                     <span
//                       key={rate.label}
//                       style={{ flex: 1, textAlign: 'center' }}
//                     >
//                       {rate.label}
//                     </span>
//                   ))}
//                 </div>
//                 <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
//                   {menu}
//                 </div>
//               </div>
//             )}
//             tagRender={customDisplayRender as any}
//           >
//             {Array.isArray(barangs) &&
//               barangs
//                 .filter((item) =>
//                   item.name.toLowerCase().includes(searchValue.toLowerCase())
//                 )
//                 .map((product) => {
//                   const stockQuantity =
//                     warehouseStock.find((stock: any) => stock.id === product.id)
//                       ?.stock || 0
//                   if (stockQuantity === 0) return null

//                   return (
//                     <Select.Option
//                       key={product.id}
//                       value={product.id}
//                       label={product.id}
//                     >
//                       <div
//                         style={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                           padding: '8px',
//                           borderBottom: '1px solid #e8e8e8',
//                         }}
//                       >
//                         <span style={{ flex: 2, textAlign: 'left' }}>
//                           {product.name}
//                         </span>
//                         <span style={{ flex: 1, textAlign: 'center' }}>
//                           {Number(stockQuantity).toLocaleString('id-ID')}{' '}
//                         </span>
//                         <span style={{ flex: 1, textAlign: 'center' }}>
//                           {Number(product.price).toLocaleString('id-ID', {
//                             minimumFractionDigits: 0,
//                           })}{' '}
//                         </span>
//                         {/* 
//                       <span style={{ flex: 1, textAlign: 'center' }}>
//                         {product.unit?.name}
//                       </span> */}

//                         {discountRates.map((rate) => {
//                           const discountedPrice = (
//                             product.price -
//                             (product.price * rate.percentage) / 100
//                           ).toFixed(2)
//                           const formattedPrice = Number(
//                             discountedPrice
//                           ).toLocaleString('id-ID', {
//                             minimumFractionDigits: 0,
//                           })

//                           return (
//                             <span
//                               key={rate.label}
//                               onClick={() =>
//                                 handlePriceClick(rate.label, product)
//                               }
//                               style={{
//                                 flex: 1,
//                                 textAlign: 'center',
//                                 backgroundColor:
//                                   selectedPrices[product.id] === rate.label
//                                     ? '#52C41A'
//                                     : 'transparent',
//                                 cursor: 'pointer',
//                               }}
//                             >
//                               {formattedPrice}{' '}
//                             </span>
//                           )
//                         })}
//                       </div>
//                     </Select.Option>
//                   )
//                 })}
//           </Select>

//           {/* <div>
//           {warehouseStock.length > 0 ? (
//             warehouseStock.map((item) => (
//               <div key={item.id}>
//                 <p>{`Code: ${item.code}`}</p>
//                 <p>{`Name: ${item.name}`}</p>
//                 <p>{`Stock: ${item.stock}`}</p>
//                 <p>{`Stock Total: ${item.stock_total}`}</p>
//               </div>
//             ))
//           ) : (
//             <p>No stock data available</p>
//           )}
//         </div> */}
//           <Table
//             dataSource={dataSource}
//             columns={columns}
//             rowKey="finance_account_id"
//             style={{ marginTop: '20px', marginBottom: '20px' }}
//             pagination={false}
//           />

//           <Form
//             style={{
//               paddingBottom: '0px',
//               justifyItems: 'right',
//               border: '1px',
//             }}
//             form={paymentForm}
//           >
//             <Row gutter={16} style={{ marginBottom: '10px' }}>
//               <Col span={12}>
//                 <span
//                   style={{
//                     ...labelStyle,
//                     fontSize: '16px',
//                   }}
//                 >
//                   Total
//                 </span>
//                 <span
//                   style={{
//                     ...labelColonStyle,
//                     fontSize: '16px',
//                   }}
//                 >
//                   :
//                 </span>
//                 <Input
//                   style={{
//                     width: '70%',
//                     textAlign: 'right',
//                     fontSize: '16px',
//                     fontWeight: 'bold',
//                   }}
//                   value={formatRupiah(totalSubtotal)}
//                   readOnly
//                 />
//               </Col>
//             </Row>

//             <Row gutter={16} style={{ marginBottom: '10px' }}>
//               <Col span={12}>
//                 <span
//                   style={{
//                     ...labelStyle,
//                     fontSize: '16px',

//                     cursor: 'pointer',
//                   }}
//                   onClick={handleSetAmountPaid}
//                 >
//                   Jumlah Bayar
//                 </span>
//                 <span
//                   style={{
//                     ...labelColonStyle,
//                     fontSize: '16px',
//                   }}
//                 >
//                   :
//                 </span>

//                 <NumericFormat
//                   placeholder="Nilai Pembayaran"
//                   value={amountPaid}
//                   thousandSeparator="."
//                   decimalSeparator=","
//                   decimalScale={2}
//                   allowNegative={false}
//                   onValueChange={(values) => {
//                     const { floatValue } = values
//                     setAmountPaid(floatValue || 0)
//                   }}
//                   customInput={Input}
//                   max={totalSubtotal}
//                   style={{
//                     width: '70%',
//                     textAlign: 'right',
//                     fontSize: '24px',
//                     fontWeight: 'bold',
//                     color: '#007BFF',
//                   }}
//                 />
//               </Col>
//             </Row>

//             <Row gutter={16} style={{ marginBottom: '10px' }}>
//               <Col span={12}>
//                 <span
//                   style={{
//                     ...labelStyle,
//                     fontSize: '16px',
//                   }}
//                 >
//                   Sisa Tagihan
//                 </span>
//                 <span
//                   style={{
//                     ...labelColonStyle,
//                     fontSize: '16px',
//                   }}
//                 >
//                   :
//                 </span>
//                 <Input
//                   value={formatRupiah(piutang)}
//                   style={{
//                     width: '70%',
//                     textAlign: 'right',
//                     fontSize: '16px',
//                   }}
//                 />
//               </Col>
//             </Row>

//             <Row gutter={16} style={{ marginBottom: '10px' }}>
//               <Col span={12}>
//                 <span style={labelStyle}>Pilih Bank</span>
//                 <span style={labelColonStyle}>:</span>
//                 <Select
//                   showSearch // Menampilkan kolom pencarian
//                   // placeholder="Pilih bank"
//                   //bangkok
//                   // value={bankAccountName || selectedBank}
//                   value={selectedBank}
//                   onChange={(value) => setSelectedBank(value)}
//                   style={{ width: '70%' }}
//                   optionFilterProp="children"
//                   filterOption={(input: any, option: any) =>
//                     option?.children
//                       ?.toString()
//                       .toLowerCase()
//                       .includes(input.toLowerCase())
//                   }
//                 >
//                   {akunBanks?.map((e) => (
//                     <Select.Option key={e.id} value={e.name}>
//                       {e.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Col>
//             </Row>
//             <Row>
//               <Button
//                 onClick={handleSave}
//                 type="primary"
//                 style={{ marginTop: '10px', width: '45%' }}
//                 // disabled={limitizeTrans}
//                 disabled={isSaveDisabled} // Tombol dinonaktifkan jika salah satu masih kosong
//               >
//                 Simpan
//               </Button>
//             </Row>
//           </Form>
//         </div>
//       </div>
//     </>
//   )
// }

// export default StockSelectorTable
<></>