import React, { useEffect, useState } from 'react'
import { Table, Button } from 'antd'
import { useAddBarang } from '../../hooks/barangTetukHooks'
import { useIdNamaddBarang } from './namaBarangTetukApi'

const BarangTetuk = () => {
  const { idDataddBarang } = useIdNamaddBarang()
  console.log({ idDataddBarang })
  const { mutate: addBarang } = useAddBarang()

  const handleSave = () => {
    console.log('Save clicked')

    const dataToSave = idDataddBarang.map((barang: any) => ({
      ...barang,
      price: barang.price || 0,
    }))

    addBarang(dataToSave as any)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nama Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Hpp',
      dataIndex: 'hpp',
      key: 'hpp',
    },
    {
      title: 'Kode SKU',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Id Satuan',
      dataIndex: ['unit', 'id'],
      key: 'unit.id',
    },
    {
      title: 'Nama Satuan',
      dataIndex: ['unit', 'name'],
      key: 'unit.name',
    },
    {
      title: 'Kategori Barang',
      dataIndex: 'pos_product_category_id',
      key: 'pos_product_category_id',
    },
  ]

  return (
    <div>
      <Table
        dataSource={idDataddBarang} // ensure this is an array of data
        columns={columns}
        rowKey="id"
      />
      <Button type="primary" onClick={handleSave}>
        Save
      </Button>
    </div>
  )
}

export default BarangTetuk
