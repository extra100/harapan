import React, { useState } from "react";
import { Table, DatePicker, Space, Typography } from "antd";
import dayjs from "dayjs";
// import { useGetWithholdingSummaryQuery } from "../hooks/useGetWithholdingSummary";
import { useGetWithholdingSummaryQuery } from '../../hooks/transactionHooks'


const { RangePicker } = DatePicker;
const { Title } = Typography;

const WithholdingTable: React.FC = () => {
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
console.log({dateRange})
  // Ambil data berdasarkan tanggal yang dipilih
  const { data, isLoading } = useGetWithholdingSummaryQuery(
    dateRange?.[0] || "",
    dateRange?.[1] || ""
  );
  console.log({data})

  // Kolom tabel
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tanggal Transaksi",
      dataIndex: "trans_date",
      key: "trans_date",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Akun Withholding",
      dataIndex: "witholding_account_id",
      key: "witholding_account_id",
    },
    {
      title: "Persentase Withholding",
      dataIndex: "witholding_percent",
      key: "witholding_percent",
      render: (percent: number) => `${percent}%`,
    },
    {
      title: "Jumlah Withholding",
      dataIndex: "witholding_amount",
      key: "witholding_amount",
      render: (amount: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (status === 1 ? "Approved" : "Pending"),
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <Title level={3}>Laporan Withholding</Title>
      <Space style={{ marginBottom: "20px" }}>
      <RangePicker
  onChange={(dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")]);
    } else {
      setDateRange(null);
    }
  }}
/>

      </Space>
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default WithholdingTable;
