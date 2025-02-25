import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Alert, Badge, Col, DatePicker, Row } from 'antd';
import { useGetDiscountSummaryQuery } from './transactionHooks';
import dayjs from 'dayjs';
import { useGetoutletsQuery } from './outletHooks';

const { Title } = Typography;

const DiscountSummaryComponent: React.FC = () => {
      const { data: gudangs } = useGetoutletsQuery()
      
    
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

  useEffect(() => {
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
  }, []);

  const { data, isLoading, error } = useGetDiscountSummaryQuery(
    startDate ?? '',
    endDate ?? ''
  );

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error fetching data" type="error" showIcon />;
  }

  const warehouseData: Record<string, Record<number, number>> = {};
  const invoiceCountPerWarehouse: Record<string, Record<number, number>> = {};
  const totalDiscountPerWarehouse: Record<string, number> = {};

  data?.forEach(({ warehouse_id, discount_percent, total_discount_amount, invoice_count }) => {
    if (!warehouseData[warehouse_id]) {
      warehouseData[warehouse_id] = {};
      invoiceCountPerWarehouse[warehouse_id] = {};
      totalDiscountPerWarehouse[warehouse_id] = 0;
    }

    warehouseData[warehouse_id][discount_percent] =
      (warehouseData[warehouse_id][discount_percent] || 0) + total_discount_amount;

    invoiceCountPerWarehouse[warehouse_id][discount_percent] =
      (invoiceCountPerWarehouse[warehouse_id][discount_percent] || 0) + invoice_count;

    totalDiscountPerWarehouse[warehouse_id] += total_discount_amount;
  });

  const uniqueDiscounts = Array.from(
    new Set(data?.map((item) => Math.round(item.discount_percent)) || [])
  ).sort((a, b) => a - b);

  // ** Hitung total keseluruhan untuk summary **
  const totalSummary: Record<number, number> = {};
  const totalInvoiceSummary: Record<number, number> = {};
  let grandTotalDiscount = 0;
  let grandTotalInvoice = 0;

  uniqueDiscounts.forEach((discount) => {
    totalSummary[discount] = 0;
    totalInvoiceSummary[discount] = 0;
  });

  Object.entries(warehouseData).forEach(([warehouse_id, discounts]) => {
    uniqueDiscounts.forEach((discount) => {
      totalSummary[discount] += discounts[discount] || 0;
      totalInvoiceSummary[discount] += invoiceCountPerWarehouse[warehouse_id]?.[discount] || 0;
    });

    grandTotalDiscount += totalDiscountPerWarehouse[warehouse_id];
    grandTotalInvoice += Object.values(invoiceCountPerWarehouse[warehouse_id] || {}).reduce((a, b) => a + b, 0);
  });

  const columns = [
    {
        title: 'Outlet',
        dataIndex: 'warehouse_id',
        key: 'warehouse_id',
        fixed: 'centre',
        render: (warehouse_id: string) => {
          const outlet = gudangs?.find((gudang) => gudang.id_outlet === warehouse_id);
          return outlet ? outlet.nama_outlet : warehouse_id;
        },
      },
    ...uniqueDiscounts.map((discount) => ({
      title: `${discount}%`,
      dataIndex: `discount_${discount}`,
      key: `discount_${discount}`,
      render: (_: any, record: any) => {
        const amount = record[`discount_${discount}`] || 0;
        const invoiceCount = invoiceCountPerWarehouse[record.warehouse_id]?.[discount] || 0;

        if (!amount) return '-';
        return (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ position: 'absolute', left: 0, minWidth: '40px', textAlign: 'left', color: 'orange' }}>
              {invoiceCount}
            </span>
            <span style={{ marginLeft: 'auto' }}>{amount.toLocaleString()}</span>
          </div>
        );
      },
    })),
    {
      title: 'Total Diskon',
      dataIndex: 'total_discount',
      key: 'total_discount',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ minWidth: '40px', textAlign: 'left', color: 'orange' }}>
            {record.total_invoice_count}
          </span>
          <span style={{ marginLeft: 'auto' }}>{record.total_discount?.toLocaleString() || '0'}</span>
        </div>
      ),
    },
  ];

  const tableData = Object.entries(warehouseData).map(([warehouse_id, discounts]) => {
    const rowData: Record<string, any> = {
      key: warehouse_id,
      warehouse_id,
      total_discount: totalDiscountPerWarehouse[warehouse_id],
      total_invoice_count: Object.values(invoiceCountPerWarehouse[warehouse_id] || {}).reduce((a, b) => a + b, 0),
    };

    uniqueDiscounts.forEach((discount) => {
      rowData[`discount_${discount}`] = discounts[discount] || 0;
    });

    return rowData;
  });

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Penggunaan Diskon</Title>
      <Row>
        <Col>
          <DatePicker
            placeholder="Dari Tanggal"
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
      <br />
      <Table
        columns={columns as any}
        dataSource={tableData}
        pagination={{ pageSize: 120 }}
        bordered
        scroll={{ x: 'max-content' }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={1}>
              <strong>Total Semua</strong>
            </Table.Summary.Cell>
            {uniqueDiscounts.map((discount, index) => (
              <Table.Summary.Cell index={index + 1} key={discount}>
              <strong>
                <span style={{ color: 'orange' }}>{totalInvoiceSummary[discount]}</span> / {totalSummary[discount].toLocaleString()}
              </strong>
            </Table.Summary.Cell>
            
            ))}
           <Table.Summary.Cell index={uniqueDiscounts.length + 1}>
            <strong style={{ color: 'orange' }}>{grandTotalInvoice}</strong> / {grandTotalDiscount.toLocaleString()}
            </Table.Summary.Cell>

          </Table.Summary.Row>
        )}
      />
    </div>
  );
};

export default DiscountSummaryComponent;
