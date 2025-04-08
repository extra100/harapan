import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import { useStokBarang } from './StokBarang'
import { useDataBarang } from './NamaBarang'

import { useIdNamaTag } from './NamaTag'
import { useIdContact } from './NamaContact'

const { Option } = Select

const StockSelector = () => {
const { dataStokBarang, fetchStokBarang } = useStokBarang()
console.log({ dataStokBarang })
const { idaDataBarang } = useDataBarang()
const { idWarehouse } = useIdWarehouse()
const { idDataTag } = useIdNamaTag()
const { idContact } = useIdContact()

const [selectedProductId, setSelectedProductId] = useState<string | null>(
null
)
const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
null
)
const [selectedTag, setSelectedTag] = useState<number | null>(null)
const [selectedContact, setSelectedContact] = useState<number | null>(null)

useEffect(() => {
if (selectedProductId && selectedWarehouseId !== null) {
fetchStokBarang(selectedProductId, selectedWarehouseId)
}
}, [selectedProductId, selectedWarehouseId])

const handleProductChange = (value: string) => {
setSelectedProductId(value)
}

const handleWarehouseChange = (value: number) => {
setSelectedWarehouseId(value)
}
const handleTagChange = (value: number) => {
setSelectedTag(value)
}
const handleContactChange = (value: number) => {
setSelectedContact(value)
}

return (

<div>
<Select
showSearch
style={{ width: '320px' }}
optionFilterProp="children"
filterOption={(input, option) =>
option?.children?.toString()
? option.children
.toString()
.toLowerCase()
.includes(input.toLowerCase())
: false
}
onChange={handleProductChange} >
{idaDataBarang?.map((product) => (
<Select.Option key={product.id} value={product.id}>
{product.name}
</Select.Option>
))}
</Select>
<Select
showSearch
style={{ width: '320px' }}
optionFilterProp="children"
filterOption={(input, option) =>
option?.children?.toString()
? option.children
.toString()
.toLowerCase()
.includes(input.toLowerCase())
: false
}
onChange={handleWarehouseChange} >
{idWarehouse?.map((product) => (
<Select.Option key={product.id} value={product.id}>
{product.name}
</Select.Option>
))}
</Select>
<Select
showSearch
style={{ width: '320px' }}
optionFilterProp="children"
filterOption={(input, option) =>
option?.children?.toString()
? option.children
.toString()
.toLowerCase()
.includes(input.toLowerCase())
: false
}
onChange={handleTagChange} >
{idDataTag?.map((product) => (
<Select.Option key={product.id} value={product.id}>
{product.name}
</Select.Option>
))}
</Select>
<br />
<br />

      <Select
        showSearch
        style={{ width: '320px' }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children?.toString()
            ? option.children
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            : false
        }
        onChange={handleContactChange}
      >
        {idContact?.map((product) => (
          <Select.Option key={product.id} value={product.id}>
            {product.name}
          </Select.Option>
        ))}
      </Select>

      {dataStokBarang && (
        <div>
          <strong>Quantity:</strong> {dataStokBarang.qty}
        </div>
      )}
    </div>

)
}

export default StockSelector
