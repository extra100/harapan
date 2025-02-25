import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  useAddWarehouseTransferMutation,
  useGetWarehouseTransferByRefQuery,
  useUpdateWarehouseTransferMutation,
} from '../../hooks/pindahHooks'
import {
  Table,
  Typography,
  Row,
  Col,
  Button,
  InputNumber,
  message,
  Input,
  Form,
  Tooltip,
} from 'antd'
import { useIdWarehouse } from './namaWarehouse'
import { useIdNamaBarang } from './NamaBarang'
import { useReactToPrint } from 'react-to-print'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useProductStocks } from './Po'
import { saveMutation } from './apiMutasi'
import UserContext from '../../contexts/UserContext'
import { AnyNsRecord } from 'dns'
import SingleDate from '../SingleDate'
import {
  useAmbilDetailBarangGoretsQuery,
  useSimpanDetailBarangDariGoretMutation,
} from '../../hooks/ambilDetailBarangDariGoretHooks'
import { useAddBarangMutation } from '../../hooks/barangHooks'
// import MutasiSuratJalan from './MutasiSuratJalan'

const { Title, Text } = Typography

const ValidatePindah: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const idOutletLoggedIn = user ? String(user.id_outlet) : '0'
  const { error, success, saveInvoiceMutasi } = saveMutation()

  const { idaDataBarang } = useIdNamaBarang()
  const { ref_number } = useParams<{ ref_number: string }>()
  const { data: idWarehouseMonggo } = useGetWarehousesQuery()

  const { data: transferData } = useGetWarehouseTransferByRefQuery(ref_number!)

  const { mutate: updateWarehouseTransfer } =
    useUpdateWarehouseTransferMutation()

  const transferArray = Array.isArray(transferData) ? transferData : []
  const transfer = transferArray[0] || {}
  const sumberData = transfer.items || []
  console.log({transferData})
  const productIds = sumberData.map((item: any) => item.product_id).join(',')

  const qtyPermintaan = sumberData.map((item: any) => item.qty_minta).join(',')

  const warehouseMap: Record<any, any> = {}

  if (idWarehouseMonggo && Array.isArray(idWarehouseMonggo)) {
    idWarehouseMonggo.forEach((warehouse) => {
      warehouseMap[warehouse.id] = warehouse.id
    })
  }
  const productMap: Record<number, string> = {}
  idaDataBarang.forEach((barang) => {
    productMap[barang.id] = barang.name
  })

  const fromWarehouseId = warehouseMap[transfer.from_warehouse_id]
  console.log({ fromWarehouseId })
  const toWarehouseId = warehouseMap[transfer.to_warehouse_id]

  const fromWarehouseCode = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseId
  )?.code

  //
  if (idWarehouseMonggo && Array.isArray(idWarehouseMonggo)) {
    idWarehouseMonggo.forEach((warehouse) => {
      warehouseMap[warehouse.id] = warehouse.name
    })
  }
  const productMapan: Record<number, string> = {}
  idaDataBarang.forEach((barang) => {
    productMap[barang.id] = barang.name
  })

  const fromWarehouseName =
    warehouseMap[transfer.from_warehouse_id] || transfer.from_warehouse_name
  const toWarehouseName =
    warehouseMap[transfer.to_warehouse_id] || transfer.to_warehouse_name

  const fromWarehouseCodes = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseId
  )?.code

  const [title, setTitle] = useState('TRANSFER . . . ')

  useEffect(() => {
    if (String(transfer.to_warehouse_name) === 'EXTRA TRUSS') {
      setTitle(`VALIDASI PO ${fromWarehouseName}`)
    } else {
      setTitle(`VALIDASI PO ${fromWarehouseName}`)
    }
  }, [transfer.to_warehouse_name])

  const handleTransferChange = (value: number, index: number) => {
    const updatedTransferQty = [...transferQty]
    updatedTransferQty[index] = value
    setTransferQty(updatedTransferQty)
  }
  const [transferQty, setTransferQty] = useState<number[]>([])

  const [dataSource, setDataSource] = useState<any[]>([])
