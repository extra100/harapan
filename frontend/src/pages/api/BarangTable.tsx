import React, { useState } from 'react'
import { Table, Input, Select, Modal, Form, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  useGetBarangsQuery,
  useUpdateBarangMutation,
} from '../../hooks/barangHooks'

const { Option } = Select

const BarangTable: React.FC = () => {
  const { data: barangs } = useGetBarangsQuery()
  const updateBarang = useUpdateBarangMutation()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterById, setFilterById] = useState<string | null>(null)
  const [editingBarang, setEditingBarang] = useState<any | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleFilterById = (value: number) => {
    setFilterById(value as any)
  }

  const handleEditClick = (record: any) => {
    setEditingBarang(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields()
      await updateBarang.mutateAsync({ ...editingBarang, ...values })
      setIsModalVisible(false)
      setEditingBarang(null)
    } catch (error) {
      console.error('Failed to save changes:', error)
    }
  }

  const filteredBarangs = (barangs || []).filter((barang) => {
    const matchesName = barang.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesId = filterById ? barang.id.toString() === filterById : true
    return matchesName && matchesId
  })

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kode Barang',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'name'],
      key: 'unit',
    },
    {
      title: 'Kategori',
      dataIndex: 'pos_product_category_id',
      key: 'pos_product_category_id',
    },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>Daftar Barang</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          allowClear
          showSearch
          placeholder="Pilih ID barang"
          style={{ width: '70%' }}
          optionFilterProp="label"
          filterOption={(input: any, option: any) =>
            option?.label
              ?.toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          onChange={handleFilterById}
        >
          {barangs &&
            barangs.map((barang: any) => (
              <Option
                key={barang.id}
                value={barang.id.toString()}
                label={`${barang.id} - ${barang.name}`}
              >
                {barang.id} - {barang.name} - {barang.price} - {barang.code}
              </Option>
            ))}
        </Select>
        <Button type="primary" onClick={() => navigate('/tambahbarang')}>
          TAMBAH BARANG
        </Button>
      </div>
      <Table
        dataSource={filteredBarangs}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        onRow={(record) => ({
          onClick: () => handleEditClick(record),
        })}
      />
      <Modal
        title="Edit Barang"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveChanges}>
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nama Barang"
            rules={[{ required: true, message: 'Nama barang harus diisi' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Kode Barang"
            rules={[{ required: true, message: 'Kode barang harus diisi' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Harga"
            rules={[{ required: true, message: 'Harga harus diisi' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="pos_product_category_id"
            label="Kategori"
            rules={[{ required: true, message: 'Kategori harus diisi' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BarangTable
