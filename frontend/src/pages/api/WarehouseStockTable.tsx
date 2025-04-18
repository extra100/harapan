import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, DatePicker, Button, Select, message, Spin, Modal } from 'antd';
import dayjs from 'dayjs';
import { useWarehouseStock } from './fetchSemuaStok';
import UserContext from '../../contexts/UserContext';
import { useGetBarangsQuery } from '../../hooks/barangHooks';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const { RangePicker } = DatePicker;
const { Option } = Select;
import autoTable from 'jspdf-autotable';

const categories = [
  { id: 5, name: 'ATAP' },
  { id: 8, name: 'BAUT' },
  { id: 12, name: 'TRIPLEK' },
  { id: 16, name: 'ASET TETAP KENDARAAN' },
  { id: 6, name: 'BESI BETON' },
  { id: 7, name: 'BAJA' },
  { id: 10, name: 'BESI KOTAK' },
  { id: 13, name: 'CET' },
  { id: 15, name: 'ASET TETAP BANGUNAN' },
  { id: 20, name: 'TANAH' },
  { id: 1, name: 'Other' },
  { id: 3, name: 'ASESORIS' },
  { id: 4, name: 'BESI' },
  { id: 9, name: 'GENTENG PASIR' },
  { id: 19, name: 'SPANDEK PASIR' },
  { id: 11, name: 'PIPA AIR' },
  { id: 17, name: 'MATERIAL PRODUKSI' },
  { id: 18, name: 'ASET TETAP PERALATAN' },
  { id: 21, name: 'KERAMIK' },
  { id: 2, name: 'PLAFON' },
];

const categoryMap = Object.fromEntries(categories.map((cat) => [cat.id, cat.name]));

const WarehouseStockTable: React.FC = () => {
  const { data: barangs } = useGetBarangsQuery();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<[string, string]>([
    dayjs().format('DD-MM-YYYY'),
    dayjs().format('DD-MM-YYYY'),
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const formattedDate = dayjs(selectedDates[0], 'DD-MM-YYYY').format('YYYY-MM-DD');

  useEffect(() => {
    if (user?.id_outlet) {
      setSelectedWarehouseId(Number(user.id_outlet));
    }
  }, [user]);


  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setSelectedDates(dateStrings);
  };

  const handleCategoryChange = (value: number) => {
    setSelectedCategory(value);
  };


  const { warehouseStock } = useWarehouseStock(formattedDate, selectedWarehouseId ?? 0);
  console.log({ warehouseStock });
  
  const filteredBarangs = selectedCategory
    ? barangs?.filter((barang) => barang.pos_product_category_id === selectedCategory)
    : barangs;
  
  const finalFilteredBarangs = filteredBarangs
    ?.map((barang) => {
      const stockData = warehouseStock?.find((stock) => stock.id === barang.id);
      return {
        ...barang,
        stock: stockData?.stock ?? 0, // Set ke 0 jika tidak ditemukan
      };
    })
    .filter((barang) => barang.stock > 0); // Hanya ambil barang dengan stok > 0
  
  console.log({ finalFilteredBarangs });
  

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const newWindow = window.open('', '', 'width=900,height=600');
  
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const dateString = now.toLocaleDateString('id-ID');
  
      const outletName = user?.name || 'Semua Outlet';
      const periode = `${selectedDates[0]} s/d ${selectedDates[1]}`;
  
      newWindow?.document.write(`
        <html>
          <head>
            <title>Cetak Laporan Stok Gudang</title>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                }
  
                .print-header {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  background-color: white;
                  padding: 10px 20px;
                  border-bottom: 1px solid #ccc;
                  z-index: 999;
                }
  
                .print-body {
                  margin-top: 140px; /* cukup ruang untuk header */
                }
  
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
  
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
  
                th {
                  background-color: #f2f2f2;
                }
  
                h1 {
                  margin: 0;
                  font-size: 20px;
                  text-align: center;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>LAPORAN STOK GUDANG</h1>
              <p>Outlet: ${outletName}</p>
              <p>Tanggal Cetak: ${dateString} ${timeString}</p>
              <p>Periode: ${periode}</p>
            </div>
            <div class="print-body">
              ${printContent}
            </div>
          </body>
        </html>
      `);
  
      newWindow?.document.close();
      newWindow?.focus();
      newWindow?.print();
    }
  };
  
  

  const handleSavePDF = () => {
    const doc = new jsPDF();
  
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const dateString = now.toLocaleDateString('id-ID');
  
    const outletName = user?.name || 'Semua Outlet';
    const periode = `${selectedDates[0]} s/d ${selectedDates[1]}`;
  
    autoTable(doc, {
      head: [['No', 'Kode', 'Nama Barang', 'Kategori', 'Stok']],
      body:
        finalFilteredBarangs?.map((item, index) => [
          index + 1,
          item.code,
          item.name,
          categoryMap[item.pos_product_category_id] || 'Unknown',
          item.stock,
        ]) || [],
      startY: 45,
      didDrawPage: (data) => {
        doc.setFontSize(16);
        doc.text('LAPORAN STOK GUDANG', 105, 15, { align: 'center' });
  
        doc.setFontSize(11);
        doc.text(`Outlet: ${outletName}`, 14, 25);
        doc.text(`Tanggal Cetak: ${dateString} ${timeString}`, 14, 32);
        doc.text(`Periode: ${periode}`, 14, 39);
      },
    });
  
    doc.save(`stok_gudang_${selectedDates[0]}_sd_${selectedDates[1]}.pdf`);
    message.success('PDF berhasil disimpan!');
  };
  
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (warehouseStock !== undefined && warehouseStock.length > 0) {
    setLoading(false);
  }
}, [warehouseStock]);


  const columns = [
    {
      title: 'No',
      key: 'no',
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Kode', dataIndex: 'code', key: 'code' },
    { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
    { title: 'Kategori', dataIndex: 'pos_product_category_id', key: 'category', render: (id: number) => categoryMap[id] || 'Unknown' },
    { title: 'Stok', dataIndex: 'stock', key: 'stock' },
    { title: 'Fisik Stok', dataIndex: '', key: '' },
    { title: 'Selisih Stok', dataIndex: '', key: '' },
  ];
  const [isModalVisible, setIsModalVisible] = useState(true); // State untuk modal

  return (
    <div>
     <Modal
  title="Penting!"
  visible={isModalVisible}
  onCancel={() => setIsModalVisible(false)} // Modal bisa ditutup manual jika diperlukan
  footer={[
  
  ]}
>
  <p>Mohon untuk mengklik tombol <strong>Simpan PDF</strong> terlebih dahulu sebelum ada transaksi apapun. ini sangat penting guna mengarsipkan stok pehari ini <br /> <br />

  <strong>WAJIB...... MUN NDQ JAK JERAWATM</strong></p>
</Modal>

<RangePicker
  format="DD-MM-YYYY"
  onChange={handleDateChange}
  style={{ marginBottom: 16, marginRight: 16 }}
  defaultValue={[dayjs(), dayjs()]}
/>

      <Select
        placeholder="Pilih Kategori Produk"
        onChange={handleCategoryChange}
        allowClear
        style={{ width: 200, marginBottom: 16, marginRight: 16 }}
      >
        {categories.map((category) => (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handlePrint} style={{ marginBottom: 16, marginRight: 16 }}>
        Print
      </Button> 
      <Button type="primary" onClick={handleSavePDF} style={{ marginBottom: 16, marginRight: 8 }}>Simpan PDF</Button>

      <div ref={printRef}>
      {loading ? (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <Spin size="large" />
  </div>
) : (
  <Table dataSource={finalFilteredBarangs} columns={columns} rowKey="id" pagination={false} />
)}
      </div>
    </div>
  );
};

export default WarehouseStockTable;
