import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  useAddWarehouseTransferMutation,
  useDeleteMutasiMutation,
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
  Menu,
} from 'antd'

import { useIdNamaBarang } from './NamaBarang'
import { useReactToPrint } from 'react-to-print'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useProductStocks } from './Po'
import { saveMutation } from './apiMutasi'
import UserContext from '../../contexts/UserContext'
import { useIdMutation } from './takeSingleMutation'
import { useDeleteMutation } from './DeleteInvoiceMutation'
import { CloseCircleOutlined } from '@ant-design/icons'
import { userefNumberFromKledo } from './UserefNumberFromKledo'

const { Title, Text } = Typography

const SudahDivalidasi: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const idOutletLoggedIn = user ? String(user.id_outlet) : '0'
  const { error, success, saveInvoiceMutasi } = saveMutation()

  const { idaDataBarang } = useIdNamaBarang()
  const { ref_number } = useParams<{ ref_number: string }>()
  console.log({ref_number})
  const { data: idWarehouseMonggo } = useGetWarehousesQuery()
const refNu = 16765
  const { data: transferData } = useGetWarehouseTransferByRefQuery(ref_number!)
  const { getBasedOnRefNumber } = userefNumberFromKledo(refNu)
// console.log({getBasedOnRefNumber})
  const transferArray = Array.isArray(transferData) ? transferData : []
  const transfer = transferArray[0] || {}
  const sumberData = transfer.items || []

  const warehouseMap: Record<any, any> = {}
  const formattedTransDate = new Date(transfer.trans_date).toLocaleString(
    'id-ID',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )
  if (idWarehouseMonggo && Array.isArray(idWarehouseMonggo)) {
    idWarehouseMonggo.forEach((warehouse) => {
      warehouseMap[warehouse.id] = warehouse.id
    })
  }
  const productMap: Record<number, string> = {}
  idaDataBarang.forEach((barang) => {
    productMap[barang.id] = barang.name
  })

  const fromWarehouseId =
    warehouseMap[transfer.from_warehouse_id] || transfer.from_warehouse_name
  const toWarehouseId =
    warehouseMap[transfer.to_warehouse_id] || transfer.to_warehouse_name

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
  const fromWarehouseCode = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseName
  )?.code
  const noContact = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseName
  )?.contact

  const [title, setTitle] = useState('TRANSFER . . . ')

  useEffect(() => {
    if (String(transfer.to_warehouse_name) === 'EXTRA TRUSS') {
      setTitle('TRANSFER GUDANG')
    } else {
      setTitle('TRANSFER PO')
    }
  }, [transfer.to_warehouse_name])

  const [transferQty, setTransferQty] = useState<number[]>([])

  // const handleTransferQtyChange = (value: number, index: number) => {
  //   setTransferQty((prevTransferQty) => {
  //     const updatedTransferQty = [...prevTransferQty]
  //     updatedTransferQty[index] = value
  //     return updatedTransferQty
  //   })
  // }

  const [dataSource, setDataSource] = useState<any[]>([])

  const combinedWarehouseIds = `${fromWarehouseId},${toWarehouseId}`
  const { stocks, loading } = useProductStocks(
    dataSource
      .map((row: any) => row.product_id)
      .filter(Boolean)
      .join(','),
    combinedWarehouseIds
  )
  const [fromQtyState, setFromQtyState] = useState<{ [key: number]: number }>(
    {}
  )

  const [toQtyState, setToQtyState] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    stocks.forEach((stock) => {
      const fromWarehouseStock = stock.stocks[fromWarehouseId]
      const toWarehouseStock = stock.stocks[toWarehouseId]

      const fromQty = fromWarehouseStock ? fromWarehouseStock.qty : 0
      const toQty = toWarehouseStock ? toWarehouseStock.qty : 0

      setFromQtyState((prev) => ({
        ...prev,
        [stock.id]: fromQty,
      }))

      setToQtyState((prev) => ({
        ...prev,
        [stock.id]: toQty,
      }))
    })
  }, [stocks, fromWarehouseId, toWarehouseId])
  useEffect(() => {
    if (transferData) {
      const initialDataSource = sumberData.map((item: any, index: number) => ({
        key: index,
        product_id: item.product_id,
        product_name: item.product_name,
        qty_minta: item.qty_minta,
        unit_name: item.unit_name,
        before_qty_dari: item.before_qty_dari,
        before_qty_tujuan: item.before_qty_tujuan,
        transferQty: 0,
        code: 2,
      }))
      setDataSource(initialDataSource)
    }
  }, [transferData])

  const generateSerialNumber = (productId: number): string => {
    const fromQty = fromQtyState[productId] || 0
    const toQty = toQtyState[productId] || 0

    return `${fromQty}**${toQty}`
  }
  const today = new Date()
  const formattedDate = today.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  //hapus
