import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
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
} from 'antd'
import { useIdWarehouse } from './namaWarehouse'
import { useIdNamaBarang } from './NamaBarang'
import { useReactToPrint } from 'react-to-print'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useProductStocks } from './Po'
import { saveMutation } from './apiMutasi'
import UserContext from '../../contexts/UserContext'

const { Title, Text } = Typography

const WarehouseTransferDetail: React.FC = () => {
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
  const items = transfer.items || []

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
    console.log({noContact})
  const [title, setTitle] = useState('TRANSFER . . . ')

  useEffect(() => {
    if (String(transfer.to_warehouse_name) === 'EXTRA TRUSS') {
      setTitle('TRANSFER GUDANG')
    } else {
      setTitle('TRANSFER PO')
    }
  }, [transfer.to_warehouse_name])

  const [transferQty, setTransferQty] = useState<number[]>([])
  console.log({ transferQty })
  const handleTransferQtyChange = (value: number, index: number) => {
    setTransferQty((prevTransferQty) => {
      const updatedTransferQty = [...prevTransferQty]
      updatedTransferQty[index] = value
      return updatedTransferQty
    })
  }

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
      const initialDataSource = items.map((item: any, index: number) => ({
        key: index,
        product_id: item.product_id,
        product_name: item.product_name,
        qty_minta: item.qty_minta,
        unit_name: item.unit_name,
        code: item.code,
        transferQty: 0,
      }))
      setDataSource(initialDataSource)
    }
  }, [transferData])

  console.log({ dataSource })

  const { mutate: addWarehouseTransfer } = useAddWarehouseTransferMutation()

  const generateSerialNumber = (productId: number): string => {
    const fromQty = fromQtyState[productId] || 0
    const toQty = toQtyState[productId] || 0

    return `D${fromQty}K${toQty}`
  }
  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'serial_number',
      key: 'serial_number',
      align: 'center',
      render: (_: any, record: any) => {
        const serialNumber = generateSerialNumber(record.product_id)
        return <div style={{ textAlign: 'center' }}>{serialNumber}</div>
      },
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
      align: 'center',
      render: (text: string) => (
        <div style={{ textAlign: 'center' }}>{text}</div>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
      align: 'center',
      render: (text: number) => (
        <div style={{ textAlign: 'center' }}>{text}</div>
      ),
    },

    idOutletLoggedIn === fromWarehouseName
      ? {
          title: 'Jumlah TF',
          dataIndex: 'transferQty',
          key: 'transferQty',
          render: (text: string, record: any, index: number) => (
            <Input
              type="number"
              value={transferQty[index] || 0}
              onChange={(e) =>
                handleTransferQtyChange(Number(e.target.value), index)
              }
            />
          ),
        }
      : null,
  ].filter(Boolean)

  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        width: '800px',
        margin: '0 auto',
      }}
    >
      <div ref={componentRef} className="print-container">
        <Title level={3} style={{ textAlign: 'center' }}>
          <span style={{ color: '#AF8700', fontSize: '20px' }}>
            {'PURCHASE ORDER'}
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
                    <Text>No</Text>
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
                    <Text>Tanggal</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>: {transfer.trans_date}</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text strong>{fromWarehouseName}</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Alamat Peminta</Text>
                  </Col>
                  <Col span={12}>
                    <Text italic>: {fromWarehouseCode} {noContact}</Text>
                  </Col>

                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text>Kepada</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Ket</Text>
                  </Col>
                  <Col span={12}>
                    <Text>: -</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text strong>{toWarehouseName}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Table
              dataSource={items}
              columns={columns as any}
              rowKey="_id"
              pagination={false}
              style={{ marginBottom: '20px' }}
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
                        fontSize: '16px',
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
                      style={{ padding: '4px 8px', fontSize: '14px' }}
                    >
                      {children}
                    </td>
                  ),
                },
              }}
            />

              <>
                {/* <Row
                  style={{
                    marginTop: '0px',
                    paddingTop: '1px',
                  }}
                >
                  <Col span={24}>
                    <Text>
                      Pesan: Barang sudah sesuai dengan jumlah fisik yang
                      diterima.
                    </Text>
                  </Col>
                </Row> */}

                {/* <Row
                  justify="space-between"
                  style={{ marginTop: '32px', textAlign: 'center' }}
                >
                  <Col span={8}>
                    <Text>Diperiksa Oleh</Text>
                    <br />
                    <br />
                    <Text>(...................................)</Text>
                  </Col>
                  <Col span={8}>
                    <Text>Diterima Oleh</Text>
                    <br />
                    <br />
                    <Text>(...................................)</Text>
                  </Col>
                  <Col span={8}>
                    <Text>Pengirim</Text>
                    <br />
                    <br />
                    <Text>(...................................)</Text>
                  </Col>
                </Row> */}

                <div style={{ textAlign: 'right' }}>
                  <Button
                    type="dashed"
                    onClick={handlePrint}
                    style={{
                      marginBottom: '16px',
                      backgroundColor: '#AF8700',
                      borderColor: '#AF8700',
                      color: '#ffffff',
                      width: '300px',
                    }}
                  >
                    Print
                  </Button>
                </div>
              </>
          
          </>
        )}
      </div>
    </div>
  )
}
export default WarehouseTransferDetail
