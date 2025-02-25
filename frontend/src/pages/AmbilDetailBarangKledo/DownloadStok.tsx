import React, { useState, useMemo } from 'react';
import { Select, Col, Table, Input, message, Button } from 'antd';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks';
import { useWarehouseStock } from '../api/fetchSemuaStok';
import SingleDate from '../SingleDate';
import { useSimpanDetailBarangDariGoretMutation } from '../../hooks/ambilDetailBarangDariGoretHooks';
// import { CSVLink } from 'react-csv';

const DownloadStok = () => {
  const { data: gudangdb } = useGetWarehousesQuery();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const { mutate: simpanDetailBarangDariGoret } = useSimpanDetailBarangDariGoretMutation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { warehouseStock } = useWarehouseStock(selectedDate || '', selectedWarehouseId || 0);

  const handleWarehouseChange = (value: number) => {
    setSelectedWarehouseId(value);
  };

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredStock = useMemo(() => {
    return warehouseStock.filter(
      (item: any) =>
        item.name.toLowerCase().includes(searchTerm) || item.id.toString().includes(searchTerm),
    );
  }, [warehouseStock, searchTerm]);

  const styles = StyleSheet.create({
    page: { padding: 2 },
    table: { width: 'auto', marginTop: 0 },
    tableRow: { flexDirection: 'row' },
    tableCell: { flex: 1, padding: 1, border: '1px solid black' },
    header: { fontSize: 12, marginBottom: 0 },
    title: { fontSize: 12, textAlign: 'center', marginBottom: 0 },
  });

  const MyPDFDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Filtered Warehouse Stock</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>No</Text>
            <Text style={styles.tableCell}>Name</Text>
            <Text style={styles.tableCell}>Stock</Text>
            <Text style={styles.tableCell}>Code</Text>
          </View>
          {filteredStock.map((item, index) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.stock}</Text>
              <Text style={styles.tableCell}>{item.code}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
  ];

  // Prepare data for CSV export
  const csvData = filteredStock.map((item, index) => ({
    No: index + 1,
    Name: item.name,
    Stock: item.stock,
    Code: item.code,
  }));

  return (
    <div>
      <Col span={12}>
        <Select
          placeholder="Warehouse"
          showSearch
          style={{ width: '70%' }}
          optionFilterProp="label"
          filterOption={(input: any, option: any) =>
            option?.label?.toString().toLowerCase().includes(input.toLowerCase())
          }
          value={selectedWarehouseId}
          onChange={handleWarehouseChange}
          disabled={!gudangdb}
        >
          {gudangdb?.map((warehouse) => (
            <Select.Option key={warehouse.id} value={warehouse.id} label={warehouse.name}>
              {warehouse.name}
            </Select.Option>
          ))}
        </Select>
      </Col>

      <Col span={12}>
        <SingleDate value={selectedDate as any} onChange={handleDateChange} />
      </Col>

      <Col span={12}>
        <Input
          placeholder="Search by Product ID or Name"
          style={{ width: '70%', marginTop: 16 }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Col>

      <Table dataSource={filteredStock} columns={columns} rowKey="id" pagination={{ pageSize: 100 }} />

      {/* <PDFDownloadLink
        document={<MyPDFDocument />}
        fileName="filtered-stock-report.pdf"
      >
        {({ loading }: { loading: boolean }) => (
          <Button type="default" style={{ margin: '16px 8px' }}>
            {'Download PDF'}
          </Button>
        )}
      </PDFDownloadLink> */}
{/* 
      <CSVLink
        data={csvData}
        filename="filtered-stock.csv"
        className="ant-btn"
        style={{ margin: '16px 0' }}
      >
        Download CSV
      </CSVLink> */}
    </div>
  );
};

export default DownloadStok;
