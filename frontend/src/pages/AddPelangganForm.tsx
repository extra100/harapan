import React, { useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAddPelanggan } from '../hooks/pelangganHooks'
import { useGetTypeKontaksQuery } from '../hooks/typeKontakHooks'

const { Option } = Select

const AddPelangganForm = () => {
  const [form] = Form.useForm()
  const { mutateAsync } = useAddPelanggan()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { data: typeKontak } = useGetTypeKontaksQuery()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await mutateAsync(values)
      message.success('Pelanggan berhasil ditambahkan!')
      form.resetFields()
      navigate('/tabelpelanggans') // ✅ Navigasi ke halaman tabel pelanggan
    } catch (error) {
      message.error('Terjadi kesalahan saat menambahkan pelanggan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h2>Tambah Pelanggan</h2>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ group_id: 0 }}
      >
        <Form.Item
          name="outlet_name"
          label="Nama Toko"
          rules={[{ required: true, message: 'Nama Outlet harus dipilih!' }]}
        >
          <Select placeholder="Pilih Nama Outlet">
            <Option value="HARAPAN">HARAPAN</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Nama"
          rules={[{ required: true, message: 'Nama pelanggan harus diisi!' }]}
        >
          <Input placeholder="Masukkan nama pelanggan" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Nomor Telepon"
          rules={[{ required: true, message: 'Nomor telepon harus diisi!' }]}
        >
          <Input placeholder="Masukkan nomor telepon" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Alamat"
          rules={[{ required: true, message: 'Alamat harus diisi!' }]}
        >
          <Input placeholder="Masukkan alamat pelanggan" />
        </Form.Item>

        <Form.Item
          name="id_outlet"
          label="ID Outlet"
          rules={[{ required: true, message: 'ID Outlet harus dipilih!' }]}
        >
          <Select placeholder="Pilih ID Outlet">
            <Option value={123}>123</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="id_kontak"
          label="Jenis Kontak"
          rules={[{ required: true, message: 'Jenis Kontak harus dipilih!' }]}
        >
         <Select
  placeholder="Pilih Jenis Kontak"
  loading={!Array.isArray(typeKontak)}
  allowClear
>
  {Array.isArray(typeKontak) &&
    typeKontak.map((item: any) => (
      <Option key={item._id} value={item._id}>
        {item.type_kontak}
      </Option>
    ))}
</Select>

        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Menyimpan...' : 'Tambah Pelanggan'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddPelangganForm
