import React, { useState, useEffect, useContext, useMemo } from 'react'
import { Button, Col, DatePicker, Input, Row, Select, Table, Tag, Tooltip } from 'antd'

import { useGetTransaksisQuery, useGetTransactionsByContactQuery } from '../../hooks/transactionHooks'
import { useGetTransaksisQuerymu } from '../../hooks/transactionHooks'
import { useIdInvoice } from './takeSingleInvoice'
import UserContext from '../../contexts/UserContext'
import { useGetContactsQuery } from '../../hooks/contactHooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import dayjs from 'dayjs';
import { useGetFilteredContactsByOutletQuery } from '../../hooks/contactHooks'
import { useGetReturnByIdQuery } from '../../hooks/returnHooks'
import { useGetPindahByWarehouseAndDate, useGetPindahBywWarehouseAndDate } from '../../hooks/pindahHooks'

const AuditQty: React.FC = () => {
  const { data } = useGetTransaksisQuery()
  const location = useLocation()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )

  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)


  const {
    data: transaksi,
    isLoading,
    error,
  } = useGetTransaksisQuerymu(selectedWarehouseId, startDate, endDate)


   const {
      data: dataPindah,
    } = useGetPindahByWarehouseAndDate(selectedWarehouseId, startDate, endDate)
    // console.log({dataPindah})
  
  const contactIds = transaksi?.map((item) => item.contact_id);
  const itemNames = useMemo(() => {
    if (!transaksi || transaksi.length === 0) {
      return [];
    }
    const allNames = transaksi.flatMap((transaction) =>
      transaction.items.map((item) => item.name)
    );
    return [...new Set(allNames)];
  }, [transaksi]);
  const pelengganId = useMemo(() => {
    if (!transaksi || transaksi.length === 0) {
      return [];
    }
    const allNames = transaksi.flatMap((transaction) =>
      transaction.contacts.map((item) => item.id)
    );
    return [...new Set(allNames)];
  }, [transaksi]);
  const { data: contacts } = useGetContactsQuery()
  const { data: gudangs } = useGetoutletsQuery()

  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(Number(user.id_outlet))
    }
  }, [user])
  const [selectedRefNumber, setSelectedRefNumber] = useState<string | null>(
    null
  )
  const { getIdAtInvoice } = useIdInvoice(selectedRefNumber || '')

  const handleRefNumberClick = (ref_number: string) => {
    setSelectedRefNumber(ref_number)
  }

  const [searchText, setSearchText] = useState<string>('')
  const selectedGudangName = selectedWarehouseId 
  ? gudangs?.find(contact => Number(contact.id_outlet) === selectedWarehouseId)?.nama_outlet 
  : null;
    const { data: pelanggan } = useGetFilteredContactsByOutletQuery(selectedGudangName as any)
    const selectedPelangganName = selectedWarehouseId 
    ? contacts?.find(contact => Number(contact.id) === selectedWarehouseId)?.name 
    : null;

  const getContactName = (contactId: string): string => {
    const contact = contacts?.find((contact: any) => contact.id === contactId);
    return contact?.name || 'Unknown';
  };
  const getWarehouseName = (warehouse_id: string | number) => {
    const warehouse = gudangs?.find(
      (gudang) => String(gudang.id_outlet) === String(warehouse_id)
    )
    return warehouse ? warehouse.nama_outlet : 'waiting...'
  }

  const formatDateForBackend = (dateString: string) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }
  const handleDateChange = (date: any, dateString: string) => {
    const formattedDate = formatDateForBackend(dateString) // Format tanggal
    setStartDate(formattedDate) // Set tanggal yang sudah diformat
    setEndDate(formattedDate) // Set tanggal yang sudah diformat
  }
  const handleDateChangeSampai = (date: any, dateString: string) => {
    const formattedDate = formatDateForBackend(dateString) // Format tanggal

    setEndDate(formattedDate) // Set tanggal yang sudah diformat
  }
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  useEffect(() => {
    setStartDate(dayjs().format('YYYY-MM-DD'));
  }, []);
  useEffect(() => {
    setEndDate(dayjs().format('YYYY-MM-DD'));
  }, []);
  
  const getStatus = (transaction: any) => {
    const totalDownPayment = transaction.witholdings.reduce(
      (sum: number, witholding: any) => sum + (witholding.down_payment || 0),
      0
    )

    const due = transaction.amount - totalDownPayment

    if (due === 0 || due <= 0) {
      return 'Lunas'
    } else if (totalDownPayment > 0 && due > 0) {
      return 'Dibayar Sebagian'
    } else {
      return 'Belum Dibayar'
    }
  }
 
  const [searchContact, setSearchContact] = useState<string | undefined>()
  const [searchNamaBarang, setSearchNamaBarang] = useState<any | undefined>()
  const [searchQty, setSearchQty] = useState<any | undefined>()

  // console.log({searchQty})
  const [searchWarehouse, setSearchWarehouse] = useState<number | undefined>()
  const [searchStatus, setSearchStatus] = useState<string | undefined>()
  const [searchRef, setSearchRef] = useState('')
  const [searchPesan, setSearchPesan] = useState('')
  const { data: transactionsIdContact} = useGetTransactionsByContactQuery(searchContact as any);
  const handleSelectChange = (value: string) => {
    setSearchNamaBarang(value);
  };

  const qtyItems = useMemo(() => {
    if (!transaksi || transaksi.length === 0 || !searchNamaBarang) {
      return [];
    }
    const lowerSearchRef = searchNamaBarang.toLowerCase();
  
    const relatedItems = transaksi.flatMap((transaction) =>
      transaction.items.filter((item) =>
        item.name?.toLowerCase().includes(lowerSearchRef)
      )
    );
  
    const allQty = relatedItems.map((item) => item.qty);
    return [...new Set(allQty)];
  }, [transaksi, searchNamaBarang]);



