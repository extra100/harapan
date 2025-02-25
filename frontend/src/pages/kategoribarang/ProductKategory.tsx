import React, { useState, useMemo, useEffect } from 'react'
import { DatePicker, Spin, Table, Select } from 'antd'
import dayjs from 'dayjs'
import { useSalesData } from './OutletSebelas'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useGetKategoryPenjualansQuery } from '../../hooks/kategoryPenjualanHooks'

export function SalesPerProductCategoryUI() {
  const [dates, setDates] = useState<[string, string]>([ 
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ])
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>(undefined) 
  const sumberA = Array.from({ length: 21 }, (_, index) => index + 2).filter(
    (outletId) => outletId !== 4
  )
  const dataDariSumberA = sumberA.map((outletId: any) => useSalesData(dates[0], dates[1], outletId))
  const sumberB: string[] = Array.from({ length: 21 }, (_, index) => (index + 2).toString()).filter(
    (outletId) => outletId !== "4"
  );


  const [hasilPerhitungan, setHasilPerhitungan] = useState([]);
  console.log({hasilPerhitungan})
  const dataDariSumberB = sumberB.map((kategoriId) => {
    const { data } = useGetKategoryPenjualansQuery(dates[0], dates[1], kategoriId);
    return data ?? [];
  });

  const hitungNilai = (persentase: number, target: number, gap: number) => {
    const targetHarian = target / 30; 
    return (persentase / 100) * targetHarian * gap;
  };
  
  useEffect(() => {
    if (dataDariSumberB.length > 0) {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);
      const gapTanggal = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) || 1;
      console.log({ gapTanggal }); 
    
      const hasil = dataDariSumberB.flat().map((item) => {
        const target = item.target ?? 0;
    
        return {
          _id: item._id,
          id_outlet: item.id_outlet,
          outlet_name: item.outlet_name,
          spandek_pasir: hitungNilai(item.spandek_pasir, target, gapTanggal),
          besi_kotak: hitungNilai(item.besi_kotak, target, gapTanggal),
          baut: hitungNilai(item.baut, target, gapTanggal),
          atap: hitungNilai(item.atap, target, gapTanggal),
          baja: hitungNilai(item.baja, target, gapTanggal),
          triplek: hitungNilai(item.triplek, target, gapTanggal),
          plafon: hitungNilai(item.plafon, target, gapTanggal),
          besi: hitungNilai(item.besi, target, gapTanggal),
          asesoris: hitungNilai(item.asesoris, target, gapTanggal),
          pipa_air: hitungNilai(item.pipa_air, target, gapTanggal),
          genteng_pasir: hitungNilai(item.genteng_pasir, target, gapTanggal),
          target: target, // Keep the original target here
        };
      });
    
      setHasilPerhitungan(hasil as any);
    }
  }, [dataDariSumberB, dates]);
  
  

  const kategoriB = useMemo(() => {
    return Object.keys(hasilPerhitungan[0] || {}).filter(
      (key) => key !== "_id" && key !== "id_outlet" && key !== "outlet_name"
    );
  }, [hasilPerhitungan]);
//b

  

  const dataSourceSumberB = hasilPerhitungan.map((item) => {
    let totalPerOutlet = 0;
    // const rowData: any = { key: item._id, outlet_name: item.outlet_name };
  
    // kategoriB.forEach((category) => {
    //   const value = item[category] || 0;
    //   rowData[category] = value;
    //   totalPerOutlet += value;
    // });
  
    // rowData.total = totalPerOutlet;
  
    // return rowData;
  });

  const { data: gudangs } = useGetWarehousesQuery()

  const loadingState = dataDariSumberA.map(({ loading }) => loading)

  const kategoriA = useMemo(() => {
    return Array.from(
      new Set(
        dataDariSumberA.flatMap(({ salesData }) => salesData.map((item) => item.category_name))
      )
    )
  }, [dataDariSumberA])
