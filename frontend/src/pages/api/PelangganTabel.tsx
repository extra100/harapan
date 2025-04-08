  import React, { useContext, useState } from 'react'
  import { Table, Input, Select, Modal, Form, Button } from 'antd'
  import { useNavigate } from 'react-router-dom'
  import { useUpdateBarangMutation } from '../../hooks/barangHooks'
  import {
    useGetPelanggansQueryDb,
    useUpdatePelangganMutation,
  } from '../../hooks/pelangganHooks'
  import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
  import UserContext from '../../contexts/UserContext'
  import { useGetTypeKontaksQuery } from '../../hooks/typeKontakHooks'
  import { useUpdateContactMutation } from '../../hooks/contactHooks'

  const { Option } = Select

  const PelangganTable: React.FC = () => {
    const { data: gudangs } = useGetWarehousesQuery()
    const userContext = useContext(UserContext)
    const { user } = userContext || {}
    let idOutletLoggedIn = ''
    let isAdmin = false

    if (user) {
      idOutletLoggedIn = user.id_outlet
      isAdmin = user.isAdmin
    }

    const outletName =
      (Array.isArray(gudangs) &&
        gudangs.find((user) => String(user.id) === idOutletLoggedIn)?.name) ||
      'Outlet Tidak Diketahui'
    console.log({ outletName })
    const { data: pelanggans } = useGetPelanggansQueryDb()
    const [filterById, setFilterById] = useState<string | null>(null)
    const filteredPelanggan = filterById
    ? pelanggans?.filter((pelanggan) => pelanggan._id === filterById)
    : pelanggans
    const updatePelanggan = useUpdateContactMutation()
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('')
    const [editingPelanggan, setEditingPelanggan] = useState<any | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()

    const handleFilterById = (value: number) => {
      setFilterById(value as any)
    }

    const handleEditClick = (record: any) => {
      setEditingPelanggan(record)
      form.setFieldsValue(record)
      setIsModalVisible(true)
    }

    const handleSaveChanges = async () => {
      try {
        const values = await form.validateFields()
        await updatePelanggan.mutateAsync({ ...editingPelanggan, ...values })
        setIsModalVisible(false)
        setEditingPelanggan(null)
      } catch (error) {
        console.error('Failed to save changes:', error)
      }
    }
    const { data: typeKontak } = useGetTypeKontaksQuery()
    
    

    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: 'Nama',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Jenis Kontak',
        dataIndex: 'id_kontak',
        key: 'id_kontak',
        render: (id_kontak: string) => {
          const type = typeKontak?.find((item) => item._id === id_kontak)
          return type ? type.type_kontak : '-'
        }
      },      
      {
        title: 'No. Tlpn',
        dataIndex: 'phone',
        key: 'phone',
      },
    
    ]

    return (
      <div style={{ padding: 20 }}>
        <h2>Daftar Pelanggan</h2>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Select
            allowClear
            showSearch
            placeholder="Pilih Nama pelanggan"
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
            {pelanggans &&
              pelanggans.map((pelanggan: any) => (
                <Option
                  key={pelanggan._id}
                  value={pelanggan._id.toString()}
                  label={`${pelanggan._id} - ${pelanggan.name}`}
                >
                  {pelanggan.name}
                </Option>
              ))}
          </Select>
          <Button type="primary" onClick={() => navigate('/addpelanggan')}>
            TAMBAH PELANGGAN
          </Button>
        </div>
        <Table
          dataSource={filteredPelanggan}
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
    title="Edit Pelanggan"
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
        name="_id"
        label="ID"
        rules={[{ required: true, message: 'ID harus diisi' }]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="name"
        label="Nama Pelanggan"
        rules={[{ required: true, message: 'Nama pelanggan harus diisi' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="id_outlet"
        label="ID Group"
        rules={[{ required: true, message: 'ID group harus diisi' }]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="address"
        label="Alamat"
        rules={[{ required: true, message: 'Alamat harus diisi' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Kontak"
        rules={[{ required: true, message: 'Kontak harus diisi' }]}
      >
        <Input />
      </Form.Item>

      {/* 🟢 PINDAHKAN ke sini */}
      <Form.Item
        name="id_kontak"
        label="Jenis Kontak"
        rules={[{ required: true, message: "Jenis Kontak harus dipilih!" }]}
      >
        <Select
          placeholder="Pilih Jenis Kontak"
          loading={!typeKontak}
        >
          {typeKontak?.map((item) => (
            <Select.Option key={item._id} value={item._id}>
              {item.type_kontak}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  </Modal>


      </div>
    )
  }

  export default PelangganTable