const idayok = 16765
  const { getIdAtMutation } = useIdMutation(ref_number || '')
  console.log({getIdAtMutation})
  const invoiceId = getIdAtMutation ? getIdAtMutation.id : null

  const refNumber = getIdAtMutation ? getIdAtMutation.ref_number : null

  const getDetailMutasiQuery = transferArray?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  // console.log({ getDetailMutasiQuery })

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  )
  const IdYangAkanDiDelete = getDetailMutasiQuery?.id
  const memo = getDetailMutasiQuery?.memo
  // console.log({ memo })

  const anjing = useDeleteMutation(selectedInvoiceId ?? 0)
  const deleteMutasiMutation = useDeleteMutasiMutation()

  const handleDelete = () => {
    if (IdYangAkanDiDelete) {
      setSelectedInvoiceId(IdYangAkanDiDelete)

      if (ref_number) {
        deleteMutasiMutation.mutate(ref_number as any, {
          onSuccess: () => {},
          onError: (error) => {},
        })
      }
    }
  }

  useEffect(() => {
    if (anjing) {
      setSelectedInvoiceId(null)
    }
  }, [anjing])
  const navigate = useNavigate()

  const handleEditClick = () => {
    navigate(`/editmutasi/${refNumber}`)
  }

  const columns = [
    {
      title: 'Nomor',
      key: 'stok_terakhir',
      render: (text: any, record: any) => (
        <>
          <div>
            D{record.before_qty_tujuan}K{record.before_qty_dari}
          </div>
        </>
      ),
    },
    {
      title: 'Item',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },

    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },

    // {
    //   title: 'Sat',
    //   dataIndex: 'unit_name',
    //   key: 'unit_name',
    // },
  ]

  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  return (
    <div
      ref={componentRef}
      className="printable-component"
      style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        width: '800px',
        margin: '0 auto',
      }}
    >
      <div ref={componentRef} className="print-container">
        <Title level={3} style={{ textAlign: 'center' }}>
          <span style={{ color: '#AF8700', fontSize: '28px' }}>
            {'SURAT JALAN MUTASI'}
          </span>
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
                    <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                      No. Inv
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text
                      strong
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    >
                      : {transfer.ref_number}
                    </Text>
                  </Col>
                  <Col
                    span={6}
                    style={{ textAlign: 'center', fontSize: '18px' }}
                  >
                    <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                      Dari
                    </Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                      Tanggal PO
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text
                      strong
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    >
                      : {formattedTransDate}
                    </Text>
                  </Col>

                  <Col
                    span={6}
                    style={{ textAlign: 'center', fontSize: '18px' }}
                  >
                    <Text
                      strong
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    >
                      {fromWarehouseName}
                    </Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                      Tanggal Print
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text
                      strong
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    >
                      : {formattedDate}
                    </Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                      Alamat Peminta
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text
                      strong
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    >
                      : {fromWarehouseCode || '-'} {noContact || '-'}
                    </Text>
                  </Col>

                  <Col
                    span={6}
                    style={{ textAlign: 'center', fontSize: '18px' }}
                  >
                    <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                      Kepada
                    </Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                      Ket
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text
                      strong
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    >
                      : {memo}
                    </Text>
                  </Col>
                  <Col
                    span={6}
                    style={{ textAlign: 'center', fontSize: '18px' }}
                  >
                    <Text
                      strong
                      style={{ textAlign: 'center', fontSize: '18px' }}
                    >
                      {toWarehouseName}
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Table
              dataSource={sumberData}
              columns={columns as any}
              rowKey="_id"
              pagination={false}
              bordered
              style={{ marginTop: 20, fontSize: '18px' }}
              components={{
                header: {
                  cell: ({
                    children,
                    ...restProps
                  }: React.ThHTMLAttributes<HTMLTableHeaderCellElement> & {
                    children: React.ReactNode
                  }) => (
                    <th
                      {...restProps}
                      style={{
                        padding: '4px 8px',
                        fontSize: '18px',
                        lineHeight: '1.2',
                        textAlign: 'center',
                      }}
                    >
                      {children}
                    </th>
                  ),
                },
                body: {
                  row: ({
                    children,
                    ...restProps
                  }: React.HTMLAttributes<HTMLTableRowElement> & {
                    children: React.ReactNode
                  }) => (
                    <tr
                      {...restProps}
                      style={{ lineHeight: '1.2', padding: '4px 8px' }}
                    >
                      {children}
                    </tr>
                  ),
                  cell: ({
                    children,
                    ...restProps
                  }: React.TdHTMLAttributes<HTMLTableDataCellElement> & {
                    children: React.ReactNode
                  }) => (
                    <td
                      {...restProps}
                      style={{ padding: '4px 8px', fontSize: '18px' }}
                    >
                      {children}
                    </td>
                  ),
                },
              }}
            />
            <br />

            <div className="print-message">
              <Row
                style={{
                  marginTop: '0px',
                  paddingTop: '1px',
                  fontSize: '18px',
                }}
              >
                <Col span={24}>
                  <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                    Pesan: Barang sudah sesuai dengan jumlah fisik yang
                    diterima.
                  </Text>
                </Col>
              </Row>

              <Row
                // className="print-message"
                justify="space-between"
                style={{
                  marginTop: '32px',
                  textAlign: 'center',
                  fontSize: '18px',
                }}
              >
                <Col span={8}>
                  <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                    Diperiksa Oleh
                  </Text>
                  <br />
                  <br />
                  <Text>(...................................)</Text>
                </Col>
                <Col span={8}>
                  <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                    Diterima Oleh
                  </Text>
                  <br />
                  <br />
                  <Text>(...................................)</Text>
                </Col>
                <Col span={8}>
                  <Text style={{ textAlign: 'center', fontSize: '18px' }}>
                    Pengirim
                  </Text>
                  <br />
                  <br />
                  <Text>(...................................)</Text>
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>
      <br />

      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className="no-print" // Add this class
            onClick={handlePrint}
            style={{
              color: '#AF8700',
              borderColor: '#AF8700',
              fontSize: '18px',
            }}
          >
            Print Surat Jalan
          </Button>
        </div>
      </div>
      <br />
      <br />
      <div
        style={{
          display: 'flex',

          marginTop: '20px',
          marginRight: '10px',
        }}
      >
        {/* <Button
          style={{ marginRight: '20px' }}
          className="no-print"
          danger
          onClick={handleDelete}
          loading={deleteMutasiMutation.isLoading}
        >
          Delete
        </Button>
        <Button type="primary" onClick={handleEditClick} className="no-print">
          Edit Mutasi
        </Button> */}
      </div>
    </div>
  )
}
export default SudahDivalidasi
