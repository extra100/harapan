import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  message,
  Tooltip,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useIdNamaBarang } from './NamaBarang'
import { useIdWarehouse } from './namaWarehouse'
import { useProductStocks } from './Po'
import UserContext from '../../contexts/UserContext'
import { useAddWarehouseTransferMutation } from '../../hooks/pindahHooks'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { useIdProduct } from './SingleProduct'
import { useGetProductsQuery } from '../../hooks/productHooks'
import { saveMutation } from './apiMutasi'
import SingleDate from '../SingleDate'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

const { Option } = Select

const ProductStocksPage: React.FC = () => {
  const [productIdInput, setProductIdInput] = useState<string>('')
  const { error, success, saveInvoiceMutasi } = saveMutation()

  const { idProduct } = useIdProduct(productIdInput)
  const navigate = useNavigate()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  // const generateShortInvoiceId = (idOutlet: string): string => {
  //   const uuid = uuidv4()
  //   const last4OfUUID = uuid.substr(uuid.length - 4)
  //   const shortNumber = parseInt(last4OfUUID, 16) % 10000
  //   return `IPO-${idOutlet}-${String(shortNumber).padStart(4, '0')}`
  // }
  const generateShortInvoiceId = (idOutlet: string): string => {
    const uuid = uuidv4()
    const timestamp = Date.now()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000

    return `IPO-${idOutlet}-${timestamp}-${String(shortNumber).padStart(
      5,
      '0'
    )}`
  }
  const [refNumber, setRefNumber] = useState<string>('')

  useEffect(() => {
    if (user) {
      setWarehouseDariId(user.id_outlet)

      const newRefNumber = generateShortInvoiceId(user.id_outlet)
      setRefNumber(newRefNumber)
    }
  }, [user])
  const { data: gudangs } = useGetoutletsQuery()

  const [warehouseDariId, setWarehouseDariId] = useState<string>('')

  const [warehouseTujuanId, setWarehouseTujuanId] = useState<string>('')

  const [dataSource, setDataSource] = useState<any[]>([])

  const { idWarehouse } = useIdWarehouse()
  console.log({ gudangs })
  console.log({ warehouseTujuanId })

  const [warehouseName, setWarehouseName] = useState<string>('')
  console.log({ warehouseName })

  useEffect(() => {
    if (gudangs && warehouseTujuanId) {
      const warehouse = gudangs.find(
        (transfer: any) => transfer.id_outlet === String(warehouseTujuanId)
      )
      setWarehouseName(warehouse?.nama_outlet || '')
    }
  }, [gudangs, warehouseTujuanId])
  const getWarehouseNameById = (id: any) => {
    const warehouse = idWarehouse.find((w) => w.id === id)
    return warehouse ? warehouse.name : 'Unknown Warehouse'
  }

  const handleWarehouseSelection = (id: any) => {
    const name = getWarehouseNameById(id)
    setWarehouseName(name)
  }

  const { data: idaDataBarang } = useGetProductsQuery()

  const getProductName = (id: any) => {
    const barang = idaDataBarang?.find((w) => w.id === id)
    return barang ? barang.name : 'Unknown Warehouse'
  }
  const combinedWarehouseIds = `${warehouseDariId},${warehouseTujuanId}`
  const { stocks, loading } = useProductStocks(
    dataSource
      .map((row) => row.id)
      .filter(Boolean)
      .join(','),
    combinedWarehouseIds
  )

  const { mutate: addWarehouseTransfer } = useAddWarehouseTransferMutation()

  useEffect(() => {
    if (user) {
      setWarehouseDariId(user.id_outlet)
    }
  }, [user])
  const [unitName, setUnitName] = useState<string>('')
  const handleProductChange = (id: any, key: any) => {
    const selectedProduct = idaDataBarang?.find((product) => product.id === id)

    if (selectedProduct) {
      const productName = selectedProduct.name
      const unitName = selectedProduct.unit?.name || 'N/A'
      setUnitName(unitName)

      setDataSource((prevDataSource) =>
        prevDataSource.map((row) =>
          row.key === key
            ? {
                ...row,
                id: id || '',
                name: productName,
                unit: unitName,
              }
            : row
        )
      )
    }
  }

  const handleWarehouseDariChange = (value: string) => {
    setWarehouseDariId(value)
  }

  const handleWarehouseTujuanChange = (value: string) => {
    setWarehouseTujuanId(value)
  }
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(false)

  const handleTransferQtyChange = (value: number, key: number) => {
    setDataSource((prevDataSource) =>
      prevDataSource.map((row) =>
        row.key === key ? { ...row, transferQty: value } : row
      )
    )

    const productStock = stocks.find(
      (stock: any) => String(stock.id) === String(dataSource[key].id)
    )
    // const qtyTujuanValue = productStock?.stocks?.[warehouseTujuanId]?.qty || 0

    // if (value > qtyTujuanValue) {
    //   message.warning(
    //     'Jumlah transfer tidak boleh lebih besar dari stok tujuan.'
    //   )
    //   setIsSaveDisabled(true)
    // } else {
    //   setIsSaveDisabled(false)
    // }
  }

  const addRow = () => {
    setDataSource([
      ...dataSource,
      {
        key: dataSource.length,
        id: '',
        stok_terkini: '',
        transferQty: 0,
      },
    ])
  }

  const removeRow = (key: number) => {
    setDataSource(dataSource.filter((row) => row.key !== key))
  }
  const [qtyDari, setQtyDari] = useState<number | null>(null)

  const [qtyTujuan, setQtyTujuan] = useState<number | null>(null)
  const [title, setTitle] = useState('PENGAJUAN PO . . . ')

  useEffect(() => {
    if (String(warehouseTujuanId) === '2') {
      setTitle(`PENGAJUAN PO GUDANG KE ${warehouseName}`)
    } else {
      setTitle(`PENGAJUAN PO OUTLET KE ${warehouseName}`)
    }
  }, [warehouseTujuanId, warehouseName])

  const isSaveDisabledED = dataSource.some((row) => !row.id || row.id === '')

  const columns = [
    {
      title: 'Barang',
      dataIndex: 'id',
      key: 'id',
      render: (id: any, record: any) => (
        <Select
          showSearch
          placeholder="Barang"
          style={{ width: '320px' }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toString()
              ? option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
          onChange={(value) => {
            // Cek apakah ID yang dipilih sudah ada di dataSource
            const isDuplicate = dataSource.some((row) => row.id === value)

            if (isDuplicate) {
              message.warning('BARANG INI SUDAH DIPILIH!')
              return // Jangan lanjutkan jika ID sama
            }

            handleProductChange(value, record.key)
          }}
          value={id}
        >
          {idaDataBarang?.map((product) => (
            <Option key={product.id} value={product.id}>
              {product.name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: 'Name Outlet',
      dataIndex: 'stok_terkini',
      key: 'stok_terkini',
      render: (_: any, record: any) => {
        return (
          <>
            <div>
              <span>{user?.name}</span>
            </div>
            <div>
              <span>{getWarehouseNameById(warehouseTujuanId)}</span>
            </div>
          </>
        )
      },
    },
    {
      title: 'Stok Awal',
      dataIndex: 'stok_terkini',
      key: 'stok_terkini',
      render: (_: any, record: any) => {
        const productStock = stocks.find(
          (stock: any) => String(stock.id) === String(record.id)
        )
        const qtyDariValue = productStock?.stocks?.[warehouseDariId]?.qty || 0
        const qtyTujuanValue =
          productStock?.stocks?.[warehouseTujuanId]?.qty || 0

        setQtyDari(qtyDariValue)
        setQtyTujuan(qtyTujuanValue)

        return (
          <>
            <div>
              <span>{qtyDariValue}</span>
            </div>
            <div>
              <span>{qtyTujuanValue}</span>
            </div>
          </>
        )
      },
    },
    {
      title: 'Qty',
      dataIndex: 'transferQty',
      key: 'transferQty',
      render: (_: any, record: any) => (
        <Input
          type="number"
          value={record.transferQty}
          onChange={(e) =>
            handleTransferQtyChange(Number(e.target.value), record.key)
          }
        />
      ),
    },
    {
      title: 'Stok Terkini',
      dataIndex: 'qtySetelahnya',
      key: 'qtySetelahnya',
      render: (_: any, record: any) => {
        const productStock = stocks.find(
          (stock) => String(stock.id) === String(record.id)
        )
        const qtyDaris = productStock?.stocks?.[warehouseDariId]?.qty || 0
        const qtyTujuans = productStock?.stocks?.[warehouseTujuanId]?.qty || 0

        const qtyDariAfter = qtyDaris + (record.transferQty || 0)
        const qtyTujuanAfter = qtyTujuans - (record.transferQty || 0)

        return (
          <>
            <div>
              <span>{qtyDariAfter >= 0 ? qtyDariAfter : 0}</span>
            </div>
            <div>
              <span>{qtyTujuanAfter}</span>
            </div>
          </>
        )
      },
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: any) => (
        <Button danger onClick={() => removeRow(record.key)}>
          &times;
        </Button>
      ),
    },
  ]

  const onFinish = async (values: any) => {
    const fromWarehouseName = getWarehouseNameById(warehouseDariId)
    const toWarehouseName = getWarehouseNameById(warehouseTujuanId)
    const namaBarang = getProductName(productIdInput)
    const transferData = {
      from_warehouse_id: warehouseDariId,
      to_warehouse_id: warehouseTujuanId,
      // from_warehouse_name: fromWarehouseName,
      // to_warehouse_name: toWarehouseName,
      eksekusi: '1',
      trans_date: selectedDates,
      id: 111,
      ref_number: refNumber,
      code: 1,
      memo: null,
      items: dataSource.map((row) => ({
        product_id: row.id || '',
        finance_account_id: row.id || '',
        product_name: row.name,
        qty: 0,
        qty_minta: row.transferQty,
        before_qty_dari: qtyDari,
        before_qty_tujuan: qtyTujuan,
        unit_name: unitName,
        code: 1,
        id: 222,
      })),
    }

    try {
      await addWarehouseTransfer(transferData as any)
      message.success('Data transfer berhasil disimpan!')
      // navigate(`/listpindah`)
      navigate(`/transfer-detail/${refNumber}`)
    } catch (error) {
      message.error('Terjadi kesalahan saat menyimpan data transfer')
      console.error('Error:', error)
    }
  }
  const [selectedDates, setSelectedDates] = useState<string>()

  const handleDateRangeSave = (startDate: string) => {
    setSelectedDates(startDate)
  }
  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }
  return (
    <div style={{ maxWidth: '100%', margin: '20px auto' }}>
      <Card
        title={
          <span style={{ color: '#AF8700', fontSize: '20px' }}> {title}</span>
        }
        style={{ boxShadow: '0px 0px 10px rgba(4, 49, 343, 324.1)' }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                label="Dari"
                rules={[{ required: true }]}
                initialValue={user?.id_outlet}
              >
                <Select
                  placeholder="Pilih Outlet"
                  onChange={handleWarehouseDariChange}
                  value={warehouseDariId}
                  disabled={!user?.isAdmin}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toString()
                      ? option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      : false
                  }
                >
                  {idWarehouse?.map((warehouse) => (
                    <Option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-md-6">
              <Form.Item
                name="TUJUAN"
                label="TUJUAN"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Pilih Outlet"
                  onChange={handleWarehouseTujuanChange}
                  value={warehouseDariId}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toString()
                      ? option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      : false
                  }
                >
                  {idWarehouse?.map((warehouse) => (
                    <Option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Form>
                <Form.Item>
                  <SingleDate
                    onChange={(dates) => {
                      setSelectedDates(dates)
                    }}
                    onSave={handleDateRangeSave}
                  />
                </Form.Item>
              </Form>
            </div>
            <div className="col-md-6">
              <Form.Item label="Nomor">
                <Input value={refNumber} readOnly />
              </Form.Item>
            </div>
          </div>
          <Form.Item name="referensi" label="Pesan" hidden>
            <Input placeholder="Pesan" />
          </Form.Item>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            footer={() => (
              <Button
                style={{
                  marginBottom: '3px',
                  backgroundColor: '#ffffff',
                  borderColor: '#AF8700',
                  color: '#AF8700',
                  width: '300px',
                }}
                type="dashed"
                onClick={addRow}
                icon={<PlusOutlined />}
              >
                Tambah Baris
              </Button>
            )}
          />
          <br />

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Form.Item>
                <Tooltip
                  title={isSaveDisabledED ? 'MOHON BARANG DIPERIKSA' : ''}
                  overlayInnerStyle={{
                    color: 'red',
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                >
                  <Button
                    type="dashed"
                    htmlType="submit"
                    style={{
                      marginBottom: '16px',
                      backgroundColor: '#ffffff',
                      borderColor: '#AF8700',
                      color: '#AF8700',
                      width: '300px',
                    }}
                    disabled={isSaveDisabledED}
                  >
                    SIMPAN PENGAJUAN PEMESANAN
                  </Button>
                </Tooltip>
              </Form.Item>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ProductStocksPage
