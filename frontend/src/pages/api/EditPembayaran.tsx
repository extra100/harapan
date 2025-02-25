import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Table,
  Modal,
  Form,
  Input,
  Button,
  message,
  Popconfirm,
  Space,
} from 'antd'
import {
  useDeleteWitholdingMutation,
  useGetTransactionByIdQuery,
  useUpdateWitholdingMutation,
} from '../../hooks/transactionHooks'
import { TakePembayaranBankTrans } from '../TakePembayaranBankTrans'
import { HOST } from '../../config'
import TOKEN from '../../token'
import { useGetFilteredContactsByOutletQuery } from '../../hooks/contactHooks'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

const EditPembayaran = () => {
  // const { memorandum } = useParams<{ memorandum?: string }>()
  const { memorandum, bankId } = useParams<{
    memorandum: string
    bankId: string
  }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    memorandum as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === memorandum
  )
  

  
  
  const refNumber = getPosDetail?.ref_number
  const nilaiNota = getPosDetail?.amount || 0
  const idBank = getPosDetail?.witholdings?.[0]?.witholding_account_id
  const idWarehouse = getPosDetail?.warehouses?.[0]?.warehouse_id
  const tglBayar = getPosDetail?.witholdings?.[0]?.trans_date
  const akunBank = getPosDetail?.witholdings?.[0]?.name

  const tag = getPosDetail?.tages?.[0]?.name
  const idContact = getPosDetail?.contacts?.[0]?.id
  console.log({ idWarehouse })
  const tags = getPosDetail?.tages?.[0]?.id

    const { data: gudangs } = useGetoutletsQuery()
  
  const selectedGudangName = idWarehouse 
  ? gudangs?.find(contact => Number(contact.id_outlet) === idWarehouse)?.nama_outlet 
  : null;
  const { data: contactjir } = useGetFilteredContactsByOutletQuery(selectedGudangName as any)
  const selectedPelangganName = contactjir 
  ? contactjir?.find(contact => contact.id === idContact)?.name
  : null;
  const [search, setSearch] = useState<any>({
    memorandum,
    bankId,
  })
  console.log({ selectedGudangName })
  console.log({ selectedPelangganName })

  const { getBankTrans } = TakePembayaranBankTrans(memorandum as any) || {
    getBankTrans: [],
  }
  console.log({ getBankTrans })

  const firstPayment =
    getBankTrans && getBankTrans.length > 0 ? getBankTrans[0] : null
    const jumlahBayarTerakhir = firstPayment ? firstPayment.amount : null;

  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false)
  const [isModalVisiblePrint, setIsModalVisiblePrint] = useState(false)
  const [isModalVisibleHapus, setIsModalVisibleHapus] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [printRecord, setPrintRecord] = useState<any>(null)
  const [erasingRecord, setErasingRecord] = useState<any>(null)
  const [form] = Form.useForm()

  const idControlEdit = getPosDetail?.witholdings?.find(
    (witholding: any) => witholding._id === editingRecord?._id
  )?.id
  const idControlPrint = getPosDetail?.witholdings?.find(
    (witholding: any) => witholding._id === printRecord?._id
  )?.id

  const idControlHapus = getPosDetail?.witholdings?.find(
    (witholding: any) => witholding._id === erasingRecord?._id
  )?.id



  const { mutate: updateWitholding, isLoading } = useUpdateWitholdingMutation()
  const handleHapus = (record: any) => {
    const { _id, ref_number, trans_date, down_payment } = record

    setErasingRecord({ ...record, ref_number, _id })

    form.setFieldsValue({
      trans_date,
      down_payment,
    })

    setIsModalVisibleHapus(true)
  }
  const handleEdit = (record: any) => {
    const { _id, ref_number, trans_date, down_payment } = record

    setEditingRecord({ ...record, ref_number, _id })

    form.setFieldsValue({
      trans_date,
      down_payment,
    })

    setIsModalVisibleEdit(true)
  }
  const handlePrint = (record: any) => {
    const { _id, ref_number, trans_date, down_payment, name } = record

    setPrintRecord({ ...record, ref_number, _id })

    form.setFieldsValue({
      _id,
      ref_number,
      trans_date,
      down_payment,
      name,
    })

    setIsModalVisiblePrint(true)
  }

  const { mutate: deleteWitholding, isLoading: isDeleting } =
    useDeleteWitholdingMutation()

  const handleModalEditOk = async () => {
    let values: any

    try {
      values = await form.validateFields()

      await updateWitholding({
        ref_number: memorandum as string,
        witholdingId: editingRecord?._id,
        trans_date: values.trans_date,
        down_payment: parseFloat(values.down_payment),
      })

      const payload = {
        amount: parseFloat(values.down_payment),
        attachment: [],
        bank_account_id: idBank,
        business_tran_id: null,
        currency_rate: null,
        currency_source_id: 0,
        memo: memorandum as string,
        tags: [tags],
        trans_date: values.trans_date,
        withholdings: [],
      }
      console.log('Payload yang akan dikirim:', payload)

      console.log('Mengirim permintaan PUT ke API...')
      const response = await fetch(
        `${HOST}/finance/bankTrans/${idControlEdit}/invoicePayment`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      )
      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }
      console.log('Data berhasil dikirim ke Kledo.')

      message.success('Data berhasil diperbarui!')
      setIsModalVisibleEdit(false)
      setEditingRecord(null)
    } catch (error: any) {
      console.error('Terjadi error:', error)
      message.error('Terjadi kesalahan saat memperbarui data.')
    }
  }
  const printRef = useRef<any>(); // Referensi untuk komponen yang ingin dicetak

  const handleModalPrintOk = async () => {
    // Anda dapat menambahkan logika untuk memverifikasi data sebelum pencetakan
    message.success('Data siap untuk dicetak!');
    window.print(); // Memanggil print browser
  };
  

  const handleModalHapusOk = async () => {
    let values: any

    try {
      values = await form.validateFields()

      await deleteWitholding({
        ref_number: memorandum as string,
        witholdingId: erasingRecord?._id,
      })
      console.log('Data berhasil dikirim ke Wakanda.')

      console.log('Mengirim permintaan DELETE Kledo')
      const response = await await fetch(
        `${HOST}/finance/bankTrans/${idControlHapus}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }

      message.success('Data berhasil dihapus!')
      setIsModalVisibleHapus(false)
      setEditingRecord(null)
    } catch (error: any) {
      console.error('Terjadi error:', error)
      message.error('Terjadi kesalahan saat memperbarui data.')
    }
  }

  const handleModalEditCancel = () => {
    setIsModalVisibleEdit(false)
    setEditingRecord(null)
  }
  const handleModalHapusCancel = () => {
    setIsModalVisibleHapus(false)
    setErasingRecord(null)
  }
  const handleModalPrintCancel = () => {
    setIsModalVisiblePrint(false)
    setPrintRecord(null)
  }

  const paymentData = getPosDetail ? getPosDetail.witholdings : []
  console.log({ paymentData })

  const totalDownPayment = paymentData.reduce((total: any, item: any) => {
    return total + (item.down_payment || 0); // Add down_payment if it exists, otherwise add 0
  }, 0);
  const sisaTagihan = nilaiNota - totalDownPayment;



  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'ID BANK',
      dataIndex: 'witholding_account_id',
      key: 'witholding_account_id',
    },
    {
      title: 'Tanggal Bayar',
      dataIndex: 'trans_date',
      key: 'trans_date',
      render: (text: string) => text || '-',
    },
    {
      title: 'Jumlah Bayar',
      dataIndex: 'down_payment',
      key: 'down_payment',
      render: (value: number) => value.toLocaleString('id-ID'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleHapus(record)}>
            <Button type="link" danger>
              Hapus
            </Button>
          </Button>
          <Button type="link" onClick={() => handlePrint(record)}>
            <Button type="link" danger>
              Print
            </Button>
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '20px', background: 'white' }}>
      <h2>Edit Pembayaran</h2>

      <Table columns={columns} dataSource={paymentData} rowKey="_id" />

      {/* Modal Edit */}
      <Modal
        title="Edit Pembayaran"
        visible={isModalVisibleEdit}
        onOk={handleModalEditOk}
        onCancel={handleModalEditCancel}
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="trans_date"
            label="Tanggal Bayar"
            rules={[{ required: true, message: 'Tanggal bayar wajib diisi!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="down_payment"
            label="Jumlah Bayar"
            rules={[{ required: true, message: 'Jumlah bayar wajib diisi!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Hapus Pembayaran"
        visible={isModalVisibleHapus}
        onOk={handleModalHapusOk}
        onCancel={handleModalHapusCancel}
        confirmLoading={isLoading}
      ></Modal>
 <Modal
    
    title={`KWITANSI PEMBAYARAN ${selectedGudangName || ''}`}
    visible={isModalVisiblePrint}
    onCancel={handleModalPrintCancel}
    onOk = {handleModalPrintOk}
    confirmLoading={isLoading}
    footer={null}
    style={{
      maxWidth: '500px',
      padding: '20px',
      fontFamily: 'monospace',
      textAlign: 'center',
    }}
  >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '14px',
        }}
      >      
       <div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}>
  <div style={{ flex: '0 0 150px' }}>Terima Dari</div>
  <div style={{ flex: 1 }}>:{selectedPelangganName}</div>        
</div>

               <div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}>

          <div style={{ flex: '0 0 150px' }}>Tgl. Pembayaran</div>
          <div style={{ flex: 1 }}>:{tglBayar}</div>
        </div>
      
               <div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}>

          <div style={{ flex: '0 0 150px' }}>Untuk Pembayaran</div>
          <div style={{ textAlign: 'left' }}>:{refNumber}</div>
        </div>     
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}>

<div style={{ flex: '0 0 150px' }}>Tag</div>
<div style={{ textAlign: 'left' }}>:{tag}</div>
</div> 
        <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '10px 0' }}>
  {/* <div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left', marginBottom: '8px' }}> */}
  <Form form={form}
  style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left', marginBottom: '8px',

    fontFamily: 'monospace',

   }}
  >
       
          <div style={{ flex: "0 0 150px" }}>Jml. Pembayaran</div>
          <div style={{ textAlign: "right" }}>
  :{(form.getFieldValue("down_payment") || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
</div>

           
        
    </Form>   
       
        
  
  <div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}>
    <div style={{ flex: '0 0 150px' }}>Akun Bank</div>
    <div style={{ textAlign: 'left' }}>:{akunBank}</div>
  </div>
</div>
<div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'right' }}>
<div style={{ flex: '0 0 255px' }}>Nilai Nota</div>
<div style={{ textAlign: 'right' }}>
  : {nilaiNota.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
</div>
</div> 
<div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'right' }}>
<div style={{ flex: '0 0 255px' }}>Total Terbayar</div>
<div style={{ textAlign: 'right' }}>
  : {totalDownPayment.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
</div>
</div> 
<div style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'right' }}>
  <div style={{ flex: '0 0 255px' }}>Sisa Tagihan</div>
  <div style={{ textAlign: 'right' }}>
  : {sisaTagihan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
</div>

</div> 



       
        

         
      </div>
      <br />
      <br />

      <Button onClick={handleModalPrintOk}>Terima Kasih</Button>
      

    </Modal>
    

    </div>
  )
}

export default EditPembayaran
