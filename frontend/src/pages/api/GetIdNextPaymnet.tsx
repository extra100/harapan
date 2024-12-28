import React, { useContext, useEffect, useState } from 'react'
import {
  Table,
  DatePicker,
  Row,
  Col,
  Typography,
  Select,
  Modal,
  Button,
} from 'antd'
import moment from 'moment'
import { TakeInvoicesFromKledoBasedOnDate } from '../takeInvoiceFromKledoBasedOnDate'
import { formatDate } from './FormatDate'
import {
  updateDenganMemoDariKledo,
  useGetFilteredTransaksisQuery,
} from '../../hooks/transactionHooks'
import {
  updateDenganIdUnikDariKledo,
  useGetTransactionByIdQuery,
} from '../../hooks/transactionHooks'
import { useNavigate, useParams } from 'react-router-dom'
const { Title } = Typography
const { Option } = Select
import dayjs from 'dayjs'
import UserContext from '../../contexts/UserContext'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useGetBarangsQuery } from '../../hooks/barangHooks'
import { TakePembayaranBankTrans } from '../TakePembayaranBankTrans'

const GetIdNextPaymnet: React.FC = () => {
  const navigate = useNavigate()
  const { ref_number } = useParams<{ ref_number?: string }>()
  const { refNumber } = useParams<{ refNumber: string }>() // Mengambil parameter `memo` dari URL

  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const [transDateFrom, setTransDateFrom] = useState<string | null>(
    dayjs().format('YYYY-MM-DD')
  )
  const [transDateTo, setTransDateTo] = useState<string | null>(
    dayjs().format('YYYY-MM-DD')
  )
  const [search, setSearch] = useState<any | null>(refNumber)

  const handleDateFromChange = (date: dayjs.Dayjs | null) => {
    setTransDateFrom(date ? date.format('YYYY-MM-DD') : null)
  }

  const handleDateToChange = (date: dayjs.Dayjs | null) => {
    setTransDateTo(date ? date.format('YYYY-MM-DD') : null)
  }
  const { data: gudangdb } = useGetWarehousesQuery()
  const { data: barangs } = useGetBarangsQuery()
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(
    idOutletLoggedIn
  )
  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value)
  }
  useEffect(() => {
    const initialWarehouse = gudangdb?.find(
      (gudang: any) => gudang.id === idOutletLoggedIn
    )
    if (initialWarehouse) {
      setSelectedWarehouse(initialWarehouse.name)
    }
  }, [gudangdb, idOutletLoggedIn])

  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedData, setSelectedData] = useState<any | null>(null)
  const { data: allTransactions } = useGetTransactionByIdQuery(
    refNumber as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.memo === search
  )
  const tetapkanIdYangii = getPosDetail?.id || 0
  console.log({ tetapkanIdYangii })
  const idBank = getPosDetail?.witholdings?.[0]?.witholding_account_id
  // const idUnique = selectedData?.id || 0

  const handleStatusChange = (value: number) => {
    setSelectedStatus(value)
  }
  const { getBankTrans } = TakePembayaranBankTrans(refNumber as any) || {
    getBankTrans: [],
  }
  console.log({ getBankTrans })
  const handleRowClick = (record: any) => {
    const selectedTransaction = getBankTrans?.find(
      (transaksi: any) => transaksi.id === record.id
    )

    if (!selectedTransaction) {
      console.error('Transaksi tidak ditemukan!')
      return
    }

    setSelectedData(selectedTransaction)
    setIsModalVisible(true)
  }
  //

  const name = getPosDetail?.witholdings?.[0]?.name
  const totalAwal = getPosDetail?.amount
  const whPersen = getPosDetail?.witholdings?.[0]?.witholding_percent
  const whAmount = getPosDetail?.witholdings?.[0]?.witholding_amount
  const idMonggo =
    getPosDetail?.witholdings?.[getPosDetail?.witholdings.length - 1]?._id

  console.log({ idMonggo })
  const nilai = getPosDetail?.witholdings?.[0]
  const firstPayment =
    getBankTrans && getBankTrans.length > 0 ? getBankTrans[0] : null

  // Menampilkan lastPayment
  console.log('Last Payment:', firstPayment)
  const amount = firstPayment?.amount || 0
  const statusId = firstPayment?.status_id || 0
  const tanggalBayar = firstPayment?.trans_date || 0
  const idUnique = firstPayment?.id || 0

  console.log({ idUnique })

  const updateHanyaId = updateDenganMemoDariKledo()

  const memo =
    selectedData?.memo ||
    allTransactions?.find(
      (transaction: any) => transaction.id === selectedData?.id
    )?.memo
  //
  const updateInvoiceId = async () => {
    if (!selectedData) {
      console.error('Tidak ada data yang dipilih untuk diperbarui.')
      return
    }

    const invoiceId = tetapkanIdYangii
    const jumlahBayar = selectedData.amount
    console.log({ jumlahBayar })
    const due = selectedData.due
    console.log({ jumlahBayar })

    const idPadaItems =
      selectedData.items?.map((item: any) => ({
        id: item.id,
        finance_account_id: item.finance_account_id,
        price: item.price,
        amount: item.amount,
        discount_amount: item.discount_amount,
      })) || []

    const idPadaWitholdings =
      getPosDetail?.witholdings?.map((item: any) => ({
        down_payment: jumlahBayar, // Contoh nilai down_payment
        status: 0,
        id: idUnique,
        witholding_account_id: idBank,
        name: name,
        trans_date: tanggalBayar,
        witholding_amount: whAmount,
        witholding_percent: whPersen,
        _id: idMonggo,
      })) || []

    try {
      const response = await updateHanyaId.mutateAsync({
        memo,
        id: invoiceId as any,
        items: idPadaItems,
        witholdings: idPadaWitholdings,
        amount: totalAwal,
        due: due,
      })

      console.log('Invoice ID dan items berhasil diperbarui:', response)
    } catch (error) {
      console.error('Gagal memperbarui Invoice ID dan items:', error)
    }
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setSelectedData(null)
  }

  const columns = [
    {
      title: 'No',
      key: 'no',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'id Unique',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
    },
    {
      title: 'Inv',
      dataIndex: 'memo',
      key: 'memo',
      ellipsis: true,
    },
    {
      title: 'Tanggal Transaksi',
      dataIndex: 'trans_date',
      key: 'trans_date',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Jml. bayar',
      dataIndex: 'amount',
      key: 'amount',
      ellipsis: true,
    },
    // {
    //   title: 'Gudang',
    //   dataIndex: 'warehouse_id',
    //   key: 'warehouse_name',
    //   ellipsis: true,
    //   render: (warehouse_id: string) => {
    //     const warehouse = gudangdb?.find(
    //       (gudang: { id: any; name: any }) => gudang.id === warehouse_id
    //     )
    //     return warehouse ? warehouse.name : 'Unknown'
    //   },
    // },
  ]

  const itemsColumns = [
    {
      title: 'Product',
      dataIndex: 'finance_account_id',
      key: 'product_name',
      ellipsis: true,
      render: (finance_account_id: string) => {
        const barang = barangs?.find(
          (gudang: { id: any; name: any }) => gudang.id === finance_account_id
        )
        return barang ? barang.name : 'Unknown'
      },
    },

    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
  ]

  return (
    <div style={{ width: '1400px', margin: '0 auto', padding: '20px' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <Title level={4}></Title>
        </Col>
        <Col span={6}>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={handleDateFromChange as any}
            placeholder="Dari Tanggal"
            style={{ width: '100%' }}
            defaultValue={dayjs(transDateFrom, 'YYYY-MM-DD')}
          />
        </Col>
        <Col span={6}>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={handleDateToChange as any}
            placeholder="Sampai Tanggal"
            style={{ width: '100%' }}
            defaultValue={dayjs(transDateTo, 'YYYY-MM-DD')}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Pilih Gudang"
            onChange={handleWarehouseChange}
            value={selectedWarehouse}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            disabled={!user?.isAdmin} // Nonaktifkan Select jika user bukan admin
          >
            {gudangdb &&
              gudangdb.map((gudang: { id: any; name: any }) => (
                <Select.Option key={gudang.id} value={gudang.id}>
                  {gudang.name}
                </Select.Option>
              ))}
          </Select>
        </Col>
      </Row>
      {/* <Table
        dataSource={
          getBankTrans.length > 0 ? [getBankTrans[getBankTrans.length - 1]] : []
        }
        columns={columns}
        rowKey="id"
        pagination={false} // Tidak perlu pagination untuk hanya satu baris
        style={{ marginTop: '20px' }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      /> */}
      <Table
        dataSource={getBankTrans.length > 0 ? [getBankTrans[0]] : []}
        columns={columns}
        rowKey="id"
        pagination={false} // Tidak perlu pagination untuk hanya satu baris
        style={{ marginTop: '20px' }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      <Modal
        title="Detail Data"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={
          <Button
            onClick={() => {
              updateInvoiceId()
              navigate(`/detailkledo/${memo}`)
            }}
          >
            Sinkronkan
          </Button>
        }
        width={700}
      >
        {selectedData && (
          <div>
            <p>
              <strong>ID UNIK:</strong> {selectedData.id}
            </p>

            <p>
              <strong>No INV:</strong> {selectedData.ref_number}
            </p>

            <p>
              <text>Warehouse Name:</text>{' '}
              {gudangdb?.find(
                (gudang: { id: any; name: string }) =>
                  gudang.id === selectedData.warehouse_id
              )?.name || 'Unknown'}
            </p>

            <p>
              <strong>Pelanggan:</strong> {selectedData.name}
            </p>

            <p>
              <strong>Tgl Trans:</strong> {formatDate(selectedData.trans_date)}
            </p>
            <Table
              dataSource={getBankTrans}
              columns={itemsColumns}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default GetIdNextPaymnet
