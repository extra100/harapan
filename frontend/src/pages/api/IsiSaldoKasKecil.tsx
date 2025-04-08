import React, { useState, useEffect, useContext } from 'react'
import {
  Select,
  Badge,
  Table,
  Button,
  Form,
  Collapse,
  Row,
  Col,
  Typography,
  DatePicker,
  message,
  Switch,
  InputNumber,
} from 'antd'
import { useStokBarang } from './StokBarang'

import { useIdNamaBarang } from './NamaBarang'
import Input from 'antd/es/input/Input'
import DateRange from '../DateRange'
import TextArea from 'antd/es/input/TextArea'

import { useIdNamaTag } from './NamaTag'
import { useIdContact } from './NamaContact'

import { SaveApi } from './SaveApi'
import { v4 as uuidv4 } from 'uuid'
import { Navigate } from 'react-router-dom'
import { useGetBarangsQuery, useUpdateBarangMutation } from '../../hooks/barangHooks'
import { useGetContactsQuery, useGetFilteredContactsByOutletQuery } from '../../hooks/contactHooks'
import { saveToApiNextPayment } from './NextPayment'
import { useNavigate } from 'react-router-dom'
import { useWarehouseStock } from './fetchSemuaStok'
import UserContext from '../../contexts/UserContext'
import NumberFormat, {
  NumberFormatBase,
  NumericFormat,
} from 'react-number-format'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useGetTagsQueryDb } from '../../hooks/tagHooks'
import { AnyRecord } from 'dns'
import { useGetAkunBanksQueryDb } from '../../hooks/akunBankHooks'
import { DeleteOutlined } from '@ant-design/icons'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import {
  useGetControlQuery,
  useUpdateControlMutation,
} from '../../hooks/controlHooks'
import { useGetPelanggansQueryDb } from '../../hooks/pelangganHooks'
import dayjs from 'dayjs';

const { Option } = Select
const { Title, Text } = Typography
import { TakePiutangToPerContactStatusIdAndMemoMny } from './TakePiutangToPerContactStatusIdAndMemoMny'
import { useGetBiayasQuery } from '../../hooks/biayaHooks'
import { useAddIsiSaldoKasKecilMutation } from '../../hooks/isisSaldoKasKecilHooks'

