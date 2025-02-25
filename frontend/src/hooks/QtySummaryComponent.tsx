import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Alert, Col, DatePicker, Row } from 'antd';
import { useGetQtySummaryQuery } from './transactionHooks';
import dayjs from 'dayjs';
import { useGetBarangsQuery } from './barangHooks';
import { useGetWarehousesQuery } from '../hooks/warehouseHooks';


const { Title } = Typography;

const QtySummaryComponent: React.FC = () => {
  const { data: barangs } = useGetBarangsQuery();
    const { data: gudangdb } = useGetWarehousesQuery();
  

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
  }, []);

  const { data, isLoading, error } = useGetQtySummaryQuery(startDate ?? '', endDate ?? '');

  if (isLoading) return <Spin size="large" style={{ textAlign: 'center', padding: '20px' }} />;
  if (error) return <Alert message="Error fetching data" type="error" showIcon />;

  // **Buat mapping barang**
  const barangMap = barangs?.reduce((acc, barang) => {
    acc[barang.id] = barang.pos_product_category_id;
    return acc;
  }, {} as Record<number, number>);

  // **Buat mapping warehouse_id -> singkatan**
  const warehouseMap = gudangdb?.reduce((acc, gudang) => {
    acc[gudang.id] = gudang.singkatan || `WH-${gudang.id}`; // Jika tidak ada singkatan, gunakan ID sebagai fallback
    return acc;
  }, {} as Record<number, string>);

  const qtyData: Record<number, Record<number, number>> = {};
  const uniqueWarehouses = new Set<number>();

  data?.forEach((item) => {
    const { finance_account_id, warehouse_id, total_qty } = item as any; // Temporary bypass
    const categoryId = barangMap?.[finance_account_id];
    if (!categoryId) return;
  
    if (!qtyData[categoryId]) {
      qtyData[categoryId] = {};
    }
  
    qtyData[categoryId][warehouse_id] = (qtyData[categoryId][warehouse_id] || 0) + total_qty;
    uniqueWarehouses.add(warehouse_id);
  });
  

  const sortedWarehouses = Array.from(uniqueWarehouses).sort((a, b) => a - b);

  // **Update kolom agar menampilkan singkatan warehouse**
  const columns = [
    {
      title: 'Barang',
      dataIndex: 'category_id',
      key: 'category_id',
      align: 'center',
    },
    ...sortedWarehouses.map((warehouseId) => ({
      title: warehouseMap![warehouseId] || `WH-${warehouseId}`,
      dataIndex: `warehouse_${warehouseId}`,
      key: `warehouse_${warehouseId}`,
      render: (value: number | undefined) => (value ? value : '-'),
    })),
  ];

  // **Membuat data untuk tabel**
  const tableData = Object.entries(qtyData).map(([categoryId, warehouseData]) => {
    const rowData: Record<string, any> = { key: categoryId, category_id: categoryId };
    sortedWarehouses.forEach((warehouseId) => {
      rowData[`warehouse_${warehouseId}`] = warehouseData[warehouseId] || 0;
    });
    return rowData;
  });

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Ringkasan Kuantitas per Warehouse</Title>
      <Row gutter={16}>
        <Col>
          <DatePicker format="DD-MM-YYYY" onChange={(_, dateString) => setStartDate(dateString ? dayjs(dateString as string).format('YYYY-MM-DD') : null)} />
        </Col>
        <Col>
          <DatePicker format="DD-MM-YYYY" onChange={(_, dateString) => setEndDate(dateString ? dayjs(dateString as string).format('YYYY-MM-DD') : null)} />
        </Col>
      </Row>
      <br />
      <Table columns={columns as any} dataSource={tableData} pagination={{ pageSize: 20 }} bordered />
    </div>
  );
};

export default QtySummaryComponent;
