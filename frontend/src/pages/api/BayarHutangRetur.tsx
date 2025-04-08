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
  Badge,
} from 'antd'
import {
  useAddTransactionMutation,
  useGetTransactionByIdQuery,
  useUpdateTransactionMutation,
} from '../../hooks/transactionHooks'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AiOutlinePrinter } from 'react-icons/ai'
import PosPrintKomponent from './PosPrintCok'
import moment from 'moment'
import dayjs from 'dayjs'

import { saveToApiNextPayment } from './NextPayment'
import { useReactToPrint } from 'react-to-print'
import Receipt from './printNota'
import ReceiptJalan from './ReceiptJalan'
// import { useIdInvoice } from './takeSingleInvoice'

import { useGetContactsQuery } from '../../hooks/contactHooks'
import { useGetAkunBanksQueryDb } from '../../hooks/akunBankHooks'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { NumericFormat } from 'react-number-format'

import type { Dayjs } from 'dayjs'
import { useVoidInvoice } from './voidInvoice'
import { Transaction } from '../../types/Transaction'
// import { useUnvoidInvoice } from './unvoidInvoice'
import SingleDate from '../SingleDate'

import {
  EyeOutlined,
  FileSearchOutlined,
  RetweetOutlined,
  RollbackOutlined,
  RotateLeftOutlined,
  EditOutlined,
  CloseCircleOutlined,
  UndoOutlined,
  PrinterOutlined,
  CarOutlined,
} from '@ant-design/icons'
import { useDeleteInvoice } from './DeleteInvoicePenjualan'
import { useRedData } from '../../badgeMessage'
import {
  useGetReturnByIdQuery,
  useGetReturnssQuery,
} from '../../hooks/returnHooks'
import { TakeIdReturPayment } from '../TakeIdReturPayment'

const { Title, Text } = Typography
const { Option } = Select

