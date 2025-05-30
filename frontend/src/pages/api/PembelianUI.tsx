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
import { useAddPembelianMutation } from '../../hooks/pembelianHooks'
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

const PembelianUI = () => {
  const [loadingSpinner, setLoadingSpinner] = useState(false) // State untuk spinner

  const { Panel } = Collapse
  const navigate = useNavigate()

  const { dataStokBarang, fetchStokBarang } = useStokBarang()

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )
  // console.log({selectedWarehouseId})  
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(undefined)
  const [selectedDates, setSelectedDates] = useState<[string, string]>(['', ''])
  

  const formattedDate = dayjs(selectedDates[0], 'DD-MM-YYYY').format('YYYY-MM-DD');

  

  
  const [selectedDate, setSelectedDate] = useState<string | undefined>()
  const { warehouseStock } = useWarehouseStock(
    formattedDate,
    selectedWarehouseId
  )
  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  const { idaDataBarang } = useIdNamaBarang()
  const { data: barangs } = useGetBarangsQuery()
  // console.log({barangs})
  const { data: gudangdb } = useGetWarehousesQuery()
  // console.log({ gudangdb })

  const { data: akunBanks } = useGetAkunBanksQueryDb()

  const { data: tagDb } = useGetTagsQueryDb()



  // const { idContact } = useIdContact('')
  const [warehouseName, setWarehouseName] = useState<string | null>(null)

  const { data: contacts } = useGetFilteredContactsByOutletQuery(warehouseName as any)

  const { data: controllings } = useGetControlQuery()
  const { saveInvoiceData } = SaveApi()


  //
 const { loading, takedueanContactStatusIdandMemoMny } =
    TakePiutangToPerContactStatusIdAndMemoMny(
      'MNY',
      '2',
      warehouseName as any
    )


    
  const getWarehouseName = () => {
    if (!gudangdb || !selectedWarehouseId) return null

    const selectedWarehouse = gudangdb.find(
      (warehouse: { id: number; name: string }) =>
        warehouse.id === Number(selectedWarehouseId)
    )
    return selectedWarehouse ? selectedWarehouse.name : null
  }
  const { data: contactssss } = useGetFilteredContactsByOutletQuery(warehouseName as any);
  
  const firstGroupId = contactssss?.[0]?.id_kontak || null;
// console.log({warehouseName})
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
  const addPosMutation = useAddPembelianMutation()

  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: any
  }>({})
console.log({productQuantities})
  const [selectedFinanceAccountIds, setSelectedFinanceAccountIds] = useState<
    any[]
  >([])