const allData = [...(transaksi ?? []), ...(dataPindah ?? [])];

const filteredData = allData
  .filter((transaction) => {
    if (searchStatus) {
      const statusText = getStatus(transaction);
      return statusText.toLowerCase() === searchStatus.toLowerCase();
    }
    return true;
  })
  .filter((transaction) => transaction.jalur === 'penjualan' || transaction.jalur === 'pindah')
  .filter((transaction) => {
    if (searchRef) {
      const lowerSearchRef = searchRef.toLowerCase();
      return (
        transaction.message?.toLowerCase().includes(lowerSearchRef) ||
        transaction.ref_number?.toLowerCase().includes(lowerSearchRef)
      );
    }
    return true;
  })
  .filter((contact) => {
    if (searchContact) {
      return contact.contact_id === Number(searchContact);
    }
    return true;
  })
  // .filter((transaction) => {
  //   if (searchNamaBarang) {
  //     const lowerSearchRef = searchNamaBarang.toLowerCase();
  //     return transaction.items?.some(item=>
  //       item.name?.toLowerCase().includes(lowerSearchRef)
  //     );
  //   }
  //   return true;
  // })
  // .filter((stok) => {
  //   if (searchQty) {
  //     return stok.items?.some((item) => item.qty === searchQty);
  //   }
  //   return true;
  // })
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  console.log("All Data:", allData);
  console.log("All Data Length:", allData.length);
  console.log("All Data (jalur):", allData.map((d) => d.jalur));
  
  const [activeButton, setActiveButton] = useState('')
  const navigate = useNavigate()