const IsiSaldoKasKecil = () => {
  const [loadingSpinner, setLoadingSpinner] = useState(false) // State untuk spinner

  const { Panel } = Collapse
  const navigate = useNavigate()



  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )
  const [selectedDates, setSelectedDates] = useState<[string, string]>(['', ''])
  

  const formattedDate = dayjs(selectedDates[0], 'DD-MM-YYYY').format('YYYY-MM-DD');

  

  
  const [selectedDate, setSelectedDate] = useState<string | undefined>()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  const { data: barangs } = useGetBiayasQuery()
  const { data: gudangdb } = useGetWarehousesQuery()

  const { data: akunBanks } = useGetAkunBanksQueryDb()

  const { data: tagDb } = useGetTagsQueryDb()
  const [warehouseName, setWarehouseName] = useState<string | null>(null)

  const { data: contacts } = useGetFilteredContactsByOutletQuery(warehouseName as any)

  const { data: controllings } = useGetControlQuery()
  const { saveInvoiceData } = SaveApi()

    
  const getWarehouseName = () => {
    if (!gudangdb || !selectedWarehouseId) return null

    const selectedWarehouse = gudangdb.find(
      (warehouse: { id: number; name: string }) =>
        warehouse.id === Number(selectedWarehouseId)
    )
    return selectedWarehouse ? selectedWarehouse.name : null
  }
  const { data: contactssss } = useGetFilteredContactsByOutletQuery(warehouseName as any);
  
  useEffect(() => {
    const name = getWarehouseName()
    setWarehouseName(name)
    if (name) {
    }
  }, [gudangdb, selectedWarehouseId])

  const [tagName, setTagName] = useState<string[] | null>(null)

  const [bankAccountName, setBankAccountName] = useState<string | null>(null)

  const [bankAccountId, setBankAccountId] = useState<string | null>(null)

  const getTagName = () => {
    if (!tagDb || !warehouseName) return null

    const matchingTags = tagDb.filter(
      (tag: { name: string }) => tag.name === warehouseName
    )

    return matchingTags.length > 0 ? matchingTags.map((tag) => tag.name) : null
  }
  useEffect(() => {
    const names = getTagName()
    setTagName(names)
  }, [warehouseName, tagDb])

  const tagId = tagName
    ? tagDb?.filter((tag) => tagName.includes(tag.name)).map((tag) => tag.id)
    : null

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
  const [isLoading, setIsLoading] = useState(false)
  //loading
  useEffect(() => {
    const id = getBankAccountId()
    setBankAccountId(id as any)
  }, [warehouseName, akunBanks])
  const addPosMutation = useAddIsiSaldoKasKecilMutation()


  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: any
  }>({})

  const [selectedFinanceAccountIds, setSelectedFinanceAccountIds] = useState<
    any[]
  >([])

  console.log({selectedFinanceAccountIds})
  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(user.id_outlet)
    }
  }, [user])
  const [dataSource, setDataSource] = useState<any[]>([])
  console.log({dataSource})



  

  const customDisplayRender = (value: any) => {
    return ''
  }

  const handleProductChange = (values: any[]) => {
    setSelectedFinanceAccountIds(values)
  }
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: any) => {
    setSearchValue(value)
  }

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [selectedPrices, setSelectedPrices] = useState<{
    [key: string]: string
  }>({})



  const warehouseMap = gudangdb
    ? gudangdb.reduce((map: any, warehouse: any) => {
        map[warehouse.id] = warehouse.name
        return map
      }, {})
    : {}

  const warehouseId = warehouseMap[selectedWarehouseId as any]
  const untukTag = gudangdb
    ? gudangdb.reduce((map: any, warehouse: any) => {
        map[warehouse.id] = warehouse.name
        return map
      }, {})
    : {}

  const forTag = untukTag[selectedWarehouseId as any]

  useEffect(() => {
    if (selectedWarehouseId) {
      setSelectedWarehouseId(selectedWarehouseId)
      handleWarehouseChange(selectedWarehouseId)
    }
  }, [selectedWarehouseId])
  useEffect(() => {
    if (selectedWarehouseId && Array.isArray(tagDb) && tagDb.length > 0) {
      handleWarehouseChange(selectedWarehouseId)
    }
  }, [selectedWarehouseId, tagDb])
  const handleWarehouseChange = (value: number | string) => {
    setSelectedWarehouseId(value)

    if (value && forTag) {
      const matchingTag = Array.isArray(tagDb)
        ? tagDb.filter((tag) => tag.name === forTag)
        : []

      setSelectag(matchingTag.map((tag) => tag.id))
    }
    const bangke = gudangdb
      ? gudangdb.reduce((map: any, warehouse: any) => {
          map[warehouse.id] = warehouse.name
          return map
        }, {})
      : {}

    const namaBangke = bangke[value as any]

    const findMatchingBank = (namaGudang: string) => {
      return akunBanks?.find((bank) =>
        bank.name.startsWith(`KAS PENJUALAN_${namaGudang}`)
      )
    }

    const matchingBank = findMatchingBank(namaBangke)

    if (matchingBank) {
      setSelectedBank(matchingBank.name)
    } else {
    }
  }
  const handleOkClick = () => {
    setDropdownVisible(false);
  
    console.log('selectedFinanceAccountIds:', selectedFinanceAccountIds);
    console.log('barangs:', barangs);
  
    // Filter data yang cocok berdasarkan _id
    const selectedItems = barangs!.filter((item) =>
      selectedFinanceAccountIds.includes(item._id)
    );
  
    console.log('selectedItems:', selectedItems);
  
    if (selectedItems.length === 0) {
      console.warn('❌ Tidak ada item yang cocok, dataSource tidak akan berubah.');
      return;
    }
  
    setDataSource((prev) => {
      console.log('dataSource sebelum update:', prev);
  
      const newItems = selectedItems
        .filter((item) => !prev.some((existingItem) => existingItem._id === item._id))
        .map((item) => ({
          _id: item._id,
          finance_account_name: item.name,
        }));
  
      console.log('newItems yang akan ditambahkan:', newItems);
  
      return [...prev, ...newItems];
    });
  
    setSelectedFinanceAccountIds([...selectedFinanceAccountIds]); // Jangan map(Number)
  };
  


  const handleDelete = (key: any) => {
    setDataSource((prev) =>
      prev.filter((pos) => pos._id !== key)
    )

    setSelectedPrices({})
    setSelectedFinanceAccountIds([])

    setAmountPaid(null)
  }


  const [selectedDifference, setSelectedDifference] = useState<number>(0)
  const [termIdSimpan, setTermIdSimpan] = useState<number>(0)
  // console.log({termIdSimpan})
  const handleDateRangeSave = (
    startDate: string,
    endDate: string,
    difference: number,
    termId: number // Add termId parameter
  ) => {
    setSelectedDates([startDate, endDate])
    setSelectedDifference(difference)
    setTermIdSimpan(termId)
  }

  const [paymentForm] = Form.useForm()

  const [selectTag, setSelectag] = useState<any[]>([])

  const handleTag = (value: any[]) => {
    setSelectag(value)
  }

  const [selectedContact, setSelectedContact] = useState<any | null>(null)
  console.log({selectedContact})
  const selectedContactName = selectedContact 
  ? contacts?.find(contact => contact._id === selectedContact)?.name 
  : null;