const BayarHutangRetur: React.FC = () => {
  const [showButtons, setShowButtons] = useState(false)
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(currentDate)
  const [transDateFrom, setTransDateFrom] = useState<string | null>(
    dayjs().format('YYYY-MM-DD')
  )

  const [transDateTo, setTransDateTo] = useState<string | null>(
    dayjs().format('YYYY-MM-DD')
  )

  const { memorandum, selectedDate } = useParams<{
    memorandum: string
    selectedDate: string
  }>()
  const [search, setSearch] = useState<any>({
    memorandum,
    selectedDate,
  })

  console.log({ search })

  const { getIdReturPayment } = TakeIdReturPayment(
    transDateFrom,
    transDateTo,
    search
  )
  const getReturKledo = getIdReturPayment?.find(
    (transaction: any) => transaction.memo === memorandum
  )
  // const [memoState, setMemoState] = useState<any>(ref_number)

  console.log({ getReturKledo })
  const memes = getReturKledo?.memo
  const contactId = getReturKledo?.contact_id
  const tglTrans = getReturKledo?.trans_date
  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date)
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])
  const { ref_number } = useParams<{ ref_number?: string }>()

  const updatePosMutation = useUpdateTransactionMutation()
  //
  const { data: allTransactionsss } = useGetTransactionByIdQuery(
    memorandum as any
  )
  const getPosDetail = allTransactionsss?.find(
    (transaction: any) => transaction.memo === memorandum
  )
  console.log({ allTransactionsss })
  const { data: contacts } = useGetContactsQuery()
  const { data: akunBanks } = useGetAkunBanksQueryDb()

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  )

  const { hapusLoading, isDeleted } = useDeleteInvoice(selectedInvoiceId ?? 0)

  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const gudangId = getPosDetail?.warehouse_id

  const langka = getPosDetail?.id

  const tagName = getPosDetail?.tages?.map((tag: any) => tag.name) || []

  const items = getPosDetail?.items || []

  const witholdings = getPosDetail?.witholdings || []
  const amount = getPosDetail?.amount ?? 0

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

  // const { getIdReturPayment } = TakeIdReturPayment(
  //   transDateFrom,
  //   transDateTo,
  //   memoState
  // )

  console.log({ getIdReturPayment })



  const [amountPaid, setAmountPaid] = useState<number | null>(null)
  useEffect(() => {
    console.log({ due, amountPaid })
  }, [due, amountPaid])

  const roundUpIndonesianNumber = (value: number | null): string => {
    if (value === null) return ''
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (!isNaN(value) && value <= due) {
      setAmountPaid(value)
    } else {
      alert('Jumlah bayar tidak boleh melebihi total tagihan')
    }
  }
  const handleSetAmountPaid = () => {
    setAmountPaid(Math.round(due))
  }

  const [contactName, setContactName] = useState<string>('Unknown Contact')

  useEffect(() => {
    if (allTransactionsss && contacts) {
      const contactId = getPosDetail?.contact_id
      const contact = contacts.find((c: any) => c.id === contactId)
      if (contact) {
        setContactName(contact.name)
      }
    }
  }, [allTransactionsss, contacts])


  const [selectedBank, setSelectedBank] = useState<any | null>(null)

  const today = dayjs().format('DD-MM-YYYY')
  const { saveNextPayment } = saveToApiNextPayment()

  const [loadingSpinner, setLoadingSpinner] = useState(false)

  const handleFormSubmit = (values: any) => {
    const accountMap = allTransactionsss?.reduce((map: any, warehouse: any) => {
      map[warehouse.name] = warehouse.id
      return map
    }, {})
    // const handleFormSubmit = (values: any) => {
    //   const accountMap = fiAc?.children?.reduce((map: any, warehouse: any) => {
    //     map[warehouse.name] = warehouse.id
    //     return map
    //   }, {})

    const accountId = accountMap[selectedBank as any]

    if (langka) {
      const invoiceData = {
        witholdings: [
          {
            witholding_account_id: accountId || bankAccountId,
            name: selectedBank || bankAccountName,
            down_payment: amountPaid || 0,
            witholding_percent: 0,
            witholding_amount: amountPaid || 0,
            status: 0,
            trans_date: selectedDates,
          },
        ],
      }

      const existingInvoice = allTransactionsss?.find(
        (transaction) => transaction.id === langka
      )

      if (existingInvoice) {
        const updatedWithholdings = [
          ...existingInvoice.witholdings,
          ...invoiceData.witholdings,
        ]

        const updatedInvoice = {
          ...existingInvoice,
          witholdings: updatedWithholdings,
        }

        updatePosMutation.mutate(updatedInvoice as any)
      } else {
      }
    } else {
      console.error('No valid ref_number found.')
    }

    // Membuat payload untuk pembayaran baru
    const payload = {
      amount: amountPaid || 0,
      attachment: [],
      bank_account_id: accountId || bankAccountId,
      business_tran_id: langka,

      witholding_amount: amountPaid,
      memo: values.catatan || null,
      trans_date: selectedDates,
      witholdings: [],
    }

    saveNextPayment(payload)
      .then((response: any) => {
        console.log('Payment saved successfully:', response)
      })
      .catch((error: any) => {
        console.error('Error saving payment:', error)
      })
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

  // const matchingTele = tele?.find((item) => {
  //   const nameParts = item.name.split('_')
  //   return nameParts[1] === gudangName
  // })

  const [bankAccountName, setBankAccountName] = useState<string | null>(null)

  const [bankAccountId, setBankAccountId] = useState<string | null>(null)

  //   const [warehouseName, setWarehouseName] = useState<string | null>(null)
  const [warehouseName, setWarehouseName] = useState<string>('')

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
    if (allTransactionsss && gudangdb) {
      const warehouseId = getPosDetail?.warehouse_id
      const gudang = gudangdb.find((c: any) => c.id === warehouseId)
      if (gudang) {
        setWarehouseName(gudang.name)
      }
    }
  }, [allTransactionsss, gudangdb])
  //   useEffect(() => {
  //     const name = getWarehouseName()
  //     setWarehouseName(name)
  //     if (name) {
  //     }
  //   }, [gudangdb, gudangId])
  // const getBankAccountName = () => {
  //   if (!akunBanks || !warehouseName) return null

  //   const matchingBankAccount = akunBanks.find((bank: { name: string }) => {
  //     const parts = bank.name.split('_')
  //     return parts[1] === warehouseName
  //   })
  //   return matchingBankAccount ? matchingBankAccount.name : null
  // }
  // useEffect(() => {
  //   const name = getBankAccountName()
  //   setBankAccountName(name)
  // }, [warehouseName, akunBanks])
  // const getBankAccountId = () => {
  //   if (!akunBanks || !warehouseName) return null

  //   const matchingBankAccount = akunBanks.find(
  //     (bank: { name: any; id: any }) => {
  //       const parts = bank.name.split('_')
  //       return parts[1] === warehouseName
  //     }
  //   )
  //   return matchingBankAccount ? matchingBankAccount.id : null
  // }
  // const matchingName = matchingTele?.name
  // useEffect(() => {
  //   if (bankAccountName) {
  //     setSelectedBank(bankAccountName)
  //   }
  // }, [bankAccountName])
  // useEffect(() => {
  //   const id = getBankAccountId()
  //   setBankAccountId(id as any)
  // }, [warehouseName, akunBanks])

  const [selectedDates, setSelectedDates] = useState<string>()

  const handleDateRangeSave = (startDate: string) => {
    setSelectedDates(startDate)
  }
  // const formatDate = (dateString: any) => {
  //   const [day, month, year] = dateString as any
  //   return `${year}-${month}-${day}`
  // }

  const navigate = useNavigate()

  const { hasRedData } = useRedData()

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
      dataIndex: 'finance_account_id',
      key: 'finance_account_id',
      align: 'center',
      render: (finance_account_id: string) => (
        <div style={{ textAlign: 'left' }}>
          {finance_account_id !== undefined ? finance_account_id : ''}
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
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: number) => (
        <div style={{ textAlign: 'right' }}>
          {price !== undefined ? roundUpIndonesianNumber(price) : 'Rp 0'}
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
          {amount !== undefined ? roundUpIndonesianNumber(amount) : 'Rp 0'}
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
              {(() => {
                const amount = getPosDetail?.amount ?? 0

                const totalDownPayment = witholdings
                  .filter((witholding: any) => witholding.status === 0)
                  .reduce((sum: number, witholding: any) => {
                    return sum + (witholding.down_payment || 0)
                  }, 0)

                const due = amount - totalDownPayment

                if (totalDownPayment === 0) {
                  return <Tag color="red">Belum Dibayar</Tag>
                } else if (due <= 0) {
                  return <Tag color="green">Lunas</Tag>
                } else {
                  return <Tag color="orange">Dibayar Sebagian</Tag>
                }
              })()}
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
              {contactId}
            </Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>NOMOR:</Text>
            </div>
            <Title level={5}>{memes}</Title>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tgl. Transaksi:</Text>
            </div>
            <Title level={5}>{tglTrans}</Title>
          </Col>

          {getPosDetail?.memo && (
            <Col span={12}>
              <div style={{ marginBottom: '0px' }}>
                <Text strong>Ket:</Text>
              </div>
              <Text>{getPosDetail?.memo}</Text>
            </Col>
          )}
        </Row>
        <Row>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Gudang:</Text>
            </div>
            <Title level={5}>{warehouseName}</Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tag:</Text>
            </div>
            <Title level={5}>
              {getPosDetail?.tages?.map((tag: any) => tag.name).join(' - ') ||
                'No Tags'}
            </Title>
          </Col>
        </Row>
      </Card>

      {/* Transaction Table */}
      <Table
        dataSource={items}
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
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total setelah diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{roundUpIndonesianNumber(amount)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>Total</Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>{roundUpIndonesianNumber(amount)}</Title>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />

            <>
              {witholdings
                .filter(
                  (witholding: any) =>
                    witholding.status === 0 && witholding.down_payment !== 0
                ) // Tambahkan pengecekan down_payment !== 0
                .map((witholding: any, index: number) => (
                  <Row key={index} style={{ marginTop: '8px' }}>
                    <Col span={12} style={{ textAlign: 'left' }}>
                      <a href={`/editpembayaran/${ref_number}`}>
                        <Text strong>{witholding.name}</Text>
                      </a>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong>
                        {roundUpIndonesianNumber(witholding.down_payment)}
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
                  {roundUpIndonesianNumber(due < 0 ? 0 : due)}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Card title="Pembayaran" style={{ marginTop: '20px' }}>
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <span
                style={{
                  // ...labelStyle,
                  fontSize: '16px',

                  cursor: 'pointer',
                }}
                onClick={handleSetAmountPaid}
              >
                Jumlah Bayar
              </span>
              <span
                style={{
                  // ...labelColonStyle,
                  fontSize: '16px',
                }}
              >
                :
              </span>

              <NumericFormat
                placeholder="Nilai Pembayaran"
                value={amountPaid}
                displayType="input"
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                decimalScale={0} // Pastikan hanya angka bulat
                onValueChange={(values) => {
                  const { floatValue } = values
                  setAmountPaid(floatValue || 0) // Simpan sebagai angka bulat
                }}
                customInput={Input}
                max={due}
                style={{
                  width: '100%',
                  textAlign: 'right',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#007BFF',
                }}
              />
            </Col>

            <Col span={12}>
              <Form.Item>
                <SingleDate
                  onChange={(dates) => {
                    setSelectedDates(dates)
                  }}
                  onSave={handleDateRangeSave}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Select
                showSearch // Menampilkan kolom pencarian
                placeholder="Pilih bank"
                value={selectedBank}
                onChange={(value) => setSelectedBank(value)}
                style={{ width: '100%' }}
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option?.children
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {akunBanks?.map((e) => (
                  <Select.Option key={e.id} value={e.name}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Form.Item name="catatan">
                <Input placeholder="Catatan" />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading} // Spinner muncul saat true
            onClick={() => {
              setLoading(true) // Aktifkan spinner
              setTimeout(() => {
                setLoading(false) // Matikan spinner setelah 1 detik
                message.success('Pembayaran berhasil ditambahkan!') // Pesan berhasil
              }, 1000) // Spinner aktif selama 1 detik
            }}
          >
            Tambah Pembayaran
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default BayarHutangRetur
