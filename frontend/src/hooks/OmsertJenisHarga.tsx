import React, { useContext, useEffect, useState } from 'react';
import { DatePicker, Table, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { useGetTransaksisQuerymu } from './transactionHooks';
import UserContext from '../contexts/UserContext';

const TransactionFilter: React.FC = () => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(null);
  const userContext = useContext(UserContext);
  const { user } = userContext || {};

  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(Number(user.id_outlet));
    }
  }, [user]);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const formatDateForBackend = (dateString: string) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date: any, dateString: string) => {
    setStartDate(formatDateForBackend(dateString));
    setEndDate(formatDateForBackend(dateString));
  };

  const handleDateChangeSampai = (date: any, dateString: string) => {
    setEndDate(formatDateForBackend(dateString));
  };
  const { data: transaksi, isLoading } = useGetTransaksisQuerymu(selectedWarehouseId, startDate, endDate);



  // **Ambil semua discount_percent unik**
  const discountPercents = Array.from(
    new Set(
      transaksi?.flatMap((t: any) => t.items.map((item: any) => item.discount_percent)) || []
    )
  ).sort((a, b) => a - b);

  // **Buat kolom tabel dinamis**
  const columns = [

    ...discountPercents.map((percent) => ({
      title: `${percent}%`, 
      dataIndex: `discount_${percent}`,
      key: `discount_${percent}`,
      render: (text: any) => text || '-',
    })),
  ];

  // **Transformasi data agar sesuai dengan header**
  const dataSource = transaksi?.map((t: any) => {
    const discountData: Record<string, number> = {};
    
    t.items.forEach((item: any) => {
      discountData[`discount_${item.discount_percent}`] = item.discount_amount;
    });

    return {
      ...t,
      ...discountData,
    };
  }) || [];

  return (
    <div>
      <Row>
        <Col>
          <DatePicker
            placeholder="Dari Tanggal"
            defaultValue={dayjs()}
            format="DD-MM-YYYY"
            onChange={(date, dateString) => handleDateChange(date, dateString as any)}
          />
        </Col>
        <Col>
          <DatePicker
            placeholder="Sampai Tanggal"
            format="DD-MM-YYYY"
            onChange={(date, dateString) => handleDateChangeSampai(date, dateString as any)}
          />
        </Col>
      </Row>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 100 }}
      />
    </div>
  );
};

export default TransactionFilter;
