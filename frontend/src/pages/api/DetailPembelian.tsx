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
  useGetPembelianByIdQuery,
  useUpdatePembelianMutation,
} from '../../hooks/pembelianHooks'
import { useGetReturnByIdQuery } from '../../hooks/returnHooks'
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

import {
  useGetContactsQuery,
  useGetContactsQuerysa,
  // useGetContactsQueryIdKontak,
} from '../../hooks/contactHooks'
import { useAddAkunBank, useGetAkunBanksQueryDb } from '../../hooks/akunBankHooks'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { NumericFormat } from 'react-number-format'

import type { Dayjs } from 'dayjs'
import { useVoidInvoice } from './voidInvoice'
import { Transaction } from '../../types/Transaction'
import { useUnvoidInvoice } from './unvoidInvoice'
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
import { useGetBarangsQuery, useUpdateBarangMutation } from '../../hooks/barangHooks'
import { useQueryClient } from '@tanstack/react-query'
import { Pembelian } from '../../types/Pembelian'

const { Title, Text } = Typography
const { Option } = Select

const DetailPembelian: React.FC = () => {
  const [showButtons, setShowButtons] = useState(false)
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(currentDate)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])
  const { ref_number } = useParams<{ ref_number?: string }>()

  const updatePosMutation = useUpdatePembelianMutation()
  //
  const { data: allTransactions } = useGetPembelianByIdQuery(
    ref_number as string
  )

  
  const { data: allreturns } = useGetReturnByIdQuery(ref_number as string)

  const { data: akunBanks } = useGetAkunBanksQueryDb()
console.log({akunBanks})


  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const idPelanggan = getPosDetail?.contacts?.[0]?.id;
  const { data: contacts } = useGetContactsQuery()
  const namaSupplier = contacts?.find(
    (contact: any) => contact._id === idPelanggan
  )?.name;
  const getReturDetail = allreturns?.filter(
    (balikin: any) =>
      balikin.memo === ref_number && 
      balikin.items?.some((item: any) => item.qty > 0)
  );
  const totalAmountRetur = getReturDetail
  ?.flatMap((balikin: any) => balikin.items || [])
  .reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;


  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  )
  const IdYangAkanDiDelete = getPosDetail?.id
  const memorandum = getPosDetail?.memo || ref_number
  const ketVoid = getPosDetail?.reason_id
  const idMonggo = getPosDetail?._id
  const pesan = getPosDetail?.message
  const { hapusLoading, isDeleted } = useDeleteInvoice(selectedInvoiceId ?? 0)

  const refNumber = getPosDetail ? getPosDetail.memo : null
  const handleDelete = () => {
    if (IdYangAkanDiDelete) {
      setSelectedInvoiceId(IdYangAkanDiDelete)
      message.loading('Deleting invoice...')
    }
  }
  useEffect(() => {
    if (isDeleted) {
      message.success('Invoice deleted successfully')
      setSelectedInvoiceId(null)
    }
  }, [isDeleted])
  //delete\\
  const items = getPosDetail?.items || []

  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const kontakId = getPosDetail?.contacts?.[0]?.id
  const namaKontak = getPosDetail?.contacts?.[0]?.name
  const gudangId = getPosDetail?.warehouses?.[0]?.warehouse_id
  const idididid = getPosDetail?.items?.[0]?.id
  const amountsPerBaris = items.map((item: any) => {
    const amount = item.amount || 0
    const qty = item.qty || 1 
    return qty > 0 ? amount / qty : 0
  })

  const { data: contactjir } = useGetContactsQuerysa(kontakId as any)
  const kontakringan = contactjir?.[0]?.name

  const totalAmountPerBaris = items.reduce((total: number, item: any) => {
    const amount = item.price || 0
    const qty = item.qty || 1 
    const amountPerBaris = qty > 0 ? amount * qty : 0
    return total + amountPerBaris
  }, 0)
  // console.log({ totalAmountPerBaris })
  const totalDiskonSemua = items.reduce((total: number, item: any) => {
    const amount = item.discount_amount || 0

    return total + amount
  }, 0)
  // console.log({ totalDiskonSemua })
  const langka = getPosDetail?.id

  const tagName = getPosDetail?.tages?.map((tag: any) => tag.name) || []

  const witholdings = getPosDetail?.witholdings || []
  const amount = getPosDetail?.amount ?? 0

  const totalDownPayment = witholdings
    .filter((witholding: any) => witholding.status === 0)
    .reduce((sum: number, witholding: any) => {
      return sum + (witholding.down_payment || 0)
    }, 0)

  const due = amount - totalDownPayment - totalAmountRetur
