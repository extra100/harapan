import React, { useState, useEffect, useContext } from 'react'
import { Button, Col, DatePicker, Table, Tag } from 'antd'

import {
  useGetTransaksisQuery,
  useGetTransaksisQuerymu,
} from '../hooks/transactionHooks'
// import { useIdInvoice } from './api/takeSingleInvoice'
import UserContext from '../contexts/UserContext'
import { useGetContactsQuery } from '../hooks/contactHooks'
import { useNavigate } from 'react-router-dom'

const ListVoid: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )
  const { data: contacts } = useGetContactsQuery()

  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(user.id_outlet)
    }
  }, [user])

  const { data } = useGetTransaksisQuery()
  const [selectedRefNumber, setSelectedRefNumber] = useState<string | null>(
    null
  )
  // const { getIdAtInvoice } = useIdInvoice(selectedRefNumber || '')

  const handleRefNumberClick = (ref_number: string) => {
    setSelectedRefNumber(ref_number)
  }

  const getContactName = (contactId: string) => {
    const contact = contacts?.find((c: any) => c.id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  const {
    data: transaksi,
    isLoading,
    error,
  } = useGetTransaksisQuerymu(selectedWarehouseId, startDate, endDate)
  console.log({ transaksi })
  const filteredData = transaksi
    ?.filter(
      (transaction) =>
        transaction.warehouse_id === Number(user?.id_outlet) &&
        transaction.reason_id === 'void'
    )
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  console.log({ filteredData })

  const formatDateForBackend = (dateString: string) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }
  const handleDateChange = (date: any, dateString: string) => {
    const formattedDate = formatDateForBackend(dateString) // Format tanggal
    setStartDate(formattedDate) // Set tanggal yang sudah diformat
    setEndDate(formattedDate) // Set tanggal yang sudah diformat
  }
  const handleDateChangeSampai = (date: any, dateString: string) => {
    const formattedDate = formatDateForBackend(dateString) // Format tanggal

    setEndDate(formattedDate) // Set tanggal yang sudah diformat
  }
  console.log({ data })
  const [activeButton, setActiveButton] = useState('')
  const navigate = useNavigate()

  const handleButtonClick = (value: any) => {
    setActiveButton(value)

    if (value === '1') {
      navigate('/listkledo')
    } else if (value === '2') {
      navigate('/listvoid')
    } else if (value === '3') {
      navigate('/listreturn')
    }
  }
  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'ref_number',
      key: 'ref_number',
      render: (text: any, record: any) => (
        <a
          href={`/detailkledo/${record.ref_number}`}
          onClick={() => handleRefNumberClick(record.ref_number)}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Tanggal',
      dataIndex: 'trans_date',
      key: 'trans_date',
    },

    {
      title: 'Pelanggan',
      dataIndex: ['contacts', 0, 'id'],
      key: 'contact_name',
      render: (contactId: string) => getContactName(contactId),
    },
    {
      title: 'Status',
      dataIndex: 'status_id',
      key: 'status_id',
      render: (status_id: number) => {
        let color = ''
        let text = ''

        switch (status_id) {
          case 1:
            color = 'red'
            text = 'Belum Dibayar'
            break
          case 2:
            color = 'orange'
            text = 'Dibayar Sebagian'
            break
          case 3:
            color = 'green'
            text = 'Lunas'
            break
          default:
            color = 'gray'
            text = 'Unknown Status'
        }

        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: 'Terbayar',
      dataIndex: 'down_payment',
      key: 'down_payment',
    },
    {
      title: 'Sisa Tagihan',
      dataIndex: 'due',
      key: 'due',
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
    },
  ]

  return (
    <>
      <h1>DAFTAR VOID</h1>

      <div id="btn-filter-status-container" style={{ display: 'inline-flex' }}>
        <Col>
          <DatePicker
            placeholder="Dari Tanggal"
            format="DD-MM-YYYY"
            onChange={(date, dateString) => handleDateChange(date, dateString as any)} // Panggil fungsi handleDateChange
          />
        </Col>
        <Col>
          <DatePicker
            placeholder="Sampai Tanggal"
            format="DD-MM-YYYY"
            onChange={(date, dateString) =>
              handleDateChangeSampai(date, dateString as any)
            } // Panggil fungsi handleDateChange
          />
        </Col>
        <Button
          id="btn-filter-1"
          value="1"
          type="default"
          className={activeButton === '1' ? 'btn-default-selected' : ''}
          style={{ borderRadius: '0px' }}
          onClick={() => handleButtonClick('1')}
        >
          <span>Semua</span>
        </Button>
      </div>
      <Button
        id="btn-filter-2"
        value="2"
        type="default"
        className={activeButton === '2' ? 'btn-default-selected' : ''}
        style={{ borderRadius: '0px' }}
        onClick={() => handleButtonClick('2')}
      >
        <span>Void</span>
      </Button>
      <Button
        id="btn-filter-3"
        value="3"
        type="default"
        className={activeButton === '3' ? 'btn-default-selected' : ''}
        style={{ borderRadius: '0px' }}
        onClick={() => handleButtonClick('3')}
      >
        <span>Return</span>
      </Button>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
    </>
  )
}

export default ListVoid
