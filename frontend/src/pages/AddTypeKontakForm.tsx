import React, { useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { useAddTypeKontakMutation } from '../hooks/typeKontakHooks'

const { Option } = Select

const AddTypeKontakForm = () => {
  const [form] = Form.useForm()
  const { mutateAsync } = useAddTypeKontakMutation() // Hook untuk menambahkan pelanggan
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await mutateAsync(values) // Kirim data menggunakan mutation
      message.success('TypeKontak berhasil ditambahkan!')
      form.resetFields() // Reset form setelah berhasil
    } catch (error) {
      message.error('Terjadi kesalahan saat menambahkan pelanggan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h2>Tambah TypeKontak</h2>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          group_id: 0, // Nilai default untuk group_id
        }}
      >
    
         

       

        <Form.Item
          name="type_kontak"
          label="Jenis Kontak"
          rules={[{ required: true, message: 'Jenis Kontak harus diisi!' }]}
        >
          <Input placeholder="Masukkan Jenis Kontak" />
        </Form.Item>

      
        <Form.Item
          name="id_outlet"
          label="ID Outlet"
          rules={[{ required: true, message: "ID Outlet harus dipilih!" }]}
        >
          <Select
            placeholder="Pilih ID Outlet"
            value={form.getFieldValue("id_outlet")} // Pastikan nilai selalu sinkron
            onChange={(value) => form.setFieldsValue({ id_outlet: value })} // Update nilai form
          >
            <Option value={123}>123</Option>
          </Select>
        </Form.Item>
       


       

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Tambah TypeKontak
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddTypeKontakForm
