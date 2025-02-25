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
} from 'antd'
import {
  useAddTransactionMutation,
  useGetTransactionByIdQuery,
  useUpdateTransactionMutation,
} from '../../hooks/transactionHooks'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiOutlinePrinter } from 'react-icons/ai'
import PosPrintKomponent from './PosPrintCok'
import moment from 'moment'
import dayjs from 'dayjs'
import { useFiac } from './Fiac'
import { saveToApiNextPayment } from './NextPayment'
import { useReactToPrint } from 'react-to-print'
import Receipt from './printNota'
import ReceiptJalan from './ReceiptJalan'
import { useIdInvoice } from './takeSingleInvoice'
import { useIdWarehouse } from './namaWarehouse'
import { useGetContactsQuery } from '../../hooks/contactHooks'
import { useGetAkunBanksQueryDb } from '../../hooks/akunBankHooks'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { NumericFormat } from 'react-number-format'

import type { Dayjs } from 'dayjs'
import { useVoidInvoice } from './voidInvoice'
import { Transaction } from '../../types/Transaction'
import { useUnvoidInvoice } from './unvoidInvoice'
import { SaveReturnInvoice } from './returInvoice'
import { v4 as uuidv4 } from 'uuid'
import { useAddReturnMutation } from '../../hooks/returnHooks'
import SingleDate from '../SingleDate'
import { KirimEditKeKledo } from './KirimEditKeKledo'
// ;/api/1v / finance / bankTrans / creditMemoPayment

const { Title, Text } = Typography
const { Option } = Select