console.log({dataSource})
  const [fromQtyState, setFromQtyState] = useState<{ [key: number]: number }>(
    {}
  )
  console.log({ fromQtyState })
  const [toQtyState, setToQtyState] = useState<{ [key: number]: number }>({})
  console.log({ toQtyState })

  const todays = new Date()
  const offset = todays.getTimezoneOffset()
  const localTime = new Date(todays.getTime() - offset * 60 * 1000)
  const transDate = localTime.toISOString().split('T')[0]
  const navigate = useNavigate()

  useEffect(() => {
    if (transferData) {
      const initialDataSource = sumberData.map((item: any, index: number) => {
        const product = stocks.find(
          (product) => String(product.id) === String(item.product_id)
        )

        return {
          key: index,
          product_id: item.product_id,
          finance_product_id: item.finance_product_id,
          product_name: item.product_name,
          qty_minta: item.qty_minta,
          unit_name: item.unit_name,
          transferQty: 0,
          fromQty: 0,
          toQty: 0,
          code: item.sku,
          id: item.product_id,
        }
      })
      setDataSource(initialDataSource)
    }
  }, [transferData, sumberData, fromWarehouseId, toWarehouseId])
  const [keterangan, setKeterangan] = useState('')

  const handleSaveTransfer = async () => {
    const validRefNumber = ref_number || ''

    const transferData = {
      from_warehouse_id: toWarehouseId,
      to_warehouse_id: fromWarehouseId,
      trans_date: transDate,

      ref_number: validRefNumber,
      memo: keterangan,
      code: 2,
      id: 14,

      items: dataSource.map((row) => ({
        qty_minta: row.qty_minta,
        code: row.sku || row.code,
        sku: row.sku || row.code,
        product_id: row.product_id,
        finance_account_id: row.product_id,
        product_name: row.product_name,
        qty: transferQty[row.key] || 0,
        before_qty_dari: fromQtyState[row.product_id] || 0,
        before_qty_tujuan: toQtyState[row.product_id] || 0,
        unit_name: row.unit_name,
        id: row.product_id,
      })),
    }

    setIsLoading(true)

    try {
      await saveInvoiceMutasi(transferData)

      setTimeout(async () => {
        try {
          await updateWarehouseTransfer(
            { ref_number: validRefNumber, updatedData: transferData },
            {
              onError: (error) => {
                const errorMessage =
                  error?.message ||
                  'Terjadi kesalahan saat mengupdate data transfer'
                message.error(errorMessage)
                console.error('Error:', error)
              },
            }
          )

          setTimeout(() => {
            setIsLoading(false)
            navigate(`/sudah-validasi/${ref_number}`)
          }, 1000)
        } catch (error) {
          setIsLoading(false)
        }
      }, 1000)
    } catch (error) {
      setIsLoading(false)
    } finally {
      console.log('Proses transfer selesai.')
    }
  }

  const printSuratJalan = useRef<HTMLDivElement>(null)

  const printSuratJalanHandler = useReactToPrint({
    content: () => printSuratJalan.current,
  })
  const [warehouseDariId, setWarehouseDariId] = useState<string>('')
  const [warehouseTujuanId, setWarehouseTujuanId] = useState<string>('')
  const [qtyDari, setQtyDari] = useState<number | null>(null)

  const [qtyTujuan, setQtyTujuan] = useState<number | null>(null)

  const combinedWarehouseIds = `${fromWarehouseId},${toWarehouseId}`
  const handleDateRangeSave = (startDate: string) => {
    setSelectedDates(startDate)
  }
  const [selectedDates, setSelectedDates] = useState<string>()

  const { stocks, qtyById } = useProductStocks(productIds, combinedWarehouseIds)
  console.log({ stocks })

  const qtyValuesss = stocks.map((item: any) => item.qty)
  const qtyPermintaanArray = qtyPermintaan.split(',').map(Number)

  // const isValidationDisabled = qtyValuesss.some((qty, index) => {
  //   const transfer = transferQty[index] || 0
  //   const permintaan = qtyPermintaanArray[index] || 0

  //   return qty < transfer || transfer > permintaan
  // })
  const isValidationDisabled =
    qtyValuesss.some((qty, index) => {
      const transfer = transferQty[index] || 0
      const permintaan = qtyPermintaanArray[index] || 0


      const productId = Object.keys(toQtyState)[index]
      const toQtyValue = productId ? toQtyState[Number(productId)] || 0 : 0

      console.log({ transfer })
      console.log({ permintaan })
      console.log({ toQtyValue })


      return (
        qty < transfer || transfer > permintaan || toQtyValue < 0 
      )
    }) || !keterangan.trim()
  const columns = [
    {
      title: 'Qty Validasi',
      dataIndex: 'transferQty',
      key: 'transferQty',
      render: (text: string, record: any, index: number) => {
        const product = stocks.find(
          (product) => String(product.id) === String(record.product_id)
        )

        const qtyDariValue = product?.stocks?.[toWarehouseId]?.qty || 0
        const qtyPermintaan = record.qty_minta || 0

        const isQtyValid =
          transferQty[index] <= qtyPermintaan &&
          transferQty[index] <= qtyDariValue

        return (
          <Tooltip
            title={
              transferQty[index] > qtyPermintaan
                ? 'Qty Validasi melebihi Qty Permintaan'
                : transferQty[index] > qtyDariValue
                ? 'Qty Validasi melebihi Stok Terakhir'
                : ''
            }
            overlayInnerStyle={{
              color: 'red',
              backgroundColor: 'transparent',
            }}
          >
            <Input
              type="number"
              value={transferQty[index] || 0}
              onChange={(e) => {
                const value = Number(e.target.value)

                // Update nilai transferQty jika ada perubahan
                setTransferQty((prev) => {
                  const newQty = [...prev]
                  newQty[index] = value
                  return newQty
                })
                const productId = record.product_id
                const product = stocks.find(
                  (p) => String(p.id) === String(productId)
                )
                if (product) {
                  const qtyDari = product.stocks?.[fromWarehouseId]?.qty || 0
                  const qtyTujuan = product.stocks?.[toWarehouseId]?.qty || 0

                  setFromQtyState((prevState) => ({
                    ...prevState,
                    [productId]: qtyDari + value,
                  }))

                  setToQtyState((prevState) => ({
                    ...prevState,
                    [productId]: qtyTujuan - value,
                  }))
                }
              }}
              style={{
                borderColor:
                  transferQty[index] > qtyPermintaan ||
                  transferQty[index] > qtyDariValue
                    ? 'red'
                    : undefined,
                width: '100px',
              }}
            />
          </Tooltip>
        )
      },
    },

    {
      title: 'Stok Terakhir',
      dataIndex: 'transferQty',
      key: 'transferQty',
      render: (_: any, record: any, index: number) => {
        const product = stocks.find(
          (product) => String(product.id) === String(record.product_id)
        )

        // if (!product) return <span>Refresh</span>
        if (!product) return <span style={{ color: 'red' }}>Refresh</span>

        const qtyDariValue = product?.stocks?.[toWarehouseId]?.qty || 0
        const qtyTujuanValue = product?.stocks?.[fromWarehouseId]?.qty || 0

        const transferAmount = transferQty[index] || 0
        const updatedQtyDariValue = qtyTujuanValue + transferAmount
        const updatedQtyTujuanValue = qtyDariValue - transferAmount

        return (
          <div>
            <span>{`D${updatedQtyTujuanValue} / K${updatedQtyDariValue}`}</span>
          </div>
        )
      },
    },
    ...(transferData?.code === 1
      ? [
          {
            title: 'Tervalidasi',
            dataIndex: 'qty',
            key: 'qty',
          },
        ]
      : []),
    {
      title: 'Barang',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Code',
      dataIndex: 'sku',
      key: 'sku',
    },

    {
      title: 'Qty Permintaan',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
    },
    ...(transferData?.code === 1
      ? [
          {
            title: 'Tervalidasi',
            dataIndex: 'qty',
            key: 'qty',
          },
        ]
      : []),

    {
      title: 'Satuan',
      dataIndex: 'unit_name',
      key: 'unit_name',
    },
  ]

  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  const [isLoading, setIsLoading] = useState(false)
  const today = new Date()
  const formattedDate = today.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <div className={`page-container ${isLoading ? 'loading' : ''}`}>
      <div
        ref={componentRef}
        className="print-container"
        style={{ width: '70%', margin: '0 auto', maxWidth: '1200px' }}
      >
        <Title level={3} style={{ textAlign: 'center' }}>
          <span style={{ color: '#AF8700', fontSize: '20px' }}>{title}</span>
        </Title>

        {transferArray.length > 0 && (
          <>
            <Row
              style={{
                marginBottom: '16px',
                borderBottom: '1px dotted #AF8700',
                padding: '8px',
              }}
            >
              <Col span={24}>
                <Row>
                  <Col span={6}>
                    <Text>No Permintaan</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>: {transfer.ref_number}</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text>Dari</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Tanggal Validasi</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>: {formattedDate}</Text>
                  </Col>

                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text strong>{toWarehouseName}</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Alamat Peminta</Text>
                  </Col>
                  <Col span={12}>
                    <Text italic>: {fromWarehouseCodes || '-'}</Text>
                  </Col>

                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text>Kepada</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Keterangan</Text>
                  </Col>
                  <Col span={12}>
                    <Input
                      placeholder="Masukkan keterangan..."
                      onChange={(e) => setKeterangan(e.target.value)}
                      value={keterangan}
                      style={{
                        border: 'none',
                        borderBottom: '1px solid #ccc',
                        width: '80%',
                      }}
                    />
                  </Col>

                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text strong>{fromWarehouseName}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Table
              dataSource={sumberData}
              columns={columns as any}
              rowKey="_id"
              pagination={false}
              style={{ marginBottom: '0px' }}
            />

            {transferData?.code !== 2 && (
              <div style={{ textAlign: 'left' }}>
                <Tooltip
                  title={
                    isValidationDisabled
                      ? 'Qty Validasi tidak boleh lebih besar dari Qty Permintaan'
                      : ''
                  }
                >
                  <Button
                    type="dashed"
                    onClick={handleSaveTransfer}
                    style={{
                      marginTop: '16px',
                      backgroundColor: isValidationDisabled
                        ? '#ccc'
                        : '#28a745',
                      borderColor: isValidationDisabled ? '#ccc' : '#28a745',
                      color: '#ffffff',
                      width: '200px',
                    }}
                    disabled={isValidationDisabled}
                  >
                    VALIDASI PERMINTAAN
                  </Button>
                </Tooltip>
              </div>
            )}
          </>
        )}
      </div>
      {isLoading && <div className="loading-overlay"></div>}
    </div>
  )
}
export default ValidatePindah
