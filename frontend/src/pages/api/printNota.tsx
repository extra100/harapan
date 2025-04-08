import React, { forwardRef, useEffect, useState } from 'react'
import { Typography, Divider, Table, Row, Col } from 'antd'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import { useParams } from 'react-router-dom'
import {
  useGetGudangByIdQuery,
  useGetWarehousesQuery,
} from '../../hooks/warehouseHooks'
import {
  useGetContactsQuery,
  useGetContactsQuerysa,
  useGetPelangganByIdQuery,
} from '../../hooks/contactHooks'
import { useGetBarangByIdQuery } from '../../hooks/barangHooks'
import { formatDate } from './FormatDate'
import { useGetReturnByIdQuery } from '../../hooks/returnHooks'

const { Title, Text } = Typography

const Receipt = forwardRef<HTMLDivElement>((props, ref) => {
  const { ref_number } = useParams<{ ref_number?: string }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const idPelanggan = getPosDetail?.contacts?.[0]?.id;
  const { data: contacts } = useGetContactsQuery()
  const namaPelanggan = contacts?.find(
    (contact: any) => contact._id === idPelanggan
  )?.name;

  const [contactName, setContactName] = useState<string>('Unknown Contact')



  const witholdings = getPosDetail?.witholdings || []
  const barangName = getPosDetail?.items?.[0]?.name

  // const contactName = getPosDetail?.contacts?.[0]?.name
  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const namaKontak = getPosDetail?.contacts?.[0]?.name
  const idKontakku = getPosDetail?.contacts?.[0]?.id

  const tglTransaksi = getPosDetail?.trans_date ?? 0
  const tglJatuhTempo = getPosDetail?.due_date ?? 0
  const refNumber = getPosDetail?.ref_number ?? 0
  const jumlahBayar = getPosDetail?.down_payment ?? 0
  const totalSemua = getPosDetail?.amount ?? 0
  const ketPelanggan = getPosDetail?.message ?? 0
  //
  const { data: gudang } = useGetWarehousesQuery()

  const getGudangDetail = gudang?.find(
    (gedung: any) => gedung.name === gudangName
  )

  const totalDownPayment = witholdings
    .filter((witholding: any) => witholding.status === 0)
    .reduce((total: number, witholding: any) => {
      return total + (witholding.down_payment || 0)
    }, 0)

  const namaGudang = getGudangDetail?.name ?? 0

  const codeGudang = getGudangDetail?.code ?? 0
  const photoGudang = getGudangDetail?.photo ?? 0
  const contactGudang = getGudangDetail?.contact ?? 0
  const namaTag = getPosDetail?.tages?.[1]?.name

  const { data: pelanggans } = useGetPelangganByIdQuery(name as unknown)
  const getPelangganDetil = pelanggans?.find(
    (gedung: any) => gedung.name === contactName
  )

  //
  const { data: barangs } = useGetBarangByIdQuery(name as unknown)
  const getDetailDetil = barangs?.find(
    (gedung: any) => gedung.name === barangName
  )

  const { data: allreturns } = useGetReturnByIdQuery(ref_number as string)
  const getReturDetail = allreturns?.filter(
    (balikin: any) =>
      balikin.memo === ref_number && 
      balikin.items?.some((item: any) => item.qty > 0)
  );
  // console.log({getReturDetail})
  const totalAmountRetur = getReturDetail
  ?.flatMap((balikin: any) => balikin.items || []) 
  .reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;



const totalSetelahRetur = totalSemua - totalAmountRetur 
const sisaTagohan = totalSetelahRetur - totalDownPayment

  useEffect(() => {
    if (allTransactions && contacts) {
      const contactId = getPosDetail?.contacts?.[0]?.id
      const contact = contacts.find((c: any) => c.id === contactId)
      if (contact) {
        setContactName(contact.name)
      }
    }
  }, [allTransactions, contacts])
  const roundUpIndonesianNumber = (value: any): string => {
    let numberValue: number

    if (typeof value === 'string') {
      numberValue = parseFloat(value.replace(/\./g, '').replace(',', '.'))
    } else {
      numberValue = value
    }

    const rounded = Math.ceil(numberValue)

    return rounded.toLocaleString('id-ID')
  }

  const { data: contactjir } = useGetContactsQuerysa(idKontakku as any)
  const kontakringan = contactjir?.[0]?.name
  const alamatPelanggan = contactjir?.[0]?.address
  const telponPelanggan = contactjir?.[0]?.phone ?? 0
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
        return inv && item ? `Qt${item.qty_update}` : ''
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
    {
      title: 'Harga',
      key: 'amountPerBaris',
      align: 'left',
      render: (record: any) => {
        const amount = record.amount || 0
        const qty = record.qty || 1 // Pastikan qty tidak nol
        const amountPerBaris = qty > 0 ? amount / qty : 0
        return (
          <div style={{ textAlign: 'left' }}>
            {roundUpIndonesianNumber(amountPerBaris)}
          </div>
        )
      },
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

  return (
    <div
      ref={ref} // Attach the ref here for printing
      style={{
        padding: 20,
        maxWidth: 750,
        background: '#fff',
        marginLeft: '20px',
        marginRight: '20px',
        marginTop: '10px',
        marginBottom: '10px',
      }}
    >
      <Row justify="center" align="middle">
        <Col span={6} style={{ textAlign: 'left' }}>
          {photoGudang && (
            <img
              src={photoGudang}
              alt="Gudang"
              style={{ width: '57%', height: '57%' }}
            />
          )}
        </Col>

        <Col span={18}>
          <Text style={{ textAlign: 'left', fontSize: '30px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {namaGudang}
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
          <span
            style={{
              fontSize: '18px',
            }}
          >
            Pelanggan: {namaPelanggan}
          </span>
        </Col>
        <Col span={12} style={{ textAlign: 'right', fontSize: '18px' }}>
          <span>{refNumber}</span>
        </Col>

        <Col span={12} style={{ textAlign: 'left' }}>
          <span
            style={{
              fontSize: '18px',
            }}
          >
            {alamatPelanggan &&
            alamatPelanggan !== '-' &&
            telponPelanggan &&
            telponPelanggan !== '-'
              ? `${alamatPelanggan} - ${telponPelanggan}`
              : ketPelanggan}
          </span>
        </Col>

        <Col span={12} style={{ textAlign: 'right' }}>
          <span
            style={{
              fontSize: '18px',
            }}
          >
            Tgl. Trans: {formatDate(tglTransaksi as any)}
          </span>
        </Col>
        <Col span={12} style={{ textAlign: 'left' }}>
          <span
            style={{
              fontSize: '18px',
            }}
          >
            Sales: {namaTag}
          </span>
        </Col>

        <Col span={12} style={{ textAlign: 'right' }}>
          <span
            style={{
              fontSize: '18px',
            }}
          >
            Tgl. Jatuh Tempo: {formatDate(tglJatuhTempo as any)}
          </span>
        </Col>
      </Row>

      <Table
        columns={columns as any}
        // dataSource={getPosDetail?.items || []}
        dataSource={[
          ...(getPosDetail?.items || []),
          ...(getReturDetail
            ?.flatMap((retur: any) =>
              retur.items?.map((item: any) => ({
                ...item,
                isRetur: true, // Tambahkan penanda untuk item dari getReturDetail
              })) || []
            )
            .filter((item: any) => item.qty > 0) || []),
        ]}
        rowClassName={(record: any) => (record.isRetur ? 'yellow-row' : '')} // Beri kelas jika isRetur true

        pagination={false}
        style={{ marginTop: 20, marginBottom: 20 }}
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
                  fontSize: '20px',
                  borderBottom: '1px dashed #000',
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
                style={{
                  lineHeight: '1.2',
                  padding: '4px 8px',
                  fontSize: '18px',

                  borderBottom: '1px dashed #000', 
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
                style={{
                  padding: '4px 8px',
                  borderBottom: '1px dashed #000',
                }}
              >
                {children}
              </td>
            ),
          },
        }}
      />

      <Row style={{ marginRight: '20px' }}>
        <Col span={12}>
          <Text
            style={{
              fontSize: '18px',
            }}
          >
            Tanda Terima:
          </Text>
          <br />
          <Text></Text>
          <br />
          <Text
            style={{
              fontSize: '18px',
            }}
          >
            {kontakringan}
          </Text>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text
              strong
              style={{
                minWidth: '150px',
                textAlign: 'left',

                fontSize: '18px',
              }}
            >
              Total Tagihan:
            </Text>
            <Text
              strong
              style={{
                minWidth: '150px',
                textAlign: 'right',
                fontSize: '18px',
              }}
            >
              {roundUpIndonesianNumber(totalSemua)}
            </Text>
            
          </div>
          {totalAmountRetur !== 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: '3px',
                }}
              >
                <Text
                  strong
                  style={{
                    minWidth: '150px',
                    textAlign: 'left',
                    color: 'yellow',
                    fontSize: '18px',
                  }}
                >
                  Total Retur:
                </Text>
                <Text
                  strong
                  style={{
                    minWidth: '150px',
                    textAlign: 'right',
                    fontSize: '18px',
                  }}
                >
                  {roundUpIndonesianNumber(totalAmountRetur)}
                </Text>
              </div>
            )}


          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text
              strong
              style={{
                minWidth: '150px',
                textAlign: 'left',

                fontSize: '18px',
              }}
            >
              Jml Bayar:
            </Text>
            <Text strong style={{ minWidth: '150px', textAlign: 'right' }}>
              {witholdings
                .filter(
                  (witholding: any) =>
                    witholding.status === 0 && witholding.down_payment !== 0
                ) // Tambahkan pengecekan down_payment !== 0
                .map((witholding: any, index) => (
                  <Row key={index}>
                    <Col
                      span={12}
                      style={{ textAlign: 'left', fontSize: '18px' }}
                    ></Col>
                    <Col
                      span={12}
                      style={{ textAlign: 'right', fontSize: '18px' }}
                    >
                      <Text strong>
                        {roundUpIndonesianNumber(witholding.down_payment || 0)}
                      </Text>
                    </Col>
                  </Row>
                ))}
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text
              strong
              style={{ minWidth: '150px', textAlign: 'left', fontSize: '18px' }}
            >
              Total Bayar:
            </Text>
            <Text
              strong
              style={{
                minWidth: '150px',
                textAlign: 'right',
                fontSize: '18px',
              }}
            >
              {roundUpIndonesianNumber(totalSetelahRetur|| 0)}
            </Text>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text
              strong
              style={{ minWidth: '150px', textAlign: 'left', fontSize: '18px' }}
            >
              Sisa Tagihan:
            </Text>
            <Text
              strong
              style={{
                minWidth: '150px',
                textAlign: 'right',

                fontSize: '18px',
              }}
            >
              {roundUpIndonesianNumber(sisaTagohan < 0 ? 0 : sisaTagohan)}
            </Text>
          </div>
        </Col>
      </Row>

      <Divider />

      <Row justify="center">
        <Col span={24}>
          <Text
            style={{ display: 'block', textAlign: 'center', fontSize: '18px' }}
          >
            Terima Kasih
          </Text>
          <Text
            style={{ display: 'block', textAlign: 'center', fontSize: '18px' }}
          >
            Barang yang sudah dibeli tidak dapat dikembalikan
          </Text>
        </Col>
      </Row>
    </div>
  )
})

export default Receipt