const Aneh: React.FC = () => {
  const [showButtons, setShowButtons] = useState(false)
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(currentDate)

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

  const updatePosMutation = useUpdateTransactionMutation()

  const { ref_number } = useParams<{ ref_number?: string }>()
  //
  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const idDariSDBEK = getPosDetail?.id

  const { data: contacts } = useGetContactsQuery()
  const { data: akunBanks } = useGetAkunBanksQueryDb()


  const { getIdAtInvoice } = useIdInvoice(ref_number || '')

  const invoiceId = getIdAtInvoice ? getIdAtInvoice.id : null

  const refNumber = getIdAtInvoice ? getIdAtInvoice.ref_number : null

  // const contactName = getPosDetail?.contacts?.[0]?.name
  const contactId = getPosDetail?.contacts?.[0]?.id
  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const gudangId = getPosDetail?.warehouses?.[0]?.warehouse_id

  const tagName = getPosDetail?.tages?.map((tag: any) => tag.name) || []
  const tagId = getPosDetail?.tages?.map((tag: any) => tag.id) || []
  const finance_account_id =
    getPosDetail?.items?.map((item: any) => item.finance_account_id) || []
    const namaBarang =
    getPosDetail?.items?.map((item: any) => item.name) || []
    console.log({namaBarang})
  const qty = getPosDetail?.items?.[0]?.qty || null
  const price = getPosDetail?.items?.[0]?.price || null
  const memorandum = getPosDetail?.memo ?? 0

  const amount = getPosDetail?.amount ?? 0
  const warehouseNomor = getPosDetail?.warehouse_id ?? 0
  const status_id = getPosDetail?.status_id ?? 0
  const refTransaksi = getPosDetail?.ref_number ?? 0
  const witholdings = getPosDetail?.witholdings || []
  const items = getPosDetail?.items || []
  const totalDownPayment = witholdings.reduce(
    (sum: number, witholding: any) => {
      return sum + (witholding.down_payment || 0)
    },
    0
  )

  const generateShortInvoiceId = (idOutlet: string): string => {
    const uuid = uuidv4()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000
    return `RT-${gudangId}-${String(shortNumber).padStart(4, '0')}`
  }

  useEffect(() => {
    if (gudangId) {
      const newRefNumber = generateShortInvoiceId(gudangId as any)
      setNewRefNomor(newRefNumber)
    }
  }, [gudangId]) // On
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

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (!isNaN(value) && value <= due) {
      setAmountPaid(value)
    } else {
      alert('Jumlah bayar tidak boleh melebihi total tagihan')
    }
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
  const { saveReturn } = SaveReturnInvoice()
  const simpanReturn = useAddReturnMutation()
  const { editDataKelod } = KirimEditKeKledo()
  const navigate = useNavigate()

  const handleFormSubmit = (values: any) => {
    const accountMap = fiAc?.children?.reduce((map: any, warehouse: any) => {
      map[warehouse.name] = warehouse.id
      return map
    }, {})

    const accountId = accountMap[selectedBank as any]

    if (refNumber) {
      const invoiceData = {
        jalur: 'returning',
        ref_transaksi: newRefNomor,
        id: idDariSDBEK,

        trans_date: formatDate(selectedDates),
        withholdings: [
          {
            witholding_account_id: accountId || bankAccountId,
            name: selectedBank || bankAccountName,
            down_payment: amountPaid || 0,
            witholding_percent: 0,
            witholding_amount: hutang,
          },
        ],
      }

      const existingInvoice = allTransactions?.find(
        (transaction) => transaction.ref_number === refNumber
      )

      if (existingInvoice) {
        const updatedWithholdings = [...existingInvoice.witholdings]

        const updatedInvoice = {
          ...existingInvoice,
          jalur: invoiceData.jalur,
          id: idDariSDBEK,
          trans_date: formatDate(selectedDates),
          witholdings: updatedWithholdings,
          // ref_number: newRefNomor,
          ref_transaksi: invoiceData.ref_transaksi, // Memastikan ref_transaksi diperbarui
        }
        console.log('Updated Invoice:', updatedInvoice)

        // simpanReturn.mutate(updatedInvoice as any)
      } else {
        console.error('Invoice with ref_number not found:', refNumber)
      }
    } else {
      console.error('No valid ref_number found.')
    }

    const payload = {
      trans_date: selectedDates,
      contact_id: contactId,
      status_id: status_id,
      include_tax: 0,
      ref_transaksi: refTransaksi,
      ref_number: newRefNomor,
      memo: refTransaksi,
      attachment: [],
      business_tran_id: idDariSDBEK,
      items:
        getPosDetail?.items?.map((item: any, index: any) => ({
          finance_account_id: item.finance_account_id,
        
          tax_id: '',
          desc: '',
          qty_transaksi: item.qty,
          qty: transferQty[index] || 0,

          price: item.price,
          amount: item.amount,
          price_after_tax: 0,
          amount_after_tax: 0,
          // unit_id: 2,
        })) || [],
    }
    saveReturn(payload as any)
      .then((response: any) => {
        console.log('Payment saved successfully:', response)
      })
      .catch((error: any) => {
        console.error('Error saving payment:', error)
      })
    const simpanQty = {
      trans_date: selectedDates,
      due_date: selectedDates,
      contact_id: contactId,
      status_id: status_id,
      include_tax: 0,
      ref_transaksi: refTransaksi,
      ref_number: newRefNomor,
      memo: refTransaksi,
      attachment: [],
      business_tran_id: idDariSDBEK,
      id: idDariSDBEK,
      witholding_account_id: accountId || bankAccountId,
      witholding_amount: hutang,
      witholding_percent: 0,
      warehouse_id: warehouseNomor,
      externalId: 1,
      term_id: 2,
      due: 3,
      unique_id: 3,
      reason_id: 3,
      down_payment: amountPaid || 0,
      amount: amountPaid || 0,
      jalur: 'returning',

      items:
        getPosDetail?.items?.map((item: any, index: any) => ({
          finance_account_id: item.finance_account_id,
          tax_id: '',
          desc: '',
          qty_transaksi: item.qty,
          qty: transferQty[index] || 0,
          name: namaBarang[index] || 0,
          amount: totalNilaiPerItme[index] || 0,
          discount_amount: aaadiskon[index] || 0,          
          price: item.price,
          discount_percent: 0,
          price_after_tax: 0,
          amount_after_tax: 0,
          qty_update: 0,
          // unit_id: 2,
        })) || [],
      withholdings: [
        {
          witholding_account_id: accountId || bankAccountId,
          name: selectedBank || bankAccountName,
          down_payment: amountPaid || 0,
          witholding_percent: 0,
          witholding_amount: hutang,
        },
      ],
    }
    simpanReturn.mutate(simpanQty as any)
    // navigate(`/pembayaranretur/${memorandum}/${selectedDates}`) 
    if (hutang === 0) {
      navigate(`/detailkledo/${memorandum}`);
    } else {
      navigate(`/pembayaranretur/${memorandum}/${selectedDates}`);
    }
    
    
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

  const [newRefNomor, setNewRefNomor] = useState('')


  const [totalNilaiPerItme, setTotalNilaiPerIem] = useState<number[]>([])
  const [aaadiskon, setAaaDiskon] = useState<number[]>([])
  const [transferQty, setTransferQty] = useState<number[]>([])

  const beh = Number(aaadiskon) / Number(transferQty)

  const [subTotalReturn, setSubTotal] = useState(0)
  const [sumDiskon, setSumDiskon] = useState<number>(0)
  const [totalSetelahDiskon, setTotalSetelahDiskon] = useState(0)
  const [hutang, setHutang] = useState<number>(0)
  const [confuse, setConfue] = useState<number>(0)

  useEffect(() => {
    const total = totalNilaiPerItme.reduce((acc, curr) => acc + (curr || 0), 0)
    const totalDiskons = aaadiskon.reduce((acc, curr) => acc + (curr || 0), 0)

    const bingung = total

    setConfue(bingung)
    setSubTotal(total)
    setSumDiskon(totalDiskons)
    setTotalSetelahDiskon(total - totalDiskons)

    if (total > totalDownPayment) {
      setHutang(totalDownPayment)
    } else {
      setHutang(bingung)
    }
  }, [totalNilaiPerItme, aaadiskon, totalDownPayment])

  const handleSetAmountPaid = () => {
    setAmountPaid(hutang)
  }

  const [selisih, setSelisih] = useState<number[]>([]);

  // Function to handle changes in transfer quantity
  const handleTransferQtyChange = (
    value: number,
    index: number,
    discounted_price: number,
    discount_amount: number
  ) => {
    setTransferQty((prevTransferQty) => {
      const updatedTransferQty = [...prevTransferQty]
      updatedTransferQty[index] = value
      return updatedTransferQty
    })
  
    setTotalNilaiPerIem((prevAmounts) => {
      const updatedAmounts = [...prevAmounts]
      updatedAmounts[index] = value * discounted_price
      return updatedAmounts
    })
  
    setAaaDiskon((prevDiscount) => {
      const updatedTotalDiscount = [...(prevDiscount || [])]
      updatedTotalDiscount[index] = discount_amount
      return updatedTotalDiscount
    })
      setTotalNilaiPerIem((prevAmounts) => {
      const updatedAmounts = [...prevAmounts]
      updatedAmounts[index] = value * discounted_price
      return updatedAmounts
    })
  
    
  }
  
  const [isDiscountVisible, setIsDiscountVisible] = useState<boolean>(true)
  const [selectedDates, setSelectedDates] = useState<string>()

  const handleDateRangeSave = (startDate: string) => {
    setSelectedDates(startDate)
  }
  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }


  
    const columns = [
      {
        title: 'NO',
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
      isDiscountVisible && {
        title: 'Discount',
        dataIndex: 'discount_percent',
        key: 'discount_percent',
        align: 'center',
        render: (discount_percent: number) => (
          <div style={{ textAlign: 'right' }}>
            {discount_percent !== undefined
              ? `${discount_percent.toLocaleString()}%`
              : '0%'}
          </div>
        ),
      },

      {
        title: 'Umum 2',
        key: 'original_price',
        align: 'center',
        render: (_: any, record: { price: number; discount_percent: number }) => {
          const { price, discount_percent } = record;
          const originalPrice =
            discount_percent !== undefined && discount_percent > 0
              ? price / (1 - discount_percent / 100)
              : price;
      
          return (
            <div style={{ textAlign: 'right' }}>
              {originalPrice !== undefined
                ? `${Math.round(originalPrice).toLocaleString()}`
                : 'Rp 0'}
            </div>
          );
        },
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
        title: 'Selisih',
        key: 'difference',
        align: 'center',
        render: (_: any, record: { price: number; discount_percent: number }) => {
          const { price, discount_percent } = record;
          const originalPrice =
            discount_percent !== undefined && discount_percent > 0
              ? price / (1 - discount_percent / 100)
              : price;
      
          const difference = originalPrice - price;
      
          return (
            <div style={{ textAlign: 'right' }}>
              {difference !== undefined
                ? `${Math.round(difference).toLocaleString()}`
                : 'Rp 0'}
            </div>
          );
        },
      }
,      
      
      {
        title: 'Qty Retur',
        dataIndex: 'transferQty',
        key: 'transferQty',
        render: (text: string, record: any, index: number) => (
          <Input
            type="number"
            value={transferQty[index] || 0}
            onChange={(e) =>
              handleTransferQtyChange(
                Number(e.target.value),
                index,
                record.price,
                record.discount_amount
              )
            }
          />
        ),
      }, 
    
     
      {
        title: 'Total Diskon',
        key: 'totalValue',
        align: 'center',
        render: (_: any, record: { price: number; discount_percent: number }, index: number) => {
          const { price, discount_percent } = record;
          const originalPrice =
            discount_percent !== undefined && discount_percent > 0
              ? price / (1 - discount_percent / 100)
              : price;
      
          const difference = originalPrice - price;
          const qtyRetur = transferQty[index] || 0;
          const totalValue = difference * qtyRetur;
      
          return (
            <div style={{ textAlign: 'right' }}>
              {totalValue !== undefined
                ? `${Math.round(totalValue).toLocaleString()}`
                : 'Rp 0'}
            </div>
          );
        },
      },
     
      
  
      {
        title: 'Total',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        render: (_: string, record: any, index: number) => {
          const transferQuantity = Number(transferQty[index] || 0); 
          const price = Number(record.price || 0); 
          const total = transferQuantity * price;
      
          return (
            <div style={{ textAlign: 'right' }}>
              {total > 0 ? `${total.toLocaleString()}` : 'Rp 0'}
            </div>
          );
        },
      }
      
      
    ].filter(Boolean) 

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={
          <Row align="middle" justify="space-between">
            <Button onClick={() => setIsDiscountVisible((prev) => !prev)}>
              Toggle Discount Column
            </Button>
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
              {showButtons && ( // Conditionally render the buttons after 2 seconds
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
        {/* Transaction Details */}
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
            {/* <Title level={5}>{getPosDetail?.ref_number || []}</Title> */}
            <Title level={5}>{newRefNomor}</Title>
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
                <Text strong>{formatNumber(subTotalReturn)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total Diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{formatNumber(sumDiskon)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total setelah diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{formatNumber(subTotalReturn)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>Total</Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>{formatNumber(subTotalReturn)}</Title>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <>
              {witholdings
                .filter((witholding: any) => witholding.down_payment > 0)
                .map((witholding: any, index: number) => (
                  <Row key={index} style={{ marginTop: '8px' }}>
                    <Col span={12} style={{ textAlign: 'left' }}>
                      <Text strong>{witholding.name}</Text>
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
                  Jumlah Hutang
                </Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '20px' }}>
                  {' '}
                  {formatNumber(hutang)}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Card title="" style={{ marginTop: '20px' }}>
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
                disabled
                value={amountPaid as any}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                allowNegative={false}
                onValueChange={(values) => {
                  const { floatValue } = values
                  setAmountPaid(floatValue || 0)
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
                showSearch
                placeholder="Pilih bank"
                value={selectedBank}
                disabled
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
          <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit">
                Simpan Retur
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default Aneh