//aaa
const sumberBMap = useMemo(() => {
  // const map = new Map();
  // dataSourceSumberB.forEach((row) => {
  //   map.set(row.outlet_name, row);
  // });
  // return map;
  
}, [dataSourceSumberB]);
const columnsA = [
  {
    title: 'OUTLET',
    dataIndex: 'warehouseId',
    key: 'warehouseId',
    className: 'no-padding',
    align: 'center',
  },
  {
    title: 'Perbandingan',
    key: 'comparison',
    className: 'no-padding',
    render: () => (
      <div>
        <div style={{ marginBottom: '8px' }}>Target</div>
        <div style={{ marginBottom: '8px' }}>Berjalan</div>
        <div style={{ marginBottom: '8px' }}>Beda</div>
      </div>
    ),
  },
  // ...kategoriA.map((category) => ({
  //   title: category,
  //   dataIndex: category,
  //   key: category,
  //   className: 'no-padding',
  //   render: (value, record) => {
  //     const sumberBData = sumberBMap.get(record.warehouseId) || {};
  //     const normalizedCategory = category.replace(/\s+/g, '_').toLowerCase();
  //     const sumberBValue = sumberBData[normalizedCategory] || 0;
  //     const beda = sumberBValue - value;
  
  //     return (
  //       <div>
  //         <div style={{ marginBottom: '8px' }}>{Math.round(sumberBValue).toLocaleString()}</div>
  //         <div style={{ marginBottom: '8px' }}>{Math.round(value).toLocaleString()}</div>
  //         <div style={{ marginBottom: '8px' }}>{Math.round(beda).toLocaleString()}</div>
  //       </div>
  //     );
  //   },
  // })),
  
  // {
  //   title: 'Total',
  //   dataIndex: 'total',
  //   key: 'total',
  //   className: 'no-padding',
  //   render: (value, record) => {
  //     const totalBerjalan = kategoriA.reduce((sum, category) => {
  //       const valueForCategory = record[category] || 0;
  //       return sum + valueForCategory;
  //     }, 0);
  
  //     const totalTarget = kategoriA.reduce((sum, category) => {
  //       const sumberBData = sumberBMap.get(record.warehouseId) || {};
  //       const normalizedCategory = category.replace(/\s+/g, '_').toLowerCase();
  //       const sumberBValue = sumberBData[normalizedCategory] || 0;
  //       return sum + sumberBValue;
  //     }, 0);
  
  //     const selisihTotal = totalTarget - totalBerjalan;
  
  //     return (
  //       <div>
  //         <div style={{ marginBottom: '8px' }}>{Math.round(totalTarget).toLocaleString()}</div>
  //         <div style={{ marginBottom: '8px' }}>{Math.round(totalBerjalan).toLocaleString()}</div>
  //         <div style={{ marginBottom: '8px' }}>{Math.round(selisihTotal).toLocaleString()}</div>
  //       </div>
  //     );
  //   },
  // },
  
  // {
  //   title: 'Selisih (%)',
  //   dataIndex: 'selisihPersentase',
  //   key: 'selisihPersentase',
  //   className: 'no-padding',
  //   render: (value, record) => {
  //     const totalBerjalan = kategoriA.reduce((sum, category) => {
  //       const valueForCategory = record[category] || 0;
  //       return sum + valueForCategory;
  //     }, 0);
  
  //     const totalTarget = kategoriA.reduce((sum, category) => {
  //       const sumberBData = sumberBMap.get(record.warehouseId) || {};
  //       const normalizedCategory = category.replace(/\s+/g, '_').toLowerCase();
  //       const sumberBValue = sumberBData[normalizedCategory] || 0;
  //       return sum + sumberBValue;
  //     }, 0);
  
  //     const selisihTotal = totalTarget - totalBerjalan;
  //     const selisihPersentase = totalTarget !== 0 ? (selisihTotal / totalTarget) * 100 : 0;
  //     const textColor = selisihPersentase >= 0 ? 'red' : 'blue';
  
  //     return (
  //       <div style={{ color: textColor }}>
  //         {selisihPersentase.toFixed(2)}%
  //       </div>
  //     );
  //   },
  // },
  
];


  
  const dataSource = sumberA.map((outletId, index) => {
    const { salesData } = dataDariSumberA[index] || { salesData: [] }

    const warehouse = gudangs?.find((gudang) => gudang.id === outletId)
    const warehouseName = warehouse ? warehouse.name : `Gudang ${outletId}`

    const rowData: any = { key: outletId.toString(), warehouseId: warehouseName }

    let totalPerOutlet = 0

    kategoriA.forEach((category) => {
      const categorySales = salesData.find((item) => item.category_name === category)
      const value = categorySales ? categorySales.amount_after_tax || 0 : 0
      rowData[category] = value
      totalPerOutlet += value
    })

    rowData.total = totalPerOutlet

    return rowData
  })

  const filterSumberA = selectedWarehouse
    ? dataSource.filter((row) => row.warehouseId === selectedWarehouse)
    : dataSource
  const totalPerCategory: any = { key: 'total', warehouseId: <b>Total Semua</b> }
  let grandTotal = 0

  kategoriA.forEach((category) => {
    const total = filterSumberA.reduce((acc, row) => acc + (row[category] || 0), 0)
    totalPerCategory[category] = <b>{total.toLocaleString()}</b>
    grandTotal += total
  })

  totalPerCategory.total = <b>{grandTotal.toLocaleString()}</b>

  return (
    <div>
      <h2>Pencapaian Omset Kategori Barang</h2>
      <br />
      <DatePicker.RangePicker
        onChange={(values) => {
          if (values?.[0] && values?.[1]) {
            setDates([values[0].format('YYYY-MM-DD'), values[1].format('YYYY-MM-DD')])
          }
        }}
      />
      <Select
        placeholder="Pilih Gudang"
        style={{ width: 200, marginBottom: 16 }}
        onChange={(value) => setSelectedWarehouse(value)}
      
        value={selectedWarehouse}
        
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.children as any)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      >
        <Select.Option value={undefined}>Semua Gudang</Select.Option>
        {gudangs?.map((gudang) => (
          <Select.Option key={gudang.id} value={gudang.name}>
            {gudang.name}
          </Select.Option>
        ))}
      </Select>
      {loadingState.some((loading) => loading) ? (
        <Spin />
      ) : (
        <Table
  columns={columnsA as any}
  dataSource={filterSumberA} 
  pagination={false}
  bordered
  summary={() => (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0} className="no-padding-summary">
        <b>Total Berjalan</b>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={1} className="no-padding-summary">
        <b>-</b> {/* Placeholder for Perbandingan column */}
      </Table.Summary.Cell>
      {kategoriA.map((category, index) => (
        <Table.Summary.Cell key={index} index={index + 2} className="no-padding-summary">
          <b>{totalPerCategory[category]}</b>
        </Table.Summary.Cell>
      ))}
      <Table.Summary.Cell index={kategoriA.length + 2} className="no-padding-summary">
        <b>{totalPerCategory.total}</b>
      </Table.Summary.Cell>
    </Table.Summary.Row>
    
  )}
  
/>

      )}

    </div>
  )
}
