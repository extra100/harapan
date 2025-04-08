import React, { useState } from "react";
import { Table, DatePicker, Space, Typography } from "antd";
import { useGetDownPaymentSummaryQuery } from "../../hooks/transactionHooks";
import { useGetContactsQuery } from "../../hooks/contactHooks";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const WithholdingTable: React.FC = () => {
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const { data, isLoading } = useGetDownPaymentSummaryQuery(
    dateRange?.[0] || "",
    dateRange?.[1] || ""
  );

  // Filter data berdasarkan trans_date_witholding sebelum dikelompokkan
  const filteredData = (data || []).filter(({ trans_date_witholding }) => {
    if (!dateRange) return true;
    return trans_date_witholding >= dateRange[0] && trans_date_witholding <= dateRange[1];
  });

  // Mengelompokkan data berdasarkan memo
  const groupedData: Record<string, Record<string, any>> = {};

  filteredData.forEach(({ memo, name, down_payment, trans_date_main, trans_date_witholding, contact_id }) => {
    if (!groupedData[memo]) {
      groupedData[memo] = { memo, trans_date_main, trans_date_witholding, contact_id };
    }
    groupedData[memo][name] = (groupedData[memo][name] || 0) + down_payment;
  });

  // Konversi objek ke array untuk tabel
  const tableData = Object.values(groupedData).map((entry, index) => ({
    key: index,
    ...entry,
  }));

  // Ambil semua jenis pembayaran sebagai kolom
  const paymentMethods = new Set<string>();
  filteredData.forEach(({ name }) => paymentMethods.add(name));

  const { data: contacts } = useGetContactsQuery();
  const getContactName = (contactId: string): string => {
    if (!contacts || contacts.length === 0) return "Unknown";

    const contact = contacts.find((contact: any) => contact._id === contactId);

    return contact ? contact.name : "Unknown";
  };

  // **Hitung total setiap metode pembayaran**
  const totalPayment: Record<string, number> = {};
  tableData.forEach((row: any) => {
    Array.from(paymentMethods).forEach((method) => {
      totalPayment[method] = (totalPayment[method] || 0) + (row[method] || 0);
    });
  });

  // **Hitung Total Pembayar Piutang**
  const totalPembayarPiutang =
    (totalPayment["KES PEMBAYARAN PIUTANG"] || 0) +
    (totalPayment["TF PEMBAYARAN PIUTANG"] || 0);
    const totalPembayar =
    (totalPayment["KES PEMBAYARAN"] || 0) +
    (totalPayment["TF PEMBAYARAN"] || 0);
  // Definisi kolom tabel
  const columns = [
    {
      title: "Memo",
      dataIndex: "memo",
      key: "memo",
    },
    {
      title: "Tanggal Nota",
      dataIndex: "trans_date_main",
      key: "trans_date_main",
    },
    {
      title: "Pelanggan",
      dataIndex: "contact_id",
      key: "contact_id",
      render: (contactId: string) => getContactName(contactId),
    },
    ...Array.from(paymentMethods).map((method) => ({
      title: method,
      dataIndex: method,
      key: method,
      render: (value: number) => (value ? new Intl.NumberFormat("id-ID").format(value) : "-"),
    })),
  ];

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <Title level={3}>Laporan Penjualan</Title>
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
        dataSource={tableData}
        loading={isLoading}
        pagination={false}
        summary={() => (
          <>
            {/* Total Per Metode Pembayaran */}
            <Table.Summary.Row>
  <Table.Summary.Cell index={0} colSpan={3}>
    <div style={{ textAlign: "right" }}>
      <strong>Sub Total</strong>
    </div>
  </Table.Summary.Cell>
  {Array.from(paymentMethods).map((method, index) => (
    <Table.Summary.Cell key={index} index={index + 3}>
      <div style={{ textAlign: "right" }}>
        <strong>
          {totalPayment[method] ? new Intl.NumberFormat("id-ID").format(totalPayment[method]) : "-"}
        </strong>
      </div>
    </Table.Summary.Cell>
  ))}
</Table.Summary.Row>

{/* Total Pembayar Piutang */}
<Table.Summary.Row>
  <Table.Summary.Cell index={0} colSpan={columns.length - 1}>
    <div style={{ textAlign: "right" }}>
      <strong>Total Pembayar Piutang</strong>
    </div>
  </Table.Summary.Cell>
  <Table.Summary.Cell index={columns.length - 1}>
    <div style={{ textAlign: "right" }}>
      <strong>
        {totalPembayarPiutang ? new Intl.NumberFormat("id-ID").format(totalPembayarPiutang) : "-"}
      </strong>
    </div>
  </Table.Summary.Cell>
</Table.Summary.Row>

{/* Total Pembayar */}
<Table.Summary.Row>
  <Table.Summary.Cell index={0} colSpan={columns.length - 1}>
    <div style={{ textAlign: "right" }}>
      <strong>Total Pembayaran Langsung</strong>
    </div>
  </Table.Summary.Cell>
  <Table.Summary.Cell index={columns.length - 1}>
    <div style={{ textAlign: "right" }}>
      <strong>
        {totalPembayar ? new Intl.NumberFormat("id-ID").format(totalPembayar) : "-"}
      </strong>
    </div>
  </Table.Summary.Cell>
</Table.Summary.Row>
{/* Total Keseluruhan */}
<Table.Summary.Row>
  <Table.Summary.Cell index={0} colSpan={columns.length - 1}>
    <div style={{ textAlign: "right" }}>
      <strong>Total Keseluruhan</strong>
    </div>
  </Table.Summary.Cell>
  <Table.Summary.Cell index={columns.length - 1}>
    <div style={{ textAlign: "right" }}>
      <strong>
        {totalPembayarPiutang && totalPembayar 
          ? new Intl.NumberFormat("id-ID").format(totalPembayarPiutang + totalPembayar) 
          : "-"}
      </strong>
    </div>
  </Table.Summary.Cell>
</Table.Summary.Row>


          </>
        )}
      />
    </div>
  );
};

export default WithholdingTable;
