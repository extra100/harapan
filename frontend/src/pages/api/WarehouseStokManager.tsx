import React, { useState } from 'react';
import { Table, Select, Button, Spin, DatePicker } from 'antd';
import { useGetBarangsQuery } from '../../hooks/barangHooks';
import { useStokWarehouse } from './SemuaStokOutlet';
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks';
import dayjs from 'dayjs';

const { Option } = Select;

const WarehouseStockManager: React.FC = () => {
  const { data: barangs, isLoading: loadingBarangs } = useGetBarangsQuery();
  const [selectedBarangIds, setSelectedBarangIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const { data: gudangdb } = useGetWarehousesQuery();
  console.log({ gudangdb });

  const { stokWarehouse, loading: loadingStok } = useStokWarehouse(
    selectedBarangIds.join(','),
    selectedDate
  );

  const formatTableData = () => {
    if (!stokWarehouse || stokWarehouse.length === 0) return [];

    const formattedData = stokWarehouse.reduce((acc: any[], item: any) => {
      const productName = barangs?.find((barang) => String(barang.id) === item.id)?.name || item.id;

      const existingProduct = acc.find((row) => row.product === productName);
      if (existingProduct) {
        existingProduct[item.warehouse_id] = item.qty;
      } else {
        acc.push({
          product: productName,
          [item.warehouse_id]: item.qty,
        });
      }
      return acc;
    }, []);

    console.log('Formatted data:', formattedData);
    return formattedData;
  };

  const generateColumns = () => {
    const warehouseIds = [...new Set(stokWarehouse?.map((item) => item.warehouse_id))];
  
    const columns = [
      {
        title: 'Produk',
        dataIndex: 'product',
        key: 'product',
      },
      ...warehouseIds.map((id) => {
        const warehouse = gudangdb?.find((gudang: any) => String(gudang.id) === String(id));
        const title = warehouse?.singkatan || id;
  
        return {
          title: title,
          dataIndex: id,
          key: id,
          render: (value: any) => {
            const numericValue = Number(value); // Pastikan dikonversi ke angka
            return isNaN(numericValue) ? 0 : numericValue; // Format ke 2 desimal
          },
        };
      }),
    ];
  
    return columns;
  };
  
  return (
    <div>
      {/* Select Barang */}
      <div style={{ marginBottom: '16px' }}>
        <Select
          showSearch
          placeholder="Pilih barang"
          loading={loadingBarangs}
          style={{ width: 300 }}
          value={selectedBarangIds} // Binding value with selectedBarangIds
          onChange={(value: string[]) => setSelectedBarangIds(value)} // Update selectedBarangIds on change
          mode="multiple" // Allow multiple selection
          filterOption={(input, option) =>
            (option?.children as any).toLowerCase().includes(input.toLowerCase())
          }
        >
          {barangs?.map((barang: { id: any; name: string }) => (
            <Option key={barang.id} value={barang.id}>
              {barang.name}
            </Option>
          ))}
        </Select>

        <Button
          onClick={() => setSelectedBarangIds([])} // Clears the selectedBarangIds state
          disabled={selectedBarangIds.length === 0} // Disables the button when no item is selected
          style={{ marginLeft: '8px' }}
        >
          Kosongkan Semua 
        </Button>
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: '16px', width: '500px' }}>
        <DatePicker
          defaultValue={dayjs()}
          onChange={(date) => setSelectedDate(date?.format('YYYY-MM-DD') || '')}
          style={{ width: '300px' }}
        />
      </div>

      {/* Tabel Barang */}
      <Spin spinning={loadingStok}>
        <Table
          columns={generateColumns()}
          dataSource={formatTableData()}
          rowKey={(record) => record.product}
          pagination={false}
        />
      </Spin>
    </div>
  );
};

export default WarehouseStockManager;