// console.log({selectedContact})
  const handleContactChange = (value: number) => {
    setSelectedContact(value)
  }
  const [totalSubtotal, setTotalSubtotal] = useState<number>(0)

  const formatRupiah = (number: any) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(number)
  }

  const [formattedTotalSubtotal, setFormattedTotalSubtotal] =
    useState<string>('')

    useEffect(() => {
        const calculateTotalSubtotal = () => {
          const total = dataSource.reduce((sum, item) => sum + (item.total || 0), 0);
          setTotalSubtotal(total);
          setFormattedTotalSubtotal(formatRupiah(total));
        };
      
        calculateTotalSubtotal();
      }, [dataSource]); // ✅ Akan re-render saat `dataSource` berubah
      

  const [amountPaid, setAmountPaid] = useState<number | null>(null)

  const [piutang, setPiutang] = useState<number>(0)

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (!isNaN(value) && value <= totalSubtotal) {
      setAmountPaid(value)
    } else {
      alert('Jumlah bayar tidak boleh melebihi total tagihan')
    }
  }

  useEffect(() => {
    setPiutang((totalSubtotal || 0) - (amountPaid || 0))
  }, [totalSubtotal, amountPaid])



  const [selectedBank, setSelectedBank] = useState<any | null>(bankAccountName)

  const [status, setStatus] = useState<number | undefined>()
  useEffect(() => {
    setSelectedBank(bankAccountName)
  }, [bankAccountName])

  const evaluateStatus = () => {
    if (amountPaid === null || amountPaid <= 0) {
      return 1
    } else if (amountPaid > 0 && amountPaid < totalSubtotal) {
      return 2
    } else if (amountPaid === totalSubtotal) {
      return 3
    }
    return status
  }

  useEffect(() => {
    const newStatus = evaluateStatus()
    setStatus(newStatus)
  }, [amountPaid, totalSubtotal])

  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }

  const generateShortInvoiceId = (idOutlet: string): string => {
    const uuid = uuidv4()
    const timestamp = Date.now()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000

    return `BIA-${idOutlet}-${timestamp}-${String(shortNumber).padStart(
      5,
      '0'
    )}`
  }

  const [refNumber, setRefNumber] = useState<string>('')

  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(user.id_outlet)

      const newRefNumber = generateShortInvoiceId(user.id_outlet)
      setRefNumber(newRefNumber)
    }
  }, [user])
  const generateUnique = () => {
    const uuid = uuidv4()
    const last5OfUUID = uuid.substr(uuid.length - 2)
    const shortNumber = parseInt(last5OfUUID, 16) % 100000
    return shortNumber
  }
  const [uniqueNumber, setUniqueNumber] = useState('')

  useEffect(() => {
    const generatedNumber = generateUnique()
    setUniqueNumber(generatedNumber as any)
  }, [])
  const [catatan, setCatatan] = useState('')
  const [yangMana, setYangMana] = useState()

  const handleSetAmountPaid = () => {
    setAmountPaid(totalSubtotal)
  }
  const [memo, setMemo] = useState('')

  const [error, setError] = useState<string | null>(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [clickedTime, setClickedTime] = useState<number | null>(null);
  
 
    
    
  const handleSave = async () => {
      if (isSaveDisabled) return;
      setIsSaveDisabled(true); // Menonaktifkan tombol
      setClickedTime(Date.now()); // Set waktu klik
  
    const saveTag = tagDb?.reduce((map: any, tag: any) => {
      map[tag.name] = tag.id;
      return map;
    }, {});
  
    const saveIdTags = selectTag
      .map((id: number) => {
        const tag = tagDb?.find((item: any) => item.id === id);
        return tag ? { id: tag.id, name: tag.name } : null;
      })
      .filter(Boolean);
  
    const accountMap = akunBanks?.reduce((map: any, warehouse: any) => {
      map[warehouse.name] = warehouse.id;
      return map;
    }, {});
    const accountId = accountMap[selectedBank as any];
    setYangMana(accountId);
  
    const saveNamaGudang = gudangdb?.reduce((map: any, warehouse: any) => {
      map[warehouse.id] = warehouse.name;
      return map;
    }, {});
    const simpanGudang = saveNamaGudang[selectedWarehouseId as any];
  
    let dueDate = formatDate(selectedDates[1]);
    if (termIdSimpan === 2) {
      dueDate = formatDate(selectedDates[0]);
    }
    const witholdings = amountPaid
      ? [
          {
            witholding_account_id: accountId || bankAccountId,
            name: selectedBank || bankAccountName,
            down_payment: amountPaid,
            witholding_percent: 0,
            witholding_amount: 0,
            status: 0,
            id: 0,
            trans_date: formatDate(selectedDates[0]),
          },
        ]
      : [];
  
    const invoiceData = {
      id: uniqueNumber,
      jalur: 'biaya',
      ref_number: refNumber,
      ref_transaksi: 0,
      status_id: status,
      unique_id: uniqueNumber,
      trans_date: formatDate(selectedDates[0]),
      due_date: dueDate,
      contact_id: String(selectedContact),
      sales_id: null,
      include_tax: 0,
      term_id: termIdSimpan || 2,
      memo: refNumber,
      amount: totalSubtotal,
      amount_after_tax: 0,
      warehouse_id: selectedWarehouseId,
      attachment: [],
      reason_id: 'unvoid',
      message: memo || '',
      items: dataSource.map((item) => {
        return {
          id: 123,
          amount: item.total, // Ambil total dari record
          discount_amount: item.gapPrice || item.input_diskon_manual || 0,
          _id: item._id,
          deskripsi: item.deskripsi || '',
          name: item.finance_account_name || '0',
          tax_id: null,
          desc: '',
          qty: 0,
          qty_update: 0,
          price: 0,
          unit_id: item.unit_id,
          satuan: item.name,
          pos_product_category_id: 9,
          finance_account_id: 0
        };
      }),
      
      witholdings,
      contacts: [
        {
          id: String(selectedContact),
          name: selectedContactName,
        },
      ],
      warehouses: [
        {
          warehouse_id: selectedWarehouseId,
          name: 'harapan',
        },
      ],
      tages: saveIdTags.map((tag) => ({
        id: tag?.id || tagId,
        name: tag?.name || tagName,
      })),
      due: piutang,
      down_payment: amountPaid as any || 0,
      down_payment_bank_account_id: accountId || bankAccountId,
      witholding_account_id: accountId || bankAccountId,
      tags: selectTag || tagId,
      witholding_amount: 0,
      witholding_percent: 0,
      column_name: '',
      externalId: 0,
    };
  
    setLoadingSpinner(true);
  
    try {
      addPosMutation.mutate(invoiceData as any, {
        onSuccess: () => {
          message.success('Transaksi berhasil disimpan!');
        //   handleUpdateStock()
          setTimeout(() => {
            setIsLoading(false);
            navigate(`/pembiayaankledo/${refNumber}`);
          }, 3000);
        },
        
        onError: (error: any) => {
          message.error(`Terjadi kesalahan: ${error.message}`);
          setIsLoading(false);
        },
      });
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        message.error(`Terjadi kesalahan: ${err.message}`);
      } else if (err && typeof err === 'object' && 'message' in err) {
        const errorMessage = (err as any).message || 'Terjadi kesalahan yang tidak diketahui.';
        message.error(errorMessage);
      } else {
        message.error('Terjadi kesalahan yang tidak diketahui.');
      }
    }
    setTimeout(() => {
      setIsSaveDisabled(false);
    }, 5000); 
  };



  const handleTotalChange = (value: number | null, id: string) => {
    setDataSource((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, total: value || 0 } : item
      )
    );
  };
  const handleDeskripsiChange = (value: string, id: string) => {
    setDataSource((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, deskripsi: value } : item
      )
    );
  };
  

  const columns = [
    {
      title: 'Akun Biaya',
      dataIndex: '_id',
      key: '_id',
      align: 'left',
      className: 'wrap-text',
      render: (id: any, record: any) => (
        <Select
          showSearch
          placeholder="Barang"
          style={{ width: '420px' }}
          optionFilterProp="items"
          filterOption={(input, option) =>
            option?.items?.toString()
              ? option.items.toString().toLowerCase().includes(input.toLowerCase())
              : false
          }
          onChange={(value) => handleProductChange(value)}
          defaultValue={id}
        >
          {barangs?.map((product) => (
            <Select.Option key={product._id} value={product._id}>
              <div style={{ display: 'flex', alignItems: 'left' }}>
                <span style={{ paddingRight: '16px' }}>{product.name}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Deskripsi',
      dataIndex: 'deskripsi',
      key: 'deskripsi',
      render: (text: string, record: any) => (
        <Input
          placeholder="Masukkan deskripsi"
          value={text}
          onChange={(e) => handleDeskripsiChange(e.target.value, record._id)}
        />
      ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (total: number, record: any) => (
          <InputNumber
            min={0}
            value={total}
            onChange={(value) => handleTotalChange(value, record._id)} // ✅ Update total jika berubah
            style={{ width: '100%' }}
          />
        ),
      },
      
    {
      title: '',
      key: 'action',
      render: (text: any, record: any) => (
        <div>
          <DeleteOutlined
            style={{
              color: 'red',
              border: '0.5px solid red',
              padding: '4px',
              fontSize: '16px',
              lineHeight: '16px',
              borderRadius: '4px',
            }}
            type="primary"
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];
  
  const labelStyle = {
    display: 'inline-block' as const,
    minWidth: '120px' as const,
    textAlign: 'left' as const,
  }

  const labelColonStyle = {
    display: 'inline-block' as const,
    minWidth: '10px' as const,
    textAlign: 'left' as const,
  }

  const updateOutletMutation = useUpdateControlMutation()

  const primaryControl = controllings?.[0] // Ambil data kontrol pertama

  const [showDiskonColumn, setShowDiskonColumn] = useState(false)

  useEffect(() => {
    if (primaryControl) {
      setShowDiskonColumn(primaryControl.name === 'buka')
    }
  }, [primaryControl])

  const filteredColumns = showDiskonColumn
    ? columns
    : columns.filter((col) => col.key !== 'input_diskon_manual')

  const handleSwitchChange = (checked: boolean, controlId: string) => {
    const updatedName = checked ? 'buka' : 'tutup'

    updateOutletMutation.mutate(
      { _id: controlId, name: updatedName },
      {
        onSuccess: () => {
          message.success(`Berhasil mengubah status menjadi ${updatedName}`)
          setShowDiskonColumn(checked)
        },
        onError: () => {
          message.error('Gagal mengubah status')
        },
      }
    )
  }
  //tukah
  return (
    <>
      <div className={`page-container ${isLoading ? 'loading' : ''}`}>
        <div
          className="content"
          style={{
            background: 'white',
            padding: '20px',
            // marginBottom: '10px',
            borderRadius: '10px 10px 0px 0px',
            fontSize: '30px',
            borderBottom: '1px',
          }}
        >
          Tambah Tagihan
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '0px 0px 10px 10px',
          }}
        >
          <div style={{ paddingBottom: '0px', border: 'red' }}>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
              <Col span={12}>
                <span style={labelStyle}>Nama Penerima</span>
                <span style={labelColonStyle}>:</span>
                <Select
  showSearch
  placeholder="Pilih Pelanggan"
  style={{ width: '70%' }}
  optionFilterProp="label"
  filterOption={(input: any, option: any) =>
    option?.label?.toString().toLowerCase().includes(input.toLowerCase())
  }
  value={selectedContact as any}
  onChange={handleContactChange}
>
  {Array.isArray(contacts) &&
    contacts
      .filter((contact) => contact.outlet_name === warehouseId)
      .map((item) => (
        <Select.Option
          key={item._id}
          value={item._id}
          label={item.name}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{item.name}</span>
            <Badge

  style={{ backgroundColor: '#52c41a', cursor: 'pointer' }}
  onClick={() => navigate(`/detailpiutangperkontak?id=${item._id}`)}
/>
          </div>
        </Select.Option>
      ))}
</Select>
              </Col>
              <Col span={12}>
                <span style={labelStyle}>Outlet</span>
                <span style={labelColonStyle}>:</span>
               
                <Select
                  placeholder="Warehouse"
                  showSearch
                  style={{ width: '70%' }}
                  optionFilterProp="label"
                  filterOption={(input: any, option: any) =>
                    option?.label
                      ?.toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={selectedWarehouseId}
                  onChange={handleWarehouseChange}
                  disabled={!user?.isAdmin}
                >
                  {gudangdb?.map((warehouse) => (
                    <Select.Option
                      key={warehouse.id}
                      value={warehouse.id}
                      label={warehouse.name}
                    >
                      {warehouse.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: '10px' }}>
              <Col span={12}>
                <span style={labelStyle}>No Invoice</span>
                <span style={labelColonStyle}>:</span>
                <Input style={{ width: '70%' }} value={refNumber} readOnly />
              </Col>
              <Col span={12}>
                <span style={labelStyle}>Nama Tag</span>
                <span style={labelColonStyle}>:</span>
                <Select
                  mode="multiple"
                  placeholder="Tag"
                  showSearch
                  style={{ width: '70%' }}
                  optionFilterProp="label"
                  filterOption={(input: any, option: any) =>
                    option?.label
                      ?.toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={handleTag}
                  value={selectTag}
                >
                  {Array.isArray(tagDb) &&
                    tagDb.map((product: any) => (
                      <Select.Option
                        key={product.id}
                        value={product.id}
                        label={product.name}
                      >
                        {product.name}
                      </Select.Option>
                    ))}
                </Select>
              </Col>
            </Row>
          </div>
          <Form.Item style={{ paddingTop: '0px' }}>
            <DateRange
              onChange={(dates) => {
                setSelectedDates(dates)
              }}
              onDifferenceChange={(diff) => {
                setSelectedDifference(diff)
              }}
              onSave={handleDateRangeSave}
            />
          </Form.Item>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              {/* Button di sebelah kiri */}
              <Button
                type="primary"
                onClick={handleOkClick}
                style={{ marginRight: '20px', width: '120px' }}
              >
                Pilih Barang
              </Button>

              {user?.isAdmin && primaryControl && (
                <Switch
                  checked={showDiskonColumn}
                  onChange={(checked) =>
                    handleSwitchChange(checked, primaryControl._id)
                  }
                  checkedChildren="Buka dan Sembunyikan Diskon"
                  unCheckedChildren="Tutup dan Tampilkan Diskon"
                />
              )}
            </div>
                <Select
                mode="multiple"
                placeholder="Pilih Barang"
                style={{ width: '100%', marginTop: '10px', alignItems: 'center' }}
                optionFilterProp="items"
                filterOption={false}
                onChange={handleProductChange}
                value={selectedFinanceAccountIds}
                showSearch
                onSearch={handleSearch}
                open={dropdownVisible}
                onDropdownVisibleChange={(open) => setDropdownVisible(open)}
                dropdownRender={(menu) => (
                    <div
                    style={{
                        minWidth: '800px',
                        padding: '8px',
                        textAlign: 'center',
                    }}
                    >
                    <div
                        style={{
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        padding: '8px',
                        borderBottom: '1px solid #e8e8e8',
                        backgroundColor: '#f5f5f5',
                        }}
                    >
                        <span style={{ textAlign: 'center' }}>Nama Barang</span>
                    </div>
                    <div
                        style={{
                        maxHeight: '2000px',
                        overflowY: 'auto',
                        }}
                    >
                        {menu}
                    </div>
                    </div>
                )}
                tagRender={customDisplayRender as any}
                >
                {Array.isArray(barangs) &&
                    barangs
                    .sort((a, b) => a.name.localeCompare(b.name, 'id', { numeric: false, sensitivity: 'base' }))
                    .filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .map((product) => (
                        <Select.Option key={product._id} value={product._id} label={product._id}>
                        <div
                            style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '4px 8px',
                            lineHeight: '1.2',
                            fontSize: '12px',
                            borderBottom: '1px solid #e8e8e8',
                            }}
                        >
                            <span
                            style={{
                                textAlign: 'left',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                            }}
                            >
                            {product.name}
                            </span>
                        </div>
                        </Select.Option>
                    ))}
                </Select>



            <Table
              dataSource={dataSource}
              columns={filteredColumns as any}
              rowKey="_id"
              style={{ marginTop: '20px', marginBottom: '20px' }}
              pagination={false}
            />

            <Form
              style={{
                paddingBottom: '0px',
                // justifyItems: 'right',
                border: '1px',
              }}
              form={paymentForm}
            >
              <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                  <span
                    style={{
                      ...labelStyle,
                      fontSize: '16px',
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      ...labelColonStyle,
                      fontSize: '16px',
                    }}
                  >
                    :
                  </span>
                  <Input
                    style={{
                      width: '70%',
                      textAlign: 'right',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                    value={formatRupiah(totalSubtotal)}

                    readOnly
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                  <span
                    style={{
                      ...labelStyle,
                      fontSize: '16px',

                      cursor: 'pointer',
                    }}
                    onClick={handleSetAmountPaid}
                  >
                    Jumlah Bayar
                  </span>
                  <span
                    style={{
                      ...labelColonStyle,
                      fontSize: '16px',
                    }}
                  >
                    :
                  </span>

                  <NumericFormat
                    placeholder="Nilai Pembayaran"
                    value={amountPaid}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    allowNegative={false}
                    onValueChange={(values) => {
                      const { floatValue } = values
                      setAmountPaid(floatValue || 0)
                    }}
                    customInput={Input}
                    max={totalSubtotal}
                    style={{
                      width: '70%',
                      textAlign: 'right',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#007BFF',
                    }}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                  <span
                    style={{
                      ...labelStyle,
                      fontSize: '16px',
                    }}
                  >
                    Sisa Tagihan
                  </span>
                  <span
                    style={{
                      ...labelColonStyle,
                      fontSize: '16px',
                    }}
                  >
                    :
                  </span>
                  <Input
                    value={formatRupiah(piutang)}
                    style={{
                      width: '70%',
                      textAlign: 'right',
                      fontSize: '16px',
                    }}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                  <span style={labelStyle}>Pilih Bank</span>
                  <span style={labelColonStyle}>:</span>
                  <Select
                    showSearch // Menampilkan kolom pencarian
                    // placeholder="Pilih bank"
                    //bangkok
                    // value={bankAccountName || selectedBank}
                    value={selectedBank}
                    onChange={(value) => setSelectedBank(value)}
                    style={{ width: '70%' }}
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      option?.children
                        ?.toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                   {akunBanks
    ?.filter((e) => e.id === 1 || e.id === 2) // Hanya ID 1 dan 2
    .map((e) => (
      <Select.Option key={e.id} value={e.name}>
        {e.name}
      </Select.Option>
    ))}
                  </Select>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                  <span style={labelStyle}>Keterangan</span>
                  <span style={labelColonStyle}>:</span>
                  <Input
                    style={{ width: '70%' }}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Button
                  onClick={handleSave}
                  type="primary"
                  style={{ marginTop: '10px', width: '45%' }}
                  // disabled={isSaveDisabledFinal} 
                >
                  Simpan
                </Button>
               </Row>
            </Form>
          </div>
        </div>
        <div>
      
        </div>
        {isLoading && <div className="loading-overlay"></div>}
      </div>
    </>
  )
}

export default IsiSaldoKasKecil
