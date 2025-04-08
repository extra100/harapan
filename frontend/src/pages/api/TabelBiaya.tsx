import React, { useState } from 'react'
import { Table, Input, Select, Modal, Form, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  useGetBiayasQuery,
  useUpdateBiayaMutation,
} from '../../hooks/biayaHooks'

const { Option } = Select

const TabelBiaya: React.FC = () => {
  const { data: biayas } = useGetBiayasQuery()
  const updateBiaya = useUpdateBiayaMutation()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterById, setFilterById] = useState<string | null>(null)
  const [editingBiaya, setEditingBiaya] = useState<any | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleFilterById = (value: any) => {
    setFilterById(value as any)
  }

  const handleEditClick = (record: any) => {
    setEditingBiaya(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields()
      await updateBiaya.mutateAsync({ ...editingBiaya, ...values })
      setIsModalVisible(false)
      setEditingBiaya(null)
    } catch (error) {
      console.error('Failed to save changes:', error)
    }
  }

  const filteredBiayas = (biayas || []).filter((biaya) => {
    const matchesName = biaya.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesId = filterById ? biaya._id.toString() === filterById : true
    return matchesName && matchesId
  })

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Nama Biaya',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
    },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>Filter Jenis Biaya</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          allowClear
          showSearch
          placeholder="Pilih biaya"
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
          {biayas &&
            biayas.map((biaya: any) => (
              <Option
                key={biaya._id}
                value={biaya._id.toString()}
                label={`${biaya._id} - ${biaya.name}`}
              >
                {biaya._id} - {biaya.name}
              </Option>
            ))}
        </Select>
        <Button type="primary" onClick={() => navigate('/addbiaya')}>
          TAMBAH JENIS BIAYA
        </Button>
      </div>
      <Table
        dataSource={filteredBiayas}
        columns={columns}
        rowKey={(record) => record._id}
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
        title="Edit Biaya"
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
            label="Nama Biaya"
            rules={[{ required: true, message: 'Nama biaya harus diisi' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="kategori"
            label="Kategori"
            rules={[{ required: true, message: 'Kategori biaya harus diisi' }]}
          >
            <Input />
          </Form.Item>
        
        </Form>
      </Modal>
    </div>
  )
}

export default TabelBiaya