// console.log({selectedFinanceAccountIds})
  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(user.id_outlet)
    }
  }, [user])
  const getDataFromLocalStorage = () => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : [];
  };

  // Menggunakan state untuk menyimpan data
  const [dataSource, setDataSource] = useState<any[]>(getDataFromLocalStorage());

  // Menyimpan data ke localStorage setiap kali dataSource berubah
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(dataSource));
  }, [dataSource]);

  useEffect(() => {
    if (selectedFinanceAccountIds.length > 0 && selectedWarehouseId !== null) {
      selectedFinanceAccountIds.forEach((productId: any) => {
        fetchStokBarang(productId, Number(selectedWarehouseId))
      })
    }
  }, [selectedFinanceAccountIds, selectedWarehouseId])

  const [selectedProductStocks, setSelectedProductStocks] = useState<any[]>([])
  useEffect(() => {
    if (barangs && selectedFinanceAccountIds.length > 0) {
      const newQuantities: Record<number, number> = {}
      const newSelectedStocks: number[] = []
  
      barangs.forEach((barang: any) => {
        const productId = barang.id
        const qty = barang.qty // Asumsi `stock` ada di `barangs`
  
        if (productId !== undefined && qty !== undefined && selectedFinanceAccountIds.includes(productId)) {
          newQuantities[productId] = qty
          newSelectedStocks.push(qty)
        }
      })
  
      setProductQuantities(newQuantities)
      setSelectedProductStocks(newSelectedStocks)
    }
  }, [barangs, selectedFinanceAccountIds, selectedWarehouseId])
  

  const customDisplayRender = (value: any) => {
    return ''
  }

  const handleProductChange = (values: any[]) => {
    setSelectedFinanceAccountIds(values)
  }
  // console.log({ selectedFinanceAccountIds })
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: any) => {
    setSearchValue(value)
  }

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [selectedPrices, setSelectedPrices] = useState<{
    [key: string]: string
  }>({})
  // console.log({ selectedPrices })
  //sen
  const discountRates = [
    { label: 'Umum 2', percentage: 0 },
    { label: 'Retail 10%', percentage: 10 },
    { label: 'Applikator 16%', percentage: 16 },
    { label: 'Toko 18%', percentage: 18 },
    { label: 'Nego 19%', percentage: 19 },
    { label: 'Khusus 21%', percentage: 20.5 },
    {
      label: 'Istimewa SP 23%',
      percentage: (() => {
        const applicableCategories = barangs?.map(
          (barang) => barang.pos_product_category_id
        )
        // console.log({ applicableCategories })
        const category19 = applicableCategories?.find(
          (category) => category === 19
        )
        const category10 = applicableCategories?.find(
          (category) => category === 10
        )

        if (category19) {
          return 23 // 30% untuk kategori 19
        } else if (category10) {
          return 25.5 // 25.5% untuk kategori 10
        }

        return 10 // Default 10% untuk kategori lainnya
      })(),
    },
  ]

  // console.log(discountRates)

  const [discountedPrices, setDiscountedPrices] = useState<{
    [key: string]: number
  }>({})

  const [priceDifferences, setPriceDifferences] = useState<{
    [key: string]: number
  }>({})

  const [selectedDiscounts, setSelectedDiscounts] = useState<{
    [key: string]: number
  }>({})
  // console.log({ selectedDiscounts })
  const [selectedProductPrices, setSelectedProductPrices] = useState<
    Record<string, number>
  >({})

  const handlePriceClick = (rateLabel: string, product: any) => {
    const selectedDiscount = discountRates.find(
      (rate) => rate.label === rateLabel
    )
    setSelectedProductPrices((prevPrices) => ({
      ...prevPrices,
      [product.id]: product.price,
    }))
    if (selectedDiscount) {
      setSelectedPrices((prev) => ({
        ...prev,
        [product.id]: rateLabel,
      }))

      setSelectedDiscounts((prev) => ({
        ...prev,
        [product.id]: selectedDiscount.percentage,
      }))

      const discountedPrice = (
        product.price -
        (product.price * selectedDiscount.percentage) / 100
      ).toFixed(2)

      setDiscountedPrices((prev) => ({
        ...prev,
        [product.id]: Number(discountedPrice),
      }))

      const difference = (product.price - Number(discountedPrice)).toFixed(2)

      setPriceDifferences((prev) => ({
        ...prev,
        [product.id]: Number(difference),
      }))
    }
  }

  const calculateDiscount = (basePrice: number, percentage: number): number => {
    return basePrice - basePrice * (percentage / 100)
  }

  const calculateSubtotal = (price: number, qty: number) => {
    // console.log({ price })

    return price * qty
  }
  const calculateGapPrice = (gapPrice: number, qty: number) => {
    return gapPrice * qty
  }

  const handleDiscountChange = (value: string, record: any) => {
    const selectedDiscount = discountRates.find((rate) => rate.label === value)

    const basePrice =
      selectedProductPrices[record.finance_account_id] || record.basePrice

    if (selectedDiscount) {
      const newPrice = calculateDiscount(basePrice, selectedDiscount.percentage)
      const gapPrice = Number(basePrice) - Number(newPrice)
      // const gapPrice = Number(basePrice)
      const gapPriceTotal = gapPrice * record.qty

      setDataSource((prev) =>
        prev.map((item: any) =>
          item.finance_account_id === record.finance_account_id
            ? {
                ...item,
                price: Number(newPrice),
                subtotal: calculateSubtotal(newPrice, item.qty),
                selectedDiscountValue: selectedDiscount.percentage,
                selectedDiscount: selectedDiscount.label,
                gapPrice: gapPrice,
                gapPriceTotal: gapPriceTotal,
              }
            : item
        )
      )
    } else {
      setDataSource((prev) =>
        prev.map((item: any) =>
          item.finance_account_id === record.finance_account_id
            ? {
                ...item,
                price: Number(basePrice),
                subtotal: calculateSubtotal(basePrice, item.qty),
                selectedDiscountValue: 0,
                selectedDiscount: 'Retail',
                gapPrice: 0,
                gapPriceTotal: 0,
              }
            : item
        )
      )
    }
  }

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
  const retailDiscount =
    discountRates.find((rate) => rate.label === 'Umum 2')?.percentage || 0
  //oceoce
  //Umum 2

  const [hargaDasar, setHargaDasar] = useState<{ [key: string]: number }>({})
  // console.log({ hargaDasar })
  const handleOkClick = () => {
    setDropdownVisible(false)

    const selectedItems = barangs!.filter((item: any) =>
      selectedFinanceAccountIds.includes(item.id)
    )

    setDataSource((prev) => {
      const newItems = selectedItems
        .filter(
          (item) =>
            !prev.some(
              (existingItem) => existingItem.finance_account_id === item.id
            )
        )
        .map((item) => {
          const retailPrice = item.price - (item.price * retailDiscount) / 100

          return {
            finance_account_id: item.id,
            finance_account_name: item.name,
            basePrice: item.price,

            // price: Number(discountedPrices[item.id]) || retailPrice,
            price: Number(discountedPrices[item.id]) || retailPrice,

            qty: null,

            selectedDiscount: selectedPrices[item.id] || 'Umum 2',

            selectedDiscountValue: selectedDiscounts[item.id] || retailDiscount,

            gapPrice:
              priceDifferences[item.id] ||
              (item.price - retailPrice).toFixed(2),

            subtotal: Number(discountedPrices[item.id]) || retailPrice,

            satuan: item.unit?.name,
          }
        })

      setHargaDasar((prevHargaDasar) => {
        const updatedHargaDasar = { ...prevHargaDasar }
        newItems.forEach((item) => {
          updatedHargaDasar[item.finance_account_id] = item.basePrice
        })
        return updatedHargaDasar
      })

      return [...prev, ...newItems]
    })

    setSelectedFinanceAccountIds(selectedFinanceAccountIds.map(Number))
  }

  const handleQtyChange = (value: number, record: any) => {
    const basePrice =
      selectedProductPrices[record.finance_account_id] || record.basePrice
    const newPrice = calculateDiscount(
      basePrice,
      record.selectedDiscountValue || 0
    )

    const priceToUse = record.harga_setelah_diskon || newPrice

    const newSubtotal = newPrice * value

    setDataSource((prev) =>
      prev.map((item) =>
        item.finance_account_id === record.finance_account_id
          ? {
              ...item,
              qty: value,
              price: newPrice,
              harga_setelah_diskon: priceToUse,
              subtotal: newSubtotal,
              gapPrice: Number(basePrice) - Number(newPrice),
              gapPriceTotal: (Number(basePrice) - Number(newPrice)) * value,
            }
          : item
      )
    )
  }

  const handleDelete = (key: any) => {
    setDataSource((prev) =>
      prev.filter((pos) => pos.finance_account_id !== key)
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
  const selectedContactName = selectedContact 
  ? contacts?.find(contact => contact._id === selectedContact)?.name 
  : null;
// console.log({selectedContact})
  const handleContactChange = (value: number) => {
    setSelectedContact(value)
  }

  const { idContact } = useIdContact(firstGroupId as any)
  // console.log({ idContact })
  const [totalSubtotal, setTotalSubtotal] = useState<number>(0)

  const selectedReceivable = selectedContact
    ? idContact.find((contact: any) => contact.id === selectedContact)
        ?.receivable || 0
    : '--'
  const nilaiPlatform = gudangdb?.find((contact: any) => contact.name === warehouseName)
        ?.platform || 0
//  console.log({nilaiPlatform})

  const formatRupiah = (number: any) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(number)
  }
  const totalReceivable = idContact
    ?.filter((contact: any) => contact.group_name === warehouseId)
    .reduce((total: number, contact: any) => {
      const receivable = parseFloat(contact.receivable) || 0
      return total + receivable
    }, 0)
    const lastReceivable = totalReceivable +totalSubtotal
    
    const safeTotalReceivable = Number(lastReceivable) || 0;
    const safeNilaiPlatform = Number(nilaiPlatform) || 0;
    
    const limitizeTrans = safeTotalReceivable > safeNilaiPlatform;

  const [formattedTotalSubtotal, setFormattedTotalSubtotal] =
    useState<string>('')

  useEffect(() => {
    const calculateTotalSubtotal = () => {
      const total = dataSource.reduce((total, item) => total + item.subtotal, 0)
      setTotalSubtotal(total)

      setFormattedTotalSubtotal(total.toLocaleString('id-ID'))
    }

    calculateTotalSubtotal()
  }, [dataSource])

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

    return `UBI-${idOutlet}-${timestamp}-${String(shortNumber).padStart(
      5,
      '0'
    )}`
  }

  const [refNumber, setRefNumber] = useState<string>('')
