import React, { useContext, useEffect, useState } from 'react'
import { Table, Button, message, Card, Row, Col, Tag } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import UserContext from '../../contexts/UserContext'
import { TakeIdReturPayment } from '../TakeIdReturPayment'
import { BayarTagihanRetur } from './BayarTagihanRetur'
import Title from 'antd/es/typography/Title'
import Text from 'antd/es/typography/Text'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import {
  useGetReturnByIdQuery,
  useGetReturnssQuery,
} from '../../hooks/returnHooks'

const SaveReturDetailSourceKledo: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const { memorandum, selectedDate } = useParams<{
    memorandum: string
    selectedDate: string
  }>()

  const [search, setSearch] = useState<any>({
    memorandum,
    selectedDate,
  })

  const [transDateFrom, setTransDateFrom] = useState<string | null>(
    selectedDate as any
  )
  const [transDateTo, setTransDateTo] = useState<string | null>(
    selectedDate as any
  )

  const { bayarTagihanRetur } = BayarTagihanRetur()

  const { getIdReturPayment } = TakeIdReturPayment(
    transDateFrom,
    transDateTo,
    search
  ) || { getIdReturPayment: [] }
  //   console.log({ getIdReturPayment })

  const firstPayment =
    getIdReturPayment && getIdReturPayment.length > 0
      ? getIdReturPayment[0]
      : null

  const memo = firstPayment?.memo
  const { data, error } = useGetTransactionByIdQuery(memo as any)

  const getPosDetail = data?.find(
    (transaction: any) => transaction.ref_number === memo
  )

  const idBank = getPosDetail?.witholdings?.[0]?.witholding_account_id
  const navigate = useNavigate()

  const handleSave = () => {
    if (!getIdReturPayment || getIdReturPayment.length === 0) {
      message.error('Data pembayaran retur tidak ditemukan.');
      return;
    }
  
    const firstPayment = getIdReturPayment[0];
  
    const dataToSave = {
      amount: firstPayment.due || 0,
      attachment: [],
      bank_account_id: idBank,
      business_tran_id: firstPayment.id || '',
      memo: firstPayment.memo || null,
      trans_date: dayjs().format('YYYY-MM-DD'),
    };
  
    bayarTagihanRetur(dataToSave)
      .then(() => {
        message.success('Data berhasil disimpan!');
        // Navigasi ke halaman detail
        navigate(`/detailkledo/${firstPayment.memo}`);
      })
      .catch((error) => {
        console.error('Error menyimpan data:', error);
        message.error('Gagal menyimpan data.');
      });
  };
  
  const columns = [
    {
      title: 'amount',
      dataIndex: 'due',
      key: 'due',
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo',
      ellipsis: true,
    },
    {
      title: 'trans id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'akun bank',
      dataIndex: 'business_tran_id',
      key: 'business_tran_id',
    },
    {
      title: 'Tanggal',
      dataIndex: 'trans_date',
      key: 'trans_date',
    },
  ]

  return (
    <div style={{ width: '1200px', margin: '0 auto', padding: '20px' }}>
      <Card
        title={
          <Row align="middle" justify="space-between">
            <Title level={5} style={{ fontSize: '20px', marginBottom: 0 }}>
              PEMBAYARAN HUTANG RETUR: {firstPayment?.memo || '-'}
            </Title>
          </Row>
        }
        bordered
      >
        <Row>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text>Pelanggan:</Text>
            </div>
            <Title level={5} style={{ fontSize: '14px', marginBottom: 0 }}>
              {firstPayment?.contact_id || '-'}
            </Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text>NOMOR:</Text>
            </div>
            <Title level={5}>{firstPayment?.memo}</Title>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text>Tgl. Transaksi:</Text>
            </div>
            <Title level={5}>{firstPayment?.trans_date || '-'}</Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text>Tgl. Jatuh Tempo:</Text>
            </div>
            <Title level={5}>{firstPayment?.trans_date || '-'}</Title>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text>Gudang:</Text>
            </div>
            {/* <Title level={5}>{firstPayment.warehouse_id}</Title> */}
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text>Tag:</Text>
            </div>
            {/* <Title level={5}>{firstPayment.tags}</Title> */}
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={getIdReturPayment}
        columns={columns}
        rowKey="id"
        pagination={false}
        style={{ marginTop: '20px' }}
      />
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={handleSave}
            style={{ marginTop: '20px', width: '250px' }}
          >
            BAYAR HUTANG RETUR
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default SaveReturDetailSourceKledo
