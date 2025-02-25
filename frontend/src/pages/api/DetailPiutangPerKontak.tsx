import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Table } from 'antd'

import { TakeInvoicesFromKledoBasedOnPelanggan } from '../TakeInvoicesFromKledoBasedOnPelanggan'
import { useGetContactsQuery } from '../../hooks/contactHooks'

import Warehouse from '../transaction/POS/warehouse'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import SingleDate from '../SingleDate'
import { formatDate, formatDateBulan } from './FormatDate'
import { useReactToPrint } from 'react-to-print'
import { TakePiutangToPerContactStatusIdAndMemoMny } from './TakePiutangToPerContactStatusIdAndMemoMny'


const DetailPiutangKontak = forwardRef<HTMLDivElement>((props, ref) => {
  const navigate = useNavigate()
  // const [contactId, setContactId] = useState<any | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)

  useEffect(() => {
    if (contactId) {
      console.log('contactId is updated:', contactId)
    }
  }, [contactId])
  const location = useLocation()
  const [filteredData, setFilteredData] = useState<any[]>([])
  console.log({ filteredData })

  const [aaa, setAaa] = useState<any[]>([])
  console.log({ aaa })
  const { takeInvoicesFromKledoBasedOnPelanggan } =
    TakeInvoicesFromKledoBasedOnPelanggan(contactId as any)
    const statusIds = '2,1' 

  const idToUse = contactId ? String(contactId) : 'default_id'
  const { loading, takedueanContactStatusIdandMemoMny } =
    TakePiutangToPerContactStatusIdAndMemoMny('MNY', statusIds, idToUse)
  console.log('bismillah 212', takedueanContactStatusIdandMemoMny)
  useEffect(() => {
    if (contactId && takedueanContactStatusIdandMemoMny?.length) {
      const filtered = takedueanContactStatusIdandMemoMny.filter(
        (nota: any) => nota.contact_id === contactId 
      )
      setAaa(filtered)
    }
  }, [contactId, takedueanContactStatusIdandMemoMny])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const id = searchParams.get('id')
    if (id) {
      const contactIdNumber = Number(id)
      if (!isNaN(contactIdNumber)) {
        setContactId(contactIdNumber as any)
      }
    }

    if (contactId && takeInvoicesFromKledoBasedOnPelanggan) {
      const filtered = takeInvoicesFromKledoBasedOnPelanggan.filter(
        (item: any) => item.contact?.id === contactId
      )

      const uniqueRefNumbers = filtered.reduce((acc: any[], current: any) => {
        if (!acc.some((item) => item.ref_number === current.ref_number)) {
          acc.push(current)
        }
        return acc
      }, [])

      setFilteredData(uniqueRefNumbers)
    }
  }, [location.search, takeInvoicesFromKledoBasedOnPelanggan, contactId])
  const { data: contacts } = useGetContactsQuery()
  const contactName = contacts?.find(
    (contact: any) => contact.id === contactId
  )?.name
  const contactAddress = contacts?.find(
    (contact: any) => contact.id === contactId
  )?.address


  const firstWarehouseId =
    takeInvoicesFromKledoBasedOnPelanggan.length > 0
      ? takeInvoicesFromKledoBasedOnPelanggan[0].warehouse_id
      : null
  const { data: gudangs } = useGetWarehousesQuery()

  const outletPelanggan = contacts?.find(
    (contact: any) => contact.id === contactId
  )?.outlet_name
  console.log({outletPelanggan})
  const filteredGudangs = gudangs?.filter((gudang) => {
    return gudang.name === outletPelanggan;
  });
  const filteredCodes = gudangs
  ?.filter((gudang) => gudang.name === outletPelanggan)
  .map((gudang) => gudang.code);
  const filteredNames = gudangs
  ?.filter((gudang) => gudang.name === outletPelanggan)
  .map((gudang) => gudang.name);
  const filteredTelpn = gudangs
  ?.filter((gudang) => gudang.name === outletPelanggan)
  .map((gudang) => gudang.contact);
  const filteredPhoto = gudangs
  ?.filter((gudang) => gudang.name === outletPelanggan)
  .map((gudang) => gudang.photo);

  const namaGudang = gudangs?.find(
    (contact: any) => contact.id === firstWarehouseId
  )?.name
  const alamatGudang = gudangs?.find(
    (contact: any) => contact.id === firstWarehouseId
  )?.code
  const telpolGudang = gudangs?.find(
    (contact: any) => contact.id === firstWarehouseId
  )?.contact

  const photoGudang = gudangs?.find(
    (contact: any) => contact.id === firstWarehouseId
  )?.photo

  const normalizedData = [
    ...takeInvoicesFromKledoBasedOnPelanggan.map((item) => ({
      ...item,
      amount: item.amount, 
    })),
    ...aaa.map((item) => ({
      ...item,
      amount: item.amount_after_tax, 
    })),
  ]
  const columns = [
 
    {
      title: 'Referensi',
      key: 'references',
      render: (text: any, record: any) => {
        let href = '';
        if (record.ref_number.startsWith('IBO') || record.ref_number.startsWith('UBI')) {
          href = `/detailkledo/${record.ref_number}`;
        } else if (record.ref_number.startsWith('MNY')) {
          href = `https://app.kledo.com/#/debit-memo/detail/${record.id}`;
        } else if (record.ref_number.startsWith('INV')) {
          href = `https://app.kledo.com/#/sales/invoices/detail/${record.id}`;
        }
    
        return (
          <div style={{ textAlign: 'left', width: '180px' }}>
            <a
              href={href}
              style={{ color: 'blue', textDecoration: 'none', fontSize: '10px' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {record.ref_number}
            </a>
          </div>
        );
      },
    },
    
    
    
    {
      title: 'Tgl. Trans',
      dataIndex: 'trans_date',
      key: 'trans_date',
      align: 'left',
      ellipsis: true,
      render: (value: any) => formatDate(value),
    },
    {
      title: 'Ket',
      key: 'dued',
      align: 'left',
      ellipsis: true,
      render: (_: any, record: { trans_date: string }) => {
        if (!record.trans_date) {
          return '-'
        }

        const currentDate = new Date()
        const transDate = new Date(record.trans_date)
        const dueDate = new Date(transDate.setMonth(transDate.getMonth() + 3))

        const timeDifference = dueDate.getTime() - currentDate.getTime()
        const daysDifference = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        )

        let description = ''

        if (daysDifference > 30) {
          description = `MP (${daysDifference} hari)`
        } else if (daysDifference <= 30 && daysDifference > 0) {
          description = `1 Bulan (${daysDifference} hari)`
        } else {
          description = `JT (${daysDifference} hari)`
        }

        return <div style={{ textAlign: 'left' }}>{description}</div>
      },
    },
    {
      title: 'Nilai Nota',
      dataIndex: 'amount',
      key: 'amount',
      ellipsis: true,
      align: 'right',

      render: (value: any) => {
        const validValue =
          !isNaN(value) && value !== null && value !== undefined
            ? Number(value)
            : 0
        return (
          <div style={{ textAlign: 'right' }}>
            {`${validValue.toLocaleString()}`}
          </div>
        )
      },
    },

    {
      title: 'Progress',
      key: 'progress',
      align: 'right',
      ellipsis: true,
      render: (_: any, record: { due: number; amount: number }) => {
        const due = Number(record.due) || 0
        const amount = Number(record.amount) || 0
        const progress = amount - due

        return (
          <div style={{ textAlign: 'right' }}>
            {`${progress.toLocaleString()}`}
          </div>
        )
      },
    },
    {
      title: 'Sisa Piutang',
      dataIndex: 'due',
      key: 'due',
      align: 'right',

      ellipsis: true,
      render: (value: any) => (
        <div style={{ textAlign: 'right' }}>
          {`${Number(value).toLocaleString()}`}
        </div>
      ),
    },
  ]

  const totalDue = filteredData.reduce((acc, item) => acc + item.due, 0)
  const today = new Date()
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const formattedDate = today.toLocaleDateString('id-ID', options)

  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  return (
    <div
      // style={{ width: '800px', margin: '0 auto', paddingRight: '20px' }}
      ref={componentRef}
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '13mm',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px dashed black',
        }}
      >
        <div
          style={{
            width: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {filteredPhoto ? (
            <img
              src={filteredPhoto as any}
              alt="Gudang"
              style={{
                maxWidth: 'auto',
                maxHeight: '100px',
                objectFit: 'cover',
              }}
            />
          ) : (
            <span>Photo Gudang</span>
          )}
        </div>

        <div
          style={{
            flex: 1,
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: '0px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginBottom: '0px',
            }}
          >
            <span
              style={{
                textAlign: 'center',
                fontSize: '40px',
                fontWeight: 'bold',
                width: '100%',
                wordBreak: 'break-word',
                marginBottom: '0px',
              }}
            >
              {namaGudang || filteredNames || 'Nama Gudang'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: '0px',
            }}
          >
            <span
              style={{
                textAlign: 'center',
                fontSize: '16px',
                marginTop: '0px',
                fontStyle: 'italic',

                width: '100%',
                wordBreak: 'break-word',
              }}
            >
              <div>{alamatGudang || filteredCodes || 'Alamat Outlet'}</div>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: '0px',
            }}
          >
            <span
              style={{
                textAlign: 'center',
                fontSize: '16px',
                width: '100%',
                wordBreak: 'break-word',
                fontStyle: 'italic',
              }}
            >
              <div>{telpolGudang || filteredTelpn||'Telpon Gudang'}</div>
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div style={{ marginTop: '20px' }}>
          <div>
            Nomor: ____{takeInvoicesFromKledoBasedOnPelanggan[0]?.contact_id}
          </div>
          <div>Hal: Konfirmasi Piutang</div>
          <div>Lampiran: -</div>
        </div>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <div>Kepada Yth.</div>
          <div>
            <strong>{contactName}</strong>
          </div>
          <div>di-</div>
          <div>{contactAddress}</div>
        </div>
      </div>
      {/* Section Surat */}
      <div style={{ marginBottom: '20px' }}>
        Dengan Hormat,
        <br /> Melalui Surat ini, Kami Mengkonfirmasi Rincian Piutang Bapak/Ibu
        Sebagai Berikut:
      </div>
      {/* Table */}
      <Table
        dataSource={normalizedData}
        columns={columns as any}
        rowKey="ref_number"
        pagination={false}
        style={{
          width: '100%',
          marginBottom: '30px',
        }}
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
              <td {...restProps} style={{ padding: '4px 8px' }}>
                {children}
              </td>
            ),
          },
        }}
        summary={(pageData) => {
          let totalDue = 0
          pageData.forEach(({ due }) => {
            totalDue += Number(due)
          })
          let totalAmount = 0
          pageData.forEach(({ amount }) => {
            totalAmount += Number(amount)
          })

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={0}></Table.Summary.Cell>
              <Table.Summary.Cell index={4} colSpan={1}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`${totalAmount.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} colSpan={1}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`${(
                    totalAmount - totalDue
                  ).toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} colSpan={1}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`${totalDue.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
      {/* Footer */}
      <div style={{ marginTop: '14px' }}>
        Demikian Laporan Evaluasi ini Kami Sampaikan, Terima Kasih Atas
        Kerjasama Anda
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span>
            . . . . . . . . . . . . . . . . . . . . . . , {formattedDate}
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '70px',
        }}
      >
        <div style={{ textAlign: 'center', flex: 1 }}>
          Mengetahui Kepala Cabang,
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>Menyetujui,</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>Manager</div>
        <div style={{ textAlign: 'center', flex: 1 }}>{contactName}</div>
      </div>
      <Button
        className="no-print" // Add this class
        onClick={handlePrint}
        style={{ color: '#AF8700', borderColor: '#AF8700' }}
      >
        Print Surat Jalan
      </Button>
    </div>
  )
})
export default DetailPiutangKontak