console.log({refNumber})
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

  // const isSaveDisabled = !selectedContact || !bankAccountId || limitizeTrans;

  const handleSetAmountPaid = () => {
    setAmountPaid(totalSubtotal)
  }
  const [memo, setMemo] = useState('')

  const [error, setError] = useState<string | null>(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);  // State untuk menonaktifkan tombol
  const [clickedTime, setClickedTime] = useState<number | null>(null);  // State untuk melacak waktu klik
  
  // Gabungkan kondisi validasi dan kontrol waktu
  const isSaveDisabledFinal =
    !selectedContact ||
    !bankAccountId ||
    (termIdSimpan !== 2 && termIdSimpan !== 0 && limitizeTrans) ||
    isSaveDisabled; // Tombol akan dinonaktifkan berdasarkan kondisi
    const updateBarangMutation = useUpdateBarangMutation();

    const handleUpdateStock = async () => {
      try {
        dataSource.forEach((item) => {
          const matchingStock = productQuantities[item.finance_account_id] || 0;
          const latest_stock = matchingStock + item.qty;
    
          console.log("🔥 ID Barang:", item.finance_account_id, "Stok Baru:", latest_stock);
    
          // Cari data barang asli berdasarkan finance_account_id
          const barangLama = barangs?.find((b) => b.id === item.finance_account_id);
          if (!barangLama) {
            console.warn(`Barang dengan ID ${item.finance_account_id} tidak ditemukan!`);
            return;
          }
    
          updateBarangMutation.mutate({
            ...barangLama, // Semua data barang asli
            qty: latest_stock > 0 ? latest_stock : 0, // Update stok
          });
        });
    
        console.log("✅ Semua stok berhasil diperbarui!");
      } catch (error) {
        console.error("❌ Gagal update stok barang:", error);
      }
    };
    
    
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
  
    const saveNameContact = idContact.reduce((map: any, warehouse: any) => {
      map[warehouse.id] = warehouse.name;
      return map;
    }, {});
    const saveContactName = saveNameContact[selectedContact as any];
  
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
      jalur: 'pembelian',
      ref_number: refNumber,
      ref_transaksi: 0,
      status_id: status,
      unique_id: uniqueNumber,
      trans_date: formatDate(selectedDates[0]),
      due_date: dueDate,
      contact_id: selectedContact,
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
        const matchingStock = productQuantities[item.finance_account_id];
        const latest_stock = matchingStock + item.qty;
        console.log("🔥 item.id:", item.finance_account_id);
        const matchingBarang = barangs?.find(
          (barang) => barang.id === item.finance_account_id
        );
        return {
          id: 123,
          amount: item.subtotal,
          discount_amount:
            item.gapPrice || item.input_diskon_manual || 0,
          finance_account_id: item.finance_account_id,
          discount_percent: item.selectedDiscountValue || 0,
          name: item.finance_account_name,
          tax_id: null,
          desc: '',
          qty: item.qty,
          qty_update: latest_stock || 0,
          price: item.price,
          unit_id: item.unit_id,
          satuan: item.name,
          pos_product_category_id: matchingBarang?.pos_product_category_id || null, // Tambahkan kategori produk
          // pos_product_category_id: 7

        };
      }),
      witholdings,
      contacts: [
        {
          id: selectedContact,
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
          handleUpdateStock()
          setTimeout(() => {
            setIsLoading(false);
            // navigate(`/listpembelian/${refNumber}`);
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

  useEffect(() => {
    if (isSaveDisabled) {
      const timer = setTimeout(() => {
        setIsSaveDisabled(false); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaveDisabled]);

  
  
  
  
  const [stockQuantities, setStockQuantities] = useState<
    Record<string, number>
  >({})

  useEffect(() => {
    const newStockQuantities: Record<string, number> = {}
    barangs?.forEach((product) => {
      const stockQuantity =
        warehouseStock.find((stock: any) => stock.id === product.id)?.stock || 0
      newStockQuantities[product.id] = stockQuantity
    })
    setStockQuantities(newStockQuantities)
  }, [barangs, warehouseStock])

  const columns = [
    {
      title: 'Barangss',
      dataIndex: 'finance_account_id',
      key: 'finance_account_id',
      align: 'left',
      className: 'wrap-text',
    
      render: (id: any) => (
        <div>
          <Select
            showSearch
            placeholder="Barang"
            style={{ width: '420px' }}
            optionFilterProp="items"
            filterOption={(input, option) =>
              option?.items?.toString()
                ? option.items
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : false
            }
            onChange={handleProductChange}
            defaultValue={id}
          >
            {barangs?.map((product) => {
              const stockQuantity = product.qty || 0 // Ambil qty langsung dari barangs
    
              if (stockQuantity === 0) return null
    
              return (
                <Select.Option key={product.id} value={product.id}>
                  <div style={{ display: 'flex', alignItems: 'left' }}>
                    <span style={{ paddingRight: '16px' }}>{product.name}</span>
                    <Badge
                      count={stockQuantity}
                      overflowCount={Infinity}
                      style={{
                        backgroundColor: '#52C41A',
                        borderColor: '#52C41A',
                        color: 'white',
                        marginLeft: 'auto',
                        marginRight: '50px',
                      }}
                    />
                  </div>
                </Select.Option>
              )
            })}
          </Select>
        </div>
      ),
    },
    // {
    //   title: 'Diskon',
    //   dataIndex: 'input_diskon_manual',
    //   key: 'input_diskon_manual',
    //   align: 'center',

    //   render: (text: any, record: any) => (
    //     <div>
    //       <Input
    //         type="number"
    //         defaultValue={text || 0}
    //         onChange={(e) => {
    //           const inputDiskonManual = parseFloat(e.target.value) || 0
    //           console.log({ inputDiskonManual })
    //           const basePrice = hargaDasar[record.finance_account_id] || 0
    //           const hargaSetelahDiskon = basePrice - inputDiskonManual
    //           const newSubtotal = hargaSetelahDiskon * record.qty

    //           setDataSource((prev) =>
    //             prev.map((item) =>
    //               item.finance_account_id === record.finance_account_id
    //                 ? {
    //                     ...item,
    //                     input_diskon_manual: inputDiskonManual,
    //                     harga_setelah_diskon: hargaSetelahDiskon,
    //                     subtotal: newSubtotal,
    //                   }
    //                 : item
    //             )
    //           )
    //         }}
    //       />
    //     </div>
    //   ),
    // },
    {
      title: 'Diskon',
      dataIndex: 'input_diskon_manual',
      key: 'input_diskon_manual',
      align: 'center',

      render: (text: any, record: any) => (
        <div>
          <Input
            type="number"
            defaultValue={text || 0}
            onChange={(e) => {
              const inputDiskonManual = parseFloat(e.target.value) || 0
              const basePrice = hargaDasar[record.finance_account_id] || 0
              const hargaSetelahDiskon = basePrice - inputDiskonManual

              setDataSource((prev) =>
                prev.map((item) =>
                  item.finance_account_id === record.finance_account_id
                    ? {
                        ...item,
                        input_diskon_manual: inputDiskonManual,
                        harga_setelah_diskon: hargaSetelahDiskon,
                        subtotal: hargaSetelahDiskon * item.qty,
                      }
                    : item
                )
              )
            }}
          />
        </div>
      ),
    },
    {
        title: 'Harga',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      
        render: (text: any, record: any) => {
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Input
                style={{ textAlign: 'right', width: '100px' }}
                value={record.price} // Sekarang pakai harga dari record
                onChange={(e) => {
                  const newPrice = parseFloat(e.target.value) || 0
                  setDataSource((prev) =>
                    prev.map((item) =>
                      item.finance_account_id === record.finance_account_id
                        ? {
                            ...item,
                            price: newPrice, // Update harga baru
                            subtotal: newPrice * item.qty, // Hitung subtotal baru
                          }
                        : item
                    )
                  )
                }}
              />
            </div>
          )
        },
      },
      
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        align: 'center',
      
        render: (text: any, record: any) => {
          const product = barangs?.find(
            (barang: any) => barang.id === record.finance_account_id
          )
          const stockQuantity = product?.qty || 0 // Ambil qty langsung dari barangs
      
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <NumericFormat
                value={text}
                allowNegative={false}
                thousandSeparator="."
                decimalSeparator=","
                onValueChange={(values) => {
                  const { floatValue } = values
                  if (floatValue === undefined || isNaN(floatValue)) return
      
                  const isOverStock = floatValue > stockQuantity
      
                  setDataSource((prev) =>
                    prev.map((item) =>
                      item.finance_account_id === record.finance_account_id
                        ? {
                            ...item,
                            qty: floatValue, // Simpan nilai asli yang diketik user
                            subtotal: (item.price || 0) * floatValue, // Hitung subtotal baru
                            error: isOverStock
                              ? `Stok tersedia: ${stockQuantity}`
                              : undefined,
                          }
                        : item
                    )
                  )
                }}
                customInput={Input}
                style={{ textAlign: 'center', width: '70px' }}
              />
      
              {record.error && (
                <span style={{ color: 'red', fontSize: '12px' }}>
                  {record.error}
                </span>
              )}
            </div>
          )
        },
      },
      
      {
        title: 'Subtotal',
        dataIndex: 'subtotal',
        key: 'subtotal',
        align: 'right',
        render: (text: any) => (
          <div>{text.toLocaleString('id-ID')}</div>
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
            onClick={() => handleDelete(record.finance_account_id)}
          />
        </div>
      ),
    },
  ]
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
                <span style={labelStyle}>Nama Supplier</span>
                <span style={labelColonStyle}>:</span>
                <Select
                  showSearch
                  placeholder="Pilih Suppplier"
                  style={{ width: '70%' }}
                  optionFilterProp="label"
                  filterOption={(input: any, option: any) =>
                    option?.label?.toString().toLowerCase().includes(input.toLowerCase())
                  }
                  value={selectedContact}
                  onChange={handleContactChange}
                >
                {Array.isArray(contacts) &&
                   contacts
                     .filter(
                       (contact) =>
                         contact.outlet_name === warehouseId &&
                         contact.id_kontak === '67f1342a839490b3f3ff81b8'
                     )
                     .map((item) => (
                       <Select.Option
                         key={item._id}
                         value={item._id}
                         label={item.name}
                       >
                         <div
                           style={{
                             display: 'flex',
                             justifyContent: 'space-between',
                             alignItems: 'center',
                           }}
                         >
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
                <Badge
        count={lastReceivable?.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        })}
        style={{ backgroundColor: '#52c41a' }}
      />
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
          justifyContent: 'space-between',
          textAlign: 'center',
          fontWeight: 'bold',
          padding: '8px',
          borderBottom: '1px solid #e8e8e8',
          backgroundColor: '#f5f5f5',
        }}
      >
        <span style={{ flex: 2, textAlign: 'center' }}>Nama Barang</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Qty</span>

        {discountRates.map((rate) => (
          <span key={rate.label} style={{ flex: 1, textAlign: 'center' }}>
            {rate.label}
          </span>
        ))}
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
      .sort((a, b) => {
        const nameComparison = a.name.localeCompare(b.name, 'id', {
          numeric: false,
          sensitivity: 'base',
        });
        if (nameComparison !== 0) {
          return nameComparison;
        }

        const extractNumber = (name: string) => {
          const match = name.match(/(\d+(\.\d+)?)[mM]/);
          return match ? parseFloat(match[1]) : 0;
        };

        return extractNumber(a.name) - extractNumber(b.name);
      })
      .filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      .map((product) => {
        const filteredDiscountRates = discountRates.map((rate) => {
          if (rate.label === 'Istimewa SP 23%') {
            if (product.pos_product_category_id === 19) {
              return { ...rate, percentage: 23 };
            }
            if (product.pos_product_category_id === 10) {
              if (product.name.includes('PIPA KOTAK GALVANIS 4X4X')) {
                return { ...rate, percentage: 25.5 };
              }
              return { ...rate, percentage: 22.5 };
            }

            return { ...rate, percentage: null };
          }
          return rate;
        });

        return (
          <Select.Option key={product.id} value={product.id} label={product.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 8px',
                lineHeight: '1.2',
                fontSize: '12px',
                borderBottom: '1px solid #e8e8e8',
              }}
            >
              <span
                style={{
                  flex: 2,
                  textAlign: 'left',
                  borderRight: '1px solid #e8e8e8',
                  paddingRight: '8px',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {product.name}
              </span>

              <span
                style={{
                  flex: 1,
                  textAlign: 'center',
                  borderRight: '1px solid #e8e8e8',
                  paddingRight: '8px',
                  paddingLeft: '8px',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {/* {Number(product.qty).toLocaleString('id-ID')} */}
              </span>

              {filteredDiscountRates.map((rate) => {
                const discountedPrice =
                  rate.percentage !== null
                    ? (
                        product.price -
                        (product.price * rate.percentage) / 100
                      ).toFixed(2)
                    : 0;

                return (
                  <span
                    key={rate.label}
                    onClick={() => handlePriceClick(rate.label, product)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      backgroundColor:
                        selectedPrices[product.id] === rate.label
                          ? '#52C41A'
                          : 'transparent',
                      cursor: 'pointer',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      borderRight: '1px solid #e8e8e8',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                    }}
                  >
                    {/* {Number(discountedPrice).toLocaleString('id-ID')} */}
                  </span>
                );
              })}
            </div>
          </Select.Option>
        );
      })}
</Select>;


            {/* <div>
          {warehouseStock.length > 0 ? (
            warehouseStock.map((item) => (
              <div key={item.id}>
                <p>{`Code: ${item.code}`}</p>
                <p>{`Name: ${item.name}`}</p>
                <p>{`Stock: ${item.stock}`}</p>
                <p>{`Stock Total: ${item.stock_total}`}</p>
              </div>
            ))
          ) : (
            <p>No stock data available</p>
          )}
        </div> */}

            <Table
              dataSource={dataSource}
              columns={filteredColumns as any}
              rowKey="finance_account_id"
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
                    {akunBanks?.map((e) => (
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
        <div>
          <Select
            mode="multiple"
            placeholder="Pilih Barang"
            style={{ width: '100%', marginTop: '10px', alignItems: 'center' }}
            optionFilterProp="items"
            filterOption={false}
            onChange={handleProductChange}
            // value={selectedFinanceAccountIds}
            showSearch
            onSearch={handleSearch}
            // open={dropdownVisible}
            // onDropdownVisibleChange={(open) => setDropdownVisible(open)}
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
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    padding: '8px',
                    borderBottom: '1px solid #e8e8e8',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <span style={{ flex: 2, textAlign: 'center' }}>
                    Nama Barang
                  </span>
                  {/* <span style={{ flex: 1, textAlign: 'center' }}>Qty</span> */}

                  {discountRates.map((rate) => (
                    <span
                      key={rate.label}
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      {rate.label}
                    </span>
                  ))}
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
          
              .sort((a, b) => {

                const nameComparison = a.name.localeCompare(b.name, 'id', {
                  numeric: false,
                  sensitivity: 'base',
                });
                if (nameComparison !== 0) {
                  return nameComparison; 
                }
         
                const extractNumber = (name: string) => {
                  const match = name.match(/(\d+(\.\d+)?)[mM]/);
                  return match ? parseFloat(match[1]) : 0; 
                };
          
                return extractNumber(a.name) - extractNumber(b.name);
              })
              .filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
              )
                .map((product) => {
                  // const stockQuantity =
                  //   warehouseStock.find((stock: any) => stock.id === product.id)
                  //     ?.stock || 0
                  // if (stockQuantity === 0) return null
                  const filteredDiscountRates = discountRates.map((rate) => {
                    if (rate.label === 'Istimewa SP 23%') {
                      if (product.pos_product_category_id === 19) {
                        return { ...rate, percentage: 23 }
                      }
                      // if (product.pos_product_category_id === 10) {
                      //   if (product.name.includes('PIPA KOTAK GALVANIS 4X4X')) {
                      //     return { ...rate, percentage: 25.5 }
                      //   }
                      //   return { ...rate, percentage: 22.5 }
                      // }

                      return { ...rate, percentage: null }
                    }
                    return rate
                  })

                  return (
                    <Select.Option
                      key={product.id}
                      value={product.id}
                      label={product.id}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '4px 8px',
                          lineHeight: '1.2',
                          fontSize: '12px',
                          borderBottom: '1px solid #e8e8e8',
                        }}
                      >
                        <span
                          style={{
                            flex: 2,
                            textAlign: 'left',
                            borderRight: '1px solid #e8e8e8',
                            paddingRight: '8px',
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                          }}
                        >
                          {product.name}
                        </span>

                        {/* <span
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            borderRight: '1px solid #e8e8e8',
                            paddingRight: '8px',
                            paddingLeft: '8px',
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                          }}
                        >
                          {Number(stockQuantity).toLocaleString('id-ID')}
                        </span> */}

                        {filteredDiscountRates.map((rate) => {
                          const discountedPrice =
                            rate.percentage !== null
                              ? (
                                  product.price -
                                  (product.price * rate.percentage) / 100
                                ).toFixed(2)
                              : 0

                          return (
                            <span
                              key={rate.label}
                              onClick={() =>
                                handlePriceClick(rate.label, product)
                              }
                              style={{
                                flex: 1,
                                textAlign: 'center',
                                backgroundColor:
                                  selectedPrices[product.id] === rate.label
                                    ? '#52C41A'
                                    : 'transparent',
                                cursor: 'pointer',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                borderRight: '1px solid #e8e8e8',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                              }}
                            >
                              {Number(discountedPrice).toLocaleString('id-ID')}
                            </span>
                          )
                        })}
                      </div>
                    </Select.Option>
                  )
                })}
          </Select>
        </div>
        </div>
        {isLoading && <div className="loading-overlay"></div>}
      </div>
    </>
  )
}

export default PembelianUI
