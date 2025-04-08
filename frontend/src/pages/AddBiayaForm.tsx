import React, { useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { useAddBiaya } from '../hooks/biayaHooks'

const { Option } = Select

const AddBiayaForm = () => {
  const [form] = Form.useForm()
  const { mutateAsync } = useAddBiaya() // Hook untuk menambahkan pelanggan
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await mutateAsync(values) // Kirim data menggunakan mutation
      message.success('Pelanggan berhasil ditambahkan!')
      form.resetFields() // Reset form setelah berhasil
    } catch (error) {
      message.error('Terjadi kesalahan saat menambahkan pelanggan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h2>Tambah Biaya</h2>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          group_id: 0, // Nilai default untuk group_id
        }}
      >
        <Form.Item
          name="name"
          label="Nama"
          rules={[{ required: true, message: 'Nama pelanggan harus diisi!' }]}
        >
          <Input placeholder="Masukkan nama pelanggan" />
        </Form.Item>

        <Form.Item
          name="kategori"
          label="Kategori"
          rules={[{ required: true, message: 'Nomor telepon harus diisi!' }]}
        >
          <Input placeholder="Masukkan nomor telepon" />
        </Form.Item>      

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Tambah Akun Biaya
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddBiayaForm
