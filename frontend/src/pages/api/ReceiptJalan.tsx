import React, { forwardRef, useEffect, useState } from 'react'
import { Typography, Divider, Table, Row, Col } from 'antd'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import { useParams } from 'react-router-dom'
import { useGetGudangByIdQuery } from '../../hooks/warehouseHooks'
import {
  useGetContactsQuery,
  useGetContactsQuerysa,
  useGetPelangganByIdQuery,
} from '../../hooks/contactHooks'
import { useGetBarangByIdQuery } from '../../hooks/barangHooks'

const { Title, Text } = Typography

const ReceiptJalan = forwardRef<HTMLDivElement>((props, ref) => {
  const { ref_number } = useParams<{ ref_number?: string }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const [contactName, setContactName] = useState<string>('Unknown Contact')

  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const barangName = getPosDetail?.items?.[0]?.name
  const namaKontak = getPosDetail?.contacts?.[0]?.name
  const idKontakku = getPosDetail?.contacts?.[0]?.id

  // const contactName = getPosDetail?.contacts?.[0]?.name
  const gudangName = getPosDetail?.warehouses?.[0]?.name

  const tglTransaksi = getPosDetail?.trans_date ?? 0
  const refNumber = getPosDetail?.ref_number ?? 0
  const jumlahBayar = getPosDetail?.down_payment ?? 0
  const totalSemua = getPosDetail?.amount ?? 0
  const piutang = getPosDetail?.due ?? 0
  //
  const { data: gudang } = useGetGudangByIdQuery(name as unknown)
  const getGudangDetail = gudang?.find(
    (gedung: any) => gedung.name === gudangName
  )
  const namaGudang = getGudangDetail?.name ?? 0
  const codeGudang = getGudangDetail?.code ?? 0
  const photoGudang = getGudangDetail?.photo ?? 0
  const contactGudang = getGudangDetail?.contact ?? 0

  const { data: pelanggans } = useGetPelangganByIdQuery(name as unknown)
  const getPelangganDetil = pelanggans?.find(
    (gedung: any) => gedung.name === contactName
  )
  // const alamatPelanggan = getPelangganDetil?.address ?? 0
  // const telponPelanggan = getPelangganDetil?.phone ?? 0
  const ketPelanggan = getPosDetail?.message ?? 0
  //
  const { data: contactjir } = useGetContactsQuerysa(idKontakku as any)
  const kontakringan = contactjir?.[0]?.name ?? 0
  const alamatPelanggan = contactjir?.[0]?.address
  const telponPelanggan = contactjir?.[0]?.phone ?? 0

  //
  const { data: barangs } = useGetBarangByIdQuery(name as unknown)
  const getDetailDetil = barangs?.find(
    (gedung: any) => gedung.name === barangName
  )
  const { data: contacts } = useGetContactsQuery()

  useEffect(() => {
    if (allTransactions && contacts) {
      const contactId = getPosDetail?.contacts?.[0]?.id
      const contact = contacts.find((c: any) => c.id === contactId)
      if (contact) {
        setContactName(contact.name)
      }
    }
  }, [allTransactions, contacts])

  const columns = [
    {
      title: 'No',
      key: 'qty_update',
      render: (text: any, record: any) => {
        const inv = allTransactions?.find(
          (transaction: any) => transaction.ref_number === ref_number
        )
        const item = inv?.items.find(
          (item: any) => item.finance_account_id === record.finance_account_id
        )
        return inv && item ? `Qt${item.qty_update}` : 'Qt'
      },
    },
    // {
    //   title: 'No',
    //   key: 'qty_update',
    //   render: (text: any, record: any) => {
    //     const barang = barangStok?.find(
    //       (barang: any) => barang.id === record.finance_account_id
    //     )
    //     return barang ? `Qt${barang.qty}` : ''
    //   },
    // },
    {
      title: 'Barang',
      dataIndex: 'name',
      key: 'name',
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
  ]

  return (
    <div
      ref={ref} // Attach the ref here for printing
      style={{
        padding: 15,
        maxWidth: 750,
        background: '#fff',
        marginLeft: '20px',
        marginRight: '6px',
        marginTop: '20px',
      }}
    >
      <Row justify="center" align="middle">
        <Col span={6} style={{ textAlign: 'left' }}>
          {photoGudang && (
            <img
              src={photoGudang}
              alt="Gudang"
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </Col>

        <Col span={18}>
          <Text style={{ textAlign: 'left', fontSize: '30px' }}>
            SURAT JALAN {namaGudang}
          </Text>
          <Text
            style={{ display: 'block', textAlign: 'left', fontSize: '18px' }}
          >
            {codeGudang}
          </Text>
          <Text
            style={{ display: 'block', textAlign: 'left', fontSize: '18px' }}
          >
            {contactGudang}
          </Text>
        </Col>
      </Row>

      {/* <Divider /> */}
      <br />
      <Row>
        <Col span={12}>
          <span style={{ fontSize: '18px' }}>Pelanggan: {kontakringan}</span>
        </Col>
        <Col span={12} style={{ textAlign: 'right', fontSize: '18px' }}>
          <span>{refNumber}</span>
        </Col>
        <Col span={12} style={{ textAlign: 'left', fontSize: '18px' }}>
          <span style={{ fontSize: '18px' }}>
            {alamatPelanggan &&
            alamatPelanggan !== '-' &&
            telponPelanggan &&
            telponPelanggan !== '-'
              ? `${alamatPelanggan} - ${telponPelanggan}`
              : ketPelanggan}
          </span>
        </Col>

        <Col span={12} style={{ textAlign: 'right', fontSize: '18px' }}>
          <span>{tglTransaksi}</span>
        </Col>
      </Row>

      <Table
        columns={columns as any}
        dataSource={getPosDetail?.items || []}
        pagination={false}
        bordered
        style={{ marginTop: 20, fontSize: '18px' }}
        components={{
          body: {
            row: ({
              children,
              ...restProps
            }: React.HTMLAttributes<HTMLTableRowElement> & {
              children: React.ReactNode
            }) => (
              <tr
                {...restProps}
                style={{
                  lineHeight: '1.2',
                  padding: '4px 8px',
                  fontSize: '18px',
                }}
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

      <Divider />

      <Row>
        <Col span={12}>
          <Text style={{ fontSize: '18px' }}>Tanda Terima:</Text>
          <br />
          <Text></Text>
          <br />
          <Text style={{ fontSize: '18px' }}>{kontakringan}</Text>
        </Col>
      </Row>

      <Divider />

      <Row justify="center">
        <Col span={24}>
          <Text style={{ display: 'block', textAlign: 'center' }}>
            Terima Kasih
          </Text>
          <Text style={{ display: 'block', textAlign: 'center' }}>
            Mohon Untuk Di Periksa Terlebih Dahulu
          </Text>
        </Col>
      </Row>
    </div>
  )
})
export default ReceiptJalan