// console.log({filteredData})
  const roundUpIndonesianNumber = (value: number | null): string => {
    if (value === null) return ''
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  
  const columns = [
    {
      title: 'No',
      key: 'no',
      render: (_: any, record: any, index: number) => (
        <Tooltip
          title={
            <table style={{ width: '350px', borderCollapse: 'collapse', backgroundColor: '#f8f9fa'}}>
              <thead>
                <tr style={{ backgroundColor: '#f1f1f1', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '8px', fontWeight: 'bold', color: '#595959' }}>Items</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontWeight: 'bold', color: '#595959' }}>Qty</th>
                </tr>
              </thead>
              <tbody>
                {record.items.map((item: any) => (
                  <tr key={item._id}>
                    <td style={{ padding: '8px', color: '#595959' }}>{item.name}</td>
                    <td style={{ padding: '8px', color: '#595959' }}>{item.qty} {item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <span>{index + 1}</span>
        </Tooltip>
      ),
      width: 50,
    },
    {
        title: 'void?',
        dataIndex: 'reason_id',
        key: 'reason_id',
        render: (reason_id: string) => {
            if (reason_id === 'unvoid') {
                return '-';
            } else if (reason_id === 'void') {
                return <span style={{ color: 'red' }}>void</span>;
            }
            return reason_id; 
        },
    },
    
    
    
    {
      title: 'No. Invoice',
      dataIndex: 'ref_number',
      key: 'ref_number',
      render: (text: any, record: any) => (
        <a
          href={`/detailkledo/${record.ref_number}`}
          onClick={() => handleRefNumberClick(record.ref_number)}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Pelanggan',
      dataIndex: 'contact_id', 
      key: 'contact_name',
      render: (contactId: string) => getContactName(contactId),
    },
   
    {
      title: 'Outlet',
      dataIndex: 'warehouse_id',
      key: 'warehouse_name',
      render: (warehouseId: number) => getWarehouseName(warehouseId),
    },

    {
      title: 'Ket',
      dataIndex: 'message',
      key: 'message',
    },

      {
        title: 'Detail',
        key: 'ket',
        render: (_: any, record: any) => {
          // Filter items based on searchNamaBarang
          const filteredItems = searchNamaBarang
            ? record.items.filter((item: any) =>
                item.name.toLowerCase().includes(searchNamaBarang.toLowerCase())
              )
            : record.items;
  
          return (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Qty Terjual</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stok Terkini</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item: any) => (
                    <tr key={item.id}>
                      <td style={{ border: '1pnx solid #ddd', padding: '8px' }}>{item.name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                        {item.qty}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                        {item.qty_update}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        },
      },
 
  ]

  return (
    <>
      <h1>Daftar Transaksi</h1>

      <div id="btn-filter-status-container" style={{ display: 'inline-flex' }}>
       
      </div>
    

      <Row gutter={16} style={{ marginBottom: 16, marginTop: 16 }}>
        <Col>
          <DatePicker
            placeholder="Dari Tanggal"
            defaultValue={dayjs()} // Tanggal default adalah hari ini

            format="DD-MM-YYYY"
            onChange={(date, dateString) => handleDateChange(date, dateString as any)} // Panggil fungsi handleDateChange
          />
        </Col>
        <Col>
          <DatePicker
            placeholder="Sampai Tanggal"
            format="DD-MM-YYYY"
            onChange={(date, dateString) =>
              handleDateChangeSampai(date, dateString as any)
            } // Panggil fungsi handleDateChange
          />
        </Col>
        <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Cari Detail"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Select
            placeholder="Pilih Nama Kontak"
            value={searchContact}
            onChange={(value) => setSearchContact(value)}
            style={{ width: 200 }}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any).toLowerCase().includes(input.toLowerCase())
            }
          >
            {pelengganId?.map((id) => {
              const contact = contacts?.find((contact) => contact.id === id);
              return (
                <Select.Option key={id} value={id}>
                  {contact?.name || "Nama Tidak Ditemukan"}
                </Select.Option>
              );
            })}
          </Select>
        </Col>

        <Col>
          <Select
            showSearch
            placeholder="Pilih Nama Barang"
            style={{ width: 300 }}
            allowClear
            onChange={handleSelectChange} // Handler untuk menangani perubahan nilai
            filterOption={(input, option) =>
              (option?.children as any).toLowerCase().includes(input.toLowerCase())
            }
          >
            {itemNames.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col>
        <Select
  placeholder="Pilih Jumlah Qty"
  value={searchQty}
  onChange={(value) => setSearchQty(value)}
  style={{ width: 200 }}
  allowClear
  showSearch
  optionFilterProp="children"
  filterOption={(input, option) =>
    String(option?.children).toLowerCase().includes(input.toLowerCase())
  }
>
  {qtyItems?.map((qty) => (
    <Select.Option key={qty} value={qty}>
      {qty}
    </Select.Option>
  ))}
</Select>

        </Col>


          <Col>
            <Select
              placeholder="Pilih Status"
              value={searchStatus}
              onChange={(value) => setSearchStatus(value)}
              style={{ width: 200 }}
              allowClear
            >
              <Select.Option value="Lunas">Lunas</Select.Option>
              <Select.Option value="Dibayar Sebagian">
                Dibayar Sebagian
              </Select.Option>
              <Select.Option value="Belum Dibayar">Belum Dibayar</Select.Option>
            </Select>
          </Col>
        </Row>
      </Row>
     
      <Table
        dataSource={filteredData}
        columns={columns as any}
        rowKey="id"
        pagination={{ pageSize: 100 }}
        summary={(pageData) => {
          let totalAmount = 0
          let totalTerbayar = 0
          let totalSisaTagihan = 0

          pageData.forEach(({ amount, witholdings }) => {
            totalAmount += amount
            const totalDownPayment = witholdings
              .filter((witholding: any) => witholding.status === 0)
              .reduce(
                (sum: number, witholding: any) =>
                  sum + (witholding.down_payment || 0),
                0
              )
            totalTerbayar += totalDownPayment
            totalSisaTagihan += amount - totalDownPayment
          })

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={7} colSpan={7}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="right">
                <strong>{`Rp ${roundUpIndonesianNumber(totalAmount)}`}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right">
                <strong>{`Rp ${roundUpIndonesianNumber(
                  totalTerbayar
                )}`}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={17} align="right">
                <strong>{`Rp ${roundUpIndonesianNumber(
                  totalSisaTagihan
                )}`}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </>
  )
}

export default AuditQty