import React, { useEffect, useRef, useState } from 'react'
import {
  Table,
  Typography,
  Row,
  Col,
  Menu,
  Tag,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Card,
  Dropdown,
  Space,
  Divider,
  message,
  Spin,
  Modal,
} from 'antd'

import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AiOutlinePrinter } from 'react-icons/ai'
import PosPrintKomponent from './PosPrintCok'
import moment from 'moment'
import dayjs from 'dayjs'
import { useFiac } from './Fiac'

import { useReactToPrint } from 'react-to-print'
import Receipt from './printNota'
import ReceiptJalan from './ReceiptJalan'

import { useIdWarehouse } from './namaWarehouse'
import { useGetContactsQuery } from '../../hooks/contactHooks'
import { useGetAkunBanksQueryDb } from '../../hooks/akunBankHooks'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'

import type { Dayjs } from 'dayjs'

import { useIdPemesanan } from './takeSingleIdPemesanan'
import { useGetPpByIdQuery, useUpdatePpMutation } from '../../hooks/ppHooks'
import {
  updateDenganIdUnikDariKledo,
  useGetTransactionByIdQuery,
} from '../../hooks/transactionHooks'
import { useIdInvoice } from './takeSingleInvoice'
import { useIdBasedMemoAndrefNumber } from './takeSingleInvoicesBasedMemo'
import { userefNumberFromKledo } from './UserefNumberFromKledo'

const { Title, Text } = Typography
const { Option } = Select

