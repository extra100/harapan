import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'

import { TypeKontak } from '../../types/TypeKontak'

import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import {
  useAddTypeKontakMutation,
  useGetTypeKontaksQuery,
} from '../../hooks/typeKontakHooks'

const TypeKontakForm: React.FC = () => {
  const [form] = Form.useForm()

  const { data, isLoading } = useGetTypeKontaksQuery()

  const [adding, setAdding] = useState(false)
  const addTypeKontakMutation = useAddTypeKontakMutation()
  const navigate = useNavigate()
  const handleAddTypeKontak = () => {
    form.resetFields()
    setAdding(true)

    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a._id.localeCompare(b._id))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(
          lastRecord._id.replace(/[^0-9]/g, '')
        )
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        form.setFieldsValue({ _id: `Tyko-${paddedId}` })
      } else {
        form.setFieldsValue({ _id: `Tyko-00001` })
      }
    }
  }
  React.useEffect(() => {
    if (!isLoading) {
      handleAddTypeKontak()
    }
  }, [isLoading])

  const saveNewTypeKontak = async () => {
    try {
      const row = (await form.validateFields()) as TypeKontak
      const newTypeKontak: TypeKontak = {
        _id: row._id,
        id_outlet: row.id_outlet,
        type_kontak: row.type_kontak,
      }

      await addTypeKontakMutation.mutateAsync(newTypeKontak)
      setAdding(false)

      console.log()
      navigate('/satuan')
    } catch (errInfo) {}
  }
  return (
    <Card
      style={{
        marginTop: '160px',
        width: '600px',
        marginLeft: '400px',
        position: 'relative',
      }}
    >
      <Form form={form} component={false}>
        <h2
          style={{
            position: 'absolute',
            top: -10,
            left: -60,
            transform: 'rotate(-20deg)',
            marginBottom: '40px',
            fontSize: 30,
            color: '',
          }}
        >
          Tambah TypeKontak
        </h2>

        <Form.Item
          name="type_kontak"
          label="Nama TypeKontak"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the satuan!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="_id"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the satuan!',
            },
          ]}
          style={{ position: 'absolute', top: 0, right: -100 }}
        >
          <Input
            disabled
            style={{ border: 'none', backgroundColor: 'transparent' }}
          />
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewTypeKontak}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/satuan')
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default TypeKontakForm