// console.log({due})
  const totalDiscount = items.reduce((total: number, item: any) => {
    return total + (item.discount_amount || 0)
  }, 0)
  const subTotal = totalDiscount + amount
  const finalTotalAgterRetur = amount - (totalAmountRetur || 0);
  const finalDueAfterRerur = due - (totalAmountRetur || 0);



  const [amountPaid, setAmountPaid] = useState<number | null>(null)
  console.log({amountPaid})
  useEffect(() => {}, [finalDueAfterRerur, amountPaid])
  const simpanSisaPiutrang = amount - (amountPaid ?? 0);

  const roundUpIndonesianNumber = (value: number | null): string => {
    if (value === null) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
    }).format(value);
  };
  

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (!isNaN(value) && value <= due) {
      setAmountPaid(value)
    } else {
      alert('Jumlah bayar tidak boleh melebihi total tagihan')
    }
  }
  const handleSetAmountPaid = () => {
    setAmountPaid(due)
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


  const [selectedBank, setSelectedBank] = useState<any | null>(null)
  const bankId = akunBanks?.find((b) => b.name === selectedBank)?.id || ""

  console.log({selectedBank})
  console.log({bankId})
const handleBankChange = (selectedName: string) => {
  const selected = akunBanks?.find((bank: any) => bank.name === selectedName)
  setSelectedBank(selected ? selected.id : null)
}
  const today = dayjs().format('DD-MM-YYYY')
  const { saveNextPayment } = saveToApiNextPayment()
    const { data: barangs } = useGetBarangsQuery()
  
    const updateBarangMutation = useUpdateBarangMutation() // Tambahkan hook ini\
    const queryClient = useQueryClient(); // Tambahkan ini

const handleVoid = (values: any) => {
  if (!langka) {
    message.error('Menyebabkan double data');
    return;
  }

  const existingInvoice = allTransactions?.find(
    (transaction) => transaction.id === langka
  );

  if (!existingInvoice) {
    message.error('Melebihi batas pembatalan');
    return;
  }

  voidInvoice(langka as any)
    .then(() => {
      if (barangs) {
        existingInvoice.items.forEach((item) => {
          const barangIndex = barangs.findIndex(
            (barang) => barang.id === item.finance_account_id
          );

          if (barangIndex !== -1) {
            const updatedBarang = {
              ...barangs[barangIndex],
              qty: barangs[barangIndex].qty + item.qty,
            };

            console.log('Updating barang:', updatedBarang);

            updateBarangMutation.mutate(updatedBarang, {
              onSuccess: () => {
                console.log(`Barang ${updatedBarang.id} updated successfully`);
                queryClient.invalidateQueries(['barangs']);
              },
              onError: (error) => {
                if (error instanceof Error) {
                  console.error(`Error updating barang: ${error.message}`);
                  message.error(`Gagal memperbarui stok: ${error.message}`);
                } else {
                  console.error('Terjadi kesalahan yang tidak diketahui:', error);
                  message.error('Terjadi kesalahan yang tidak diketahui.');
                }
              },
            });
          }
        });
      }

      const updatedInvoice: Pembelian = {
        ...existingInvoice,
        reason_id: 'void',
      };

      updatePosMutation.mutate(updatedInvoice, {
        onSuccess: () => {
          message.success('Transaksi berhasil dibatalkan dan diperbarui!');
          setLoadingSpinner(true);

          setTimeout(() => {
            setLoadingSpinner(false);
            navigate('/listvoid');
          }, 3000);
        },
        onError: (error) => {
          if (error instanceof Error) {
            message.error(
              `Terjadi kesalahan saat memperbarui database: ${error.message}`
            );
          } else {
            message.error('Terjadi kesalahan yang tidak diketahui.');
          }
        },
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error(`Error voiding invoice: ${error.message}`);
        message.error(`Terjadi kesalahan saat void invoice: ${error.message}`);
      } else {
        console.error('Terjadi kesalahan yang tidak diketahui:', error);
        message.error('Terjadi kesalahan yang tidak diketahui.');
      }
    });
};

    
    
  

  const [loadingSpinner, setLoadingSpinner] = useState(false)

  const handleUnVoid = (values: any) => {
    if (!langka) {
      message.error('Menyebabkan double data');
      return;
    }
  
    const existingInvoice = allTransactions?.find(
      (transaction) => transaction.id === langka
    );
  
    if (!existingInvoice) {
      message.error('Melebihi batas pembatalan');
      return;
    }
  
    unvoidInvoice(langka as any)
      .then(() => {
        if (barangs) {
          existingInvoice.items.forEach((item) => {
            const barangIndex = barangs.findIndex(
              (barang) => barang.id === item.finance_account_id
            );
  
            if (barangIndex !== -1) {
              const updatedBarang = {
                ...barangs[barangIndex],
                qty: barangs[barangIndex].qty - item.qty, // Kurangi stok
              };
  
              console.log('Updating barang:', updatedBarang);
  
              updateBarangMutation.mutate(updatedBarang, {
                onSuccess: () => {
                  console.log(`Barang ${updatedBarang.id} updated successfully`);
                  queryClient.invalidateQueries(['barangs']);
                },
                onError: (error) => {
                  if (error instanceof Error) {
                    console.error(`Error updating barang: ${error.message}`);
                    message.error(`Gagal memperbarui stok: ${error.message}`);
                  } else {
                    console.error('Terjadi kesalahan yang tidak diketahui:', error);
                    message.error('Terjadi kesalahan yang tidak diketahui.');
                  }
                },
              });
            }
          });
        }
  
        const updatedInvoice: Pembelian = {
          ...existingInvoice,
          reason_id: 'unvoid',
        };
  
        updatePosMutation.mutate(updatedInvoice, {
          onSuccess: () => {
            message.success('Transaksi berhasil dikembalikan dan diperbarui!');
            setLoadingSpinner(true);
  
            setTimeout(() => {
              setLoadingSpinner(false);
              navigate('/listvoid');
            }, 3000);
          },
          onError: (error) => {
            if (error instanceof Error) {
              message.error(
                `Terjadi kesalahan saat memperbarui database: ${error.message}`
              );
            } else {
              message.error('Terjadi kesalahan yang tidak diketahui.');
            }
          },
        });
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.error(`Error unvoiding invoice: ${error.message}`);
          message.error(`Terjadi kesalahan saat unvoid invoice: ${error.message}`);
        } else {
          console.error('Terjadi kesalahan yang tidak diketahui:', error);
          message.error('Terjadi kesalahan yang tidak diketahui.');
        }
      });
  };
  

  const handleFormSubmit = async (values: any) => {
    // const accountMap = fiAc?.children?.reduce((map: any, warehouse: any) => {
    //   map[warehouse.name] = warehouse.id;
    //   return map;
    // }, {});
  
    // const accountId = accountMap[selectedBank as any];
  
    if (!langka) {
      console.error("No valid ref_number found.");
      return;
    }
  
 
  
    try {
      navigate(`/detailpembelian/${memorandum}`);
  
      const existingInvoice = allTransactions?.find(
        (transaction) => transaction.id === langka
      );
  
      if (!existingInvoice) {
        console.error("Invoice with ref_number not found:", refNumber);
        return;
      }
  
      const updatedWithholdings = [
        ...existingInvoice.witholdings,
        {
          witholding_account_id: bankId,
          name: selectedBank,
          down_payment: amountPaid || 0,
          witholding_percent: 0,
          witholding_amount: 0,
          status: 0,
          trans_date: selectedDates,
          id: 22,
        },
      ];
  
      const updatedInvoice = {
        ...existingInvoice,
        witholdings: updatedWithholdings,
      };
  
      updatePosMutation.mutate(updatedInvoice as any);
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };
  
  
  
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


  const [refNumbers, setRefNumber] = useState('')
  const { voidInvoice, voidLoading, voidError, voidSuccess } = useVoidInvoice()
  const { unvoidInvoice } = useUnvoidInvoice()
  const [selectedDates, setSelectedDates] = useState<string>()

  const handleDateRangeSave = (startDate: string) => {
    setSelectedDates(startDate)
  }
  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }

  const navigate = useNavigate()

  const menu = (
    <Menu>
      <Menu.Item key="lihatAudit" icon={<FileSearchOutlined />}>
        Lihat Audit
      </Menu.Item>
      {getPosDetail?.reason_id === 'void' && (
        <Menu.Item
          key="unvoid"
          icon={<UndoOutlined />}
          onClick={() => {
            // unvoidInvoice()
            handleUnVoid(null)
          }}
          disabled={voidLoading}
        >
          {voidLoading ? 'Proses UnVoid...' : 'UnVoid'}
        </Menu.Item>
      )}
      {getPosDetail?.reason_id === 'unvoid' && (
        <Menu.Item
          key="void"
          icon={<CloseCircleOutlined />}
          onClick={() => {
            handleVoid(null);
          }}
          disabled={voidLoading || totalAmountRetur > 0} 
        >
          {voidLoading ? 'Proses Void...' : 'Void'}
        </Menu.Item>
      )}


      <Menu.Item
        key="retur"
        icon={<RollbackOutlined />}
        onClick={() => {
          navigate(`/returninvoice/${ref_number}`)
        }}
        disabled={totalAmountRetur > 0} 

      >
        Retur
      </Menu.Item>

      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => {
          navigate(`/edittransaksi/${ref_number}`)
        }}
        disabled={totalAmountRetur > 0} 

      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="hapus"
        icon={<CloseCircleOutlined />}
        onClick={() => {
          handleDelete()
          handleVoid(null)
        }}
        disabled={hapusLoading || totalAmountRetur > 0} 

      >
        {hapusLoading ? 'Proses Penghapusan...' : 'hapus'}
      </Menu.Item>
    </Menu>
  )

  const { hasRedData } = useRedData()

  const columns = [
    {
      title: 'Nu',
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

    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      align: 'left',
      render: (price: number) => (
        <div style={{ textAlign: 'left' }}>
          {price !== undefined ? roundUpIndonesianNumber(price) : 'Rp 0'}
        </div>
      ),
    },
    {
      title: 'Diskont',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      align: 'left',
      render: (discount_amount: number) => (
        <div style={{ textAlign: 'left' }}>
          {discount_amount !== undefined
            ? roundUpIndonesianNumber(discount_amount)
            : 'Rp 0'}
        </div>
      ),
    },
    // {
    //   title: 'Harga Diskon',
    //   key: 'amountPerBaris',
    //   align: 'left',
    //   render: (record: any) => {
    //     const amount = record.amount || 0
    //     const qty = record.qty || 1 // Pastikan qty tidak nol
    //     const amountPerBaris = qty > 0 ? amount / qty : 0
    //     return (
    //       <div style={{ textAlign: 'left' }}>
    //         {roundUpIndonesianNumber(amountPerBaris)}
    //       </div>
    //     )
    //   },
    // },

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
    
            <Dropdown
              overlay={menu}
              trigger={['click']}
              placement="bottomRight"
            >
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                {loading ? (
                  <Spin size="small" /> // Menampilkan spinner saat loading
                ) : (
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="more"
                    width="2em" // Lebar ikon
                    height="2em" // Tinggi ikon
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z" />
                  </svg>
                )}
              </a>
            </Dropdown>

            <Col>
              {showButtons && (
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
        // bordered
      >
                <span>
  {ketVoid === 'void' && <span style={{ color: 'orange', fontWeight: 'bold', marginTop: '2px' }}>Void</span>}
</span>
        <Row>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Supplier:</Text>
            </div>
            <Title level={5} style={{ marginBottom: 0 }}>
              {namaSupplier}
            </Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>NOMOR:</Text>
            </div>
            <Title level={5}>{getPosDetail?.ref_number || []}</Title>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tgl. Transaksi:</Text>
            </div>
            <Title level={5}>
              {formatDate(getPosDetail?.trans_date || '')}
            </Title>
          </Col>

          {getPosDetail?.memo && (
            <Col span={12}>
              <div style={{ marginBottom: '0px' }}>
                <Text strong>Ket:</Text>
              </div>
              <Text>{getPosDetail?.message}</Text>
            </Col>
          )}
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
            <Title level={5}>
              {getPosDetail?.tages?.map((tag: any) => tag.name).join(' - ') ||
                'No Tags'}
            </Title>
          </Col>
        </Row>
      </Card>

      {/* Transaction Table */}
      <Table
        dataSource={[
          ...(getPosDetail?.items || []),
          // ...(getReturDetail
          //   ?.flatMap((retur: any) => retur.items || [])
          //   .filter((item: any) => item.qty > 0) || []),
        ]}
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
                <Text strong>Sub Total</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>
                  {roundUpIndonesianNumber(totalAmountPerBaris)}
                </Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{roundUpIndonesianNumber(totalDiskonSemua)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total setelah diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{roundUpIndonesianNumber(amount)}</Text>
              </Col>
            </Row>
            {totalAmountRetur > 0 && (
              <Row style={{ marginTop: '8px' }}>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Text strong style={{ color: 'blue' }}>Total Retur</Text>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Text strong style={{ color: 'blue' }}>
                    {roundUpIndonesianNumber(totalAmountRetur)}
                  </Text>
                </Col>
              </Row>
            )}


            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>Total</Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>{roundUpIndonesianNumber(finalTotalAgterRetur)}</Title>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <>
              {witholdings
                .filter(
                  (witholding: any) =>
                    witholding.status === 0 && witholding.down_payment !== 0
                ) 
                .map((witholding: any, index: number) => (
                  <Row key={index} style={{ marginTop: '8px' }}>
                    <Col span={12} style={{ textAlign: 'left' }}>
                      <a href={`/editpembayaranbeli/${memorandum}`}>
                        <Text strong style={{ color: 'blue' }}
                        >{witholding.name}</Text>
                      </a>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong 
                      style={{ color: 'blue' }}>
                        {roundUpIndonesianNumber(witholding.down_payment)}
                      </Text>
                    </Col>
                  </Row>
                ))}
            </>
                  
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '20px' }}>
                  Sisa Tagihan
                </Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '20px' }}>
                  {due <= 0 ? 0 : roundUpIndonesianNumber(due)}
                </Text>
              </Col>
            </Row>


          </Col>
        </Row>
      </div>
      {due != 0 && (
        <Card title="Pembayaran" style={{ marginTop: '20px' }}>
          <Form layout="vertical" onFinish={handleFormSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <span
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                  onClick={handleSetAmountPaid}
                >
                  Jumlah Bayar
                </span>
                <span
                  style={{
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
                  // decimalScale={0}
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
              loading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => {
                  setLoading(false)
                  message.success('Pembayaran berhasil ditambahkan!')
                }, 1000)
              }}
            >
              Tambah Pembayaran
            </Button>
          </Form>
        </Card>
      )}
    </div>
  )
}

export default DetailPembelian