const IdUnikDariKledo: React.FC = () => {
  const [showButtons, setShowButtons] = useState(false)
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(currentDate)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])
  const { ref_number } = useParams<{ ref_number?: string }>()

  const updateHanyaId = updateDenganIdUnikDariKledo()
  const { getIdFromKledoBasedRefNumberAndMemo } = useIdBasedMemoAndrefNumber(
    ref_number as string
  )
  const { getBasedOnRefNumber } = userefNumberFromKledo(
    ref_number as string
  )
  console.log({getBasedOnRefNumber})
  const justPutId = getIdFromKledoBasedRefNumberAndMemo?.id ?? null

  const updateInvoiceId = async () => {
    if (!ref_number || !invoiceId) return

    try {
      await updateHanyaId.mutateAsync({
        ref_number,
        id: invoiceId, // Pass `invoiceId` as `id`
      })
      console.log('Invoice ID updated successfully')
    } catch (error) {
      console.error('Failed to update Invoice ID:', error)
    }
  }

  const { data: allTransactions } = useGetPpByIdQuery(ref_number as string)
  const { data: contacts } = useGetContactsQuery()
  const { data: akunBanks } = useGetAkunBanksQueryDb()

  const invoiceId = getIdFromKledoBasedRefNumberAndMemo?.id ?? null
  // console.log('ref_number dari database keldo', refNumber)

  const refNumber = getIdFromKledoBasedRefNumberAndMemo
    ? getIdFromKledoBasedRefNumberAndMemo.memo
    : null

  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  //   console.log('semua data dari kledo', getPosDetail)

  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const gudangId = getPosDetail?.warehouses?.[0]?.warehouse_id
  const langka = getPosDetail?.id
  const menujudetailpenjualan = getPosDetail?.ref_number

  const tagName = getPosDetail?.tages?.map((tag: any) => tag.name) || []

  const amount = getPosDetail?.amount ?? 0
  const witholdings = getPosDetail?.witholdings || []
  const items = getPosDetail?.items || []
  const totalDownPayment = witholdings
    .filter((witholding: any) => witholding.status === 0)
    .reduce((sum: number, witholding: any) => {
      return sum + (witholding.down_payment || 0)
    }, 0)

  const due = amount - totalDownPayment
  const totalDiscount = items.reduce((total: number, item: any) => {
    return total + (item.discount_amount || 0)
  }, 0)
  const subTotal = totalDiscount + amount

  const { fiAc } = useFiac()

  const [amountPaid, setAmountPaid] = useState<number | null>(null)
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

  const [contactName, setContactName] = useState<string>('Unknown Contact')

  useEffect(() => {
    if (allTransactions && contacts) {
      const contactId = getPosDetail?.contacts?.[0]?.id
      const contact = contacts.find((c: any) => c.id === contactId)
      if (contact) {
        setContactName(contact.name)
      }
    }
  }, [allTransactions, contacts])
  const { idWarehouse } = useIdWarehouse()

  const [selectedBank, setSelectedBank] = useState<any | null>(null)

  const today = dayjs().format('DD-MM-YYYY')

  const [loadingSpinner, setLoadingSpinner] = useState(false) //
  // const [loading, setLoading] = useState(false) // State to manage loading

  const handleButtonClick = () => {
    setLoading(true)
    setTimeout(() => {
      updateInvoiceId()

      navigate(`/detailkledo/${menujudetailpenjualan}`)
    }, 100)
  }

  const printNota = useRef<HTMLDivElement>(null)

  const printNotaHandler = useReactToPrint({
    content: () => printNota.current,
  })

  const printSuratJalan = useRef<HTMLDivElement>(null)

  const printSuratJalanHandler = useReactToPrint({
    content: () => printSuratJalan.current,
  })

  const akunBank = useGetAkunBanksQueryDb()

  const tele = akunBank?.data

  const matchingTele = tele?.find((item) => {
    const nameParts = item.name.split('_')
    return nameParts[1] === gudangName
  })

  const [bankAccountName, setBankAccountName] = useState<string | null>(null)

  const [bankAccountId, setBankAccountId] = useState<string | null>(null)

  const [warehouseName, setWarehouseName] = useState<string | null>(null)
  const { data: gudangdb } = useGetWarehousesQuery()

  const getWarehouseName = () => {
    if (!gudangdb || !gudangId) return null

    const selectedWarehouse = gudangdb.find(
      (warehouse: { id: number; name: string }) =>
        warehouse.id === Number(gudangId)
    )
    return selectedWarehouse ? selectedWarehouse.name : null
  }

  useEffect(() => {
    const name = getWarehouseName()
    setWarehouseName(name)
    if (name) {
    }
  }, [gudangdb, gudangId])
  const getBankAccountName = () => {
    if (!akunBanks || !warehouseName) return null

    const matchingBankAccount = akunBanks.find((bank: { name: string }) => {
      const parts = bank.name.split('_')
      return parts[1] === warehouseName
    })
    return matchingBankAccount ? matchingBankAccount.name : null
  }
  useEffect(() => {
    const name = getBankAccountName()
    setBankAccountName(name)
  }, [warehouseName, akunBanks])
  const getBankAccountId = () => {
    if (!akunBanks || !warehouseName) return null

    const matchingBankAccount = akunBanks.find(
      (bank: { name: any; id: any }) => {
        const parts = bank.name.split('_')
        return parts[1] === warehouseName
      }
    )
    return matchingBankAccount ? matchingBankAccount.id : null
  }
  const matchingName = matchingTele?.name
  useEffect(() => {
    if (bankAccountName) {
      setSelectedBank(bankAccountName)
    }
  }, [bankAccountName])
  useEffect(() => {
    const id = getBankAccountId()
    setBankAccountId(id as any)
  }, [warehouseName, akunBanks])

  const [refNumbers, setRefNumber] = useState('')
  // const { voidInvoice, voidLoading, voidError, voidSuccess } = useVoidInvoice(
  //   refNumber as any
  // )
  // const { unvoidInvoice, unvoidLoading, unvoidError, unvoidSuccess } =
  //   useUnvoidInvoice(refNumber as any)
  const [selectedDates, setSelectedDates] = useState<string>()

  const handleDateRangeSave = (startDate: string) => {
    setSelectedDates(startDate)
  }
  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }

  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(true) // Set to true by default

  const columns = [
    {
      title: 'No',
      key: 'no',
      align: 'center',
      render: (_: any, __: any, index: number) => (
        <div style={{ textAlign: 'center' }}>{index + 1}</div>
      ),
    },
    {
      title: 'Barang',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (name: string) => (
        <div style={{ textAlign: 'left' }}>
          {name !== undefined ? name : ''}
        </div>
      ),
    },

    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      align: 'center',
      render: (qty: number) => (
        <div style={{ textAlign: 'center' }}>
          {qty !== undefined ? qty : '0'}
        </div>
      ),
    },
    {
      title: 'Satuan',
      key: 'unit_id',
      dataIndex: 'unit_id',
      align: 'center',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: number) => (
        <div style={{ textAlign: 'right' }}>
          {price !== undefined ? `${price.toLocaleString()}` : 'Rp 0'}
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      render: (amount: number) => (
        <div style={{ textAlign: 'right' }}>
          {amount !== undefined ? `${amount.toLocaleString()}` : 'Rp 0'}
        </div>
      ),
    },
  ]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={
          <Row align="middle" justify="space-between">
            <Col>
              {getPosDetail?.status_id === 1 && (
                <Tag color="red">Belum Dibayar</Tag>
              )}
              {getPosDetail?.status_id === 2 && (
                <Tag color="orange">Dibayar Sebagian</Tag>
              )}
              {getPosDetail?.status_id === 3 && <Tag color="green">Lunas</Tag>}
              {getPosDetail?.status_id === undefined && (
                <Title level={5}>Detail Tagihan</Title>
              )}
            </Col>

            <Col>
              {showButtons && (
                <>
                  <div>
                    <button onClick={printNotaHandler}>Print Nota</button>
                    <div style={{ display: 'none' }}>
                      <Receipt ref={printNota} />
                    </div>
                  </div>

                  <div>
                    <button onClick={printSuratJalanHandler}>
                      Print Surat Jalan
                    </button>
                    <div style={{ display: 'none' }}>
                      <ReceiptJalan ref={printSuratJalan} />
                    </div>
                  </div>
                </>
              )}
            </Col>
          </Row>
        }
        bordered
      >
        <Row>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Pelanggan:</Text>
            </div>
            <Title level={5} style={{ marginBottom: 0 }}>
              {contactName}
            </Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>NOMOR:</Text>
            </div>
            <Title level={5}>{getPosDetail?.ref_number || []}</Title>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tgl. Transaksi:</Text>
            </div>
            <Title level={5}>{getPosDetail?.trans_date || []}</Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tgl. Jatuh Tempo:</Text>
            </div>
            <Title level={5}>{getPosDetail?.due_date || []}</Title>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Gudang:</Text>
            </div>
            <Title level={5}>{gudangName}</Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tag:</Text>
            </div>
            <Title level={5}>{tagName}</Title>
          </Col>
        </Row>
      </Card>

      {/* Transaction Table */}
      <Table
        dataSource={getPosDetail?.items || []}
        columns={columns as any}
        pagination={false}
        rowKey="_id"
        style={{ marginTop: '20px' }}
      />

      <div
        style={{
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Row gutter={16}>
          <Col span={12}></Col>
          <Col span={12}>
            <Row>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Sub Total</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{formatNumber(subTotal)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total Diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{formatNumber(totalDiscount)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total setelah diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{formatNumber(amount)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>Total</Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>{formatNumber(amount)}</Title>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />

            <>
              {witholdings
                .filter((witholding: any) => witholding.status === 0)
                .map((witholding: any, index: number) => (
                  <Row key={index} style={{ marginTop: '8px' }}>
                    <Col span={12} style={{ textAlign: 'left' }}>
                      <a href={`/voidwitholdingpersen/${ref_number}`}>
                        <Text strong>{witholding.name}</Text>
                      </a>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong>
                        {formatNumber(witholding.down_payment)}
                      </Text>
                    </Col>
                  </Row>
                ))}
            </>

            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '20px' }}>
                  {' '}
                  Sisa Tagihan
                </Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '20px' }}>
                  {' '}
                  {formatNumber(due)}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Modal
        title="Submit"
        visible={isModalVisible}
        // onCancel={handleCancel}
        footer={null}
        style={{ textAlign: 'center' }}
        bodyStyle={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
        }}
      >
        {loading ? (
          <Spin />
        ) : (
          <Button type="primary" onClick={handleButtonClick}>
            Submit
          </Button>
        )}
      </Modal>
    </div>
  )
}

export default IdUnikDariKledo
