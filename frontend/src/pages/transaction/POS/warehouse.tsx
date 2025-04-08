// import { Select } from 'antd'
// import React, { useContext, useState } from 'react'
// import { useAddTransactionMutation } from '../../../hooks/transactionHooks'
// import { useIdWarehouse } from '../../api/namaWarehouse'
// import UserContext from '../../../contexts/UserContext'

// const Warehouse = () => {
//   const addPosMutation = useAddTransactionMutation()

//   const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
//     null
//   )
//   const userContext = useContext(UserContext)
//   const { user } = userContext || {}
//   let idOutletLoggedIn = ''
//   if (user) {
//     idOutletLoggedIn = user.id_outlet
//   }

//   const handleSave = () => {
//     const invoiceData = {
//       trans_date: '2024-07-31',
//       due_date: '2024-07-31',
//       contact_id: 4323,
//       contact_shipping_address_id: null,
//       sales_id: null,
//       status_id: 1,
//       include_tax: 0,
//       term_id: 1,
//       ref_number: 'INV/99999',
//       memo: '',
//       attachment: [],
//       items: [
//         {
//           finance_account_id: 3,
//           tax_id: null,
//           desc: '',
//           qty: 1,
//           price: 2,
//           amount: 2,
//           price_after_tax: 2,
//           amount_after_tax: 2,
//           tax_manual: 0,
//           discount_percent: 0,
//           unit_id: 1,
//         },
//       ],
//       witholdings: [
//         {
//           witholding_account_id: 1,
//           witholding_amount: 0,
//           witholding_percent: 0,
//         },
//       ],
//       warehouse_id: selectedWarehouseId,
//       additional_discount_percent: 0,
//       additional_discount_amount: 0,
//       message: '',
//       tags: [7],

//       shipping_cost: 0,
//       shipping_date: null,
//       shipping_comp_id: null,
//       shipping_tracking: null,
//       delivery_ids: null,

//       witholding_percent: 0,
//       witholding_amount: 0,
//       witholding_account_id: 1,
//     }
//     addPosMutation.mutate(invoiceData as any)
//   }

//   return (
//     <div className="my-select-container">
//       <Select
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option?.children
//             ? option.children
//                 .toString()
//                 .toLowerCase()
//                 .includes(input.toLowerCase())
//             : false
//         }
//         onChange={(value) => setSelectedWarehouseId(Number(value))}
//         defaultValue={user?.id_outlet}
//       >
//         {idWarehouse?.map((outlet) => (
//           <Select.Option key={outlet.id} value={outlet.id}>
//             {outlet.name}
//           </Select.Option>
//         ))}
//       </Select>
//       <button onClick={handleSave}>Save</button>
//     </div>
//   )
// }

// export default Warehouse
<>
</>