import React, { useState, useEffect, useContext } from "react";
import { Button, Col, DatePicker, Input, Row, Select, Table, Tag } from "antd";

import { useGetTransaksisQuery } from "../../hooks/transactionHooks";
import { useGetTransaksisQuerymu } from "../../hooks/transactionHooks";
import { useIdInvoice } from "./takeSingleInvoice";
import UserContext from "../../contexts/UserContext";
import { useGetContactsQuery } from "../../hooks/contactHooks";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetoutletsQuery } from "../../hooks/outletHooks";
import { TakeInvFormKledoBasedAndDate, TakeInvFormKledoBasedWarehouseAndDate } from "./TakeInvFormKledoBasedWarehouseAndDate";

const CariBeda: React.FC = () => {
  const { data } = useGetTransaksisQuery();
  const location = useLocation();

  const userContext = useContext(UserContext);
  const { user } = userContext || {};
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  );
  console.log({selectedWarehouseId})
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const {
    data: getInvFromWakandaBasedWarehouseAndDate,
    isLoading,
    error,
  } = useGetTransaksisQuerymu(selectedWarehouseId, startDate, endDate);

  // const { loading, getInvKledoBaseddDate } =
  //   TakeInvFormKledoBasedWarehouseAndDate(
  //     startDate,
  //     endDate,
  //     selectedWarehouseId
  //   );


    const { getInvKledoBaseddDate } =
    TakeInvFormKledoBasedAndDate(
      startDate,
      endDate,
    );
  console.log({ getInvKledoBaseddDate });

  const [combinedData, setCombinedData] = useState<any[]>([]);
  const wakandaMemo = getInvFromWakandaBasedWarehouseAndDate?.map(
    (item) => item.memo
  );
  console.log({wakandaMemo})
  useEffect(() => {
    if (
      getInvFromWakandaBasedWarehouseAndDate &&
      getInvKledoBaseddDate
    ) {
      const wakandaMemo = getInvFromWakandaBasedWarehouseAndDate.map(
        (item) => item.memo
      );
      const kledoMemo = getInvKledoBaseddDate.map(
        (item) => item.memo
      );
      const commonMemo = wakandaMemo.filter((memo) => kledoMemo.includes(memo));

      const filteredData = commonMemo.map((memo) => {
        const wakandaItem = getInvFromWakandaBasedWarehouseAndDate.find(
          (item) => item.memo === memo
        );
        const kledoItem = getInvKledoBaseddDate.find(
          (item) => item.memo === memo
        );

        return {
          wakanda: wakandaItem,
          kledo: kledoItem,
        };
      });

      console.log(
        "Filtered Data (Data Gabungan Wakanda dan Kledo):",
        filteredData
      );

      // Update state dengan data yang sudah difilter dan digabungkan
      setCombinedData(filteredData);
    }
  }, [
    getInvFromWakandaBasedWarehouseAndDate,
    getInvKledoBaseddDate,
  ]);
  console.log({ combinedData });
  const { data: contacts } = useGetContactsQuery();
  const { data: gudangs } = useGetoutletsQuery();

  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(Number(user.id_outlet));
    }
  }, [user]);
  const [selectedRefNumber, setSelectedRefNumber] = useState<string | null>(
    null
  );
  const { getIdAtInvoice } = useIdInvoice(selectedRefNumber || "");

  const handleRefNumberClick = (ref_number: string) => {
    setSelectedRefNumber(ref_number);
  };

  const [searchText, setSearchText] = useState<string>("");
  //aneh
  const getContactName = (contact_id: string | number) => {
    const contact = contacts?.find((c) => c.id === contact_id);
    return contact ? contact.name : "waiting...";
  };
  const getWarehouseName = (warehouse_id: string | number) => {
    const warehouse = gudangs?.find(
      (gudang) => String(gudang.id_outlet) === String(warehouse_id)
    );
    return warehouse ? warehouse.nama_outlet : "waiting...";
  };

  const formatDateForBackend = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };
  const handleDateChange = (date: any, dateString: string) => {
    const formattedDate = formatDateForBackend(dateString);
    setStartDate(formattedDate); 
    setEndDate(formattedDate);
  };
  const handleDateChangeSampai = (date: any, dateString: string) => {
    const formattedDate = formatDateForBackend(dateString); 

    setEndDate(formattedDate);
  };
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const getStatus = (transaction: any) => {
    const totalDownPayment = transaction.witholdings.reduce(
      (sum: number, witholding: any) => sum + (witholding.down_payment || 0),
      0
    );

    const due = transaction.amount - totalDownPayment;

    if (due === 0 || due <= 0) {
      return "Lunas";
    } else if (totalDownPayment > 0 && due > 0) {
      return "Dibayar Sebagian";
    } else {
      return "Belum Dibayar";
    }
  };
  const [searchRef, setSearchRef] = useState("");
  const [searchContact, setSearchContact] = useState<number | undefined>();
  const [searchWarehouse, setSearchWarehouse] = useState<number | undefined>();
  const [searchStatus, setSearchStatus] = useState<string | undefined>();

  const filteredData = getInvFromWakandaBasedWarehouseAndDate

    ?.filter((transaction) => {
      if (searchStatus) {
        const statusText = getStatus(transaction);
        return statusText.toLowerCase() === searchStatus.toLowerCase();
      }
      return true;
    })
    ?.filter((transaction) => {
      const transDate = new Date(transaction.trans_date);
      const start = startDate
        ? new Date(formatDateForBackend(startDate))
        : null;
      const end = endDate ? new Date(formatDateForBackend(endDate)) : null;
      return (
        transaction.jalur === "penjualan" && transaction.reason_id !== "void"
      );
    })
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const maxLength = Math.max(
    filteredData?.length || 0,
    getInvKledoBaseddDate?.length || 0
  );

  const filteredTransaksi = getInvFromWakandaBasedWarehouseAndDate?.filter(
    (item: any) => item.reason_id === "void"
  );

  const [activeButton, setActiveButton] = useState("");
  const navigate = useNavigate();
  const handleButtonClick = (value: any) => {
    setActiveButton(value);

    if (value === "1") {
      navigate("/listkledo");
    } else if (value === "2") {
      navigate("/listvoid");
    } else if (value === "3") {
      navigate("/listreturn");
    }
  };

  const roundUpIndonesianNumber = (value: number | null): string => {
    if (value === null) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const combinedParallelData = Array.from(
    {
      length: Math.max(
        filteredData?.length || 0,
        getInvKledoBaseddDate?.length || 0
      ),
    },
    (_, index) => {
      const wakandaMemo = filteredData?.[index]?.memo;

      const kledoData = getInvKledoBaseddDate?.find(
        (item) => item.memo === wakandaMemo
      );
      return {
        wakanda: filteredData?.[index] || { memo: "-" },
        kledo: kledoData || { memo: "-" },
      };
    }
  );

  console.log({ combinedParallelData });
  const rowClassName = (record: any) => {
    const wakandaTotal = record?.wakanda?.amount || 0;
    const kledoTotal = record?.kledo?.amount || 0;
    const wakandaPaid = (
      record?.wakanda?.witholdings?.filter(
        (witholding: any) => witholding.status === 0
      ) || []
    ).reduce(
      (sum: number, witholding: any) => sum + (witholding.down_payment || 0),
      0
    );
    const kledoPaid = record?.kledo?.amount - record?.kledo?.due || 0;
    const wakandaRemaining = wakandaTotal - wakandaPaid;
    const kledoRemaining = record?.kledo?.due || 0;

    if (wakandaTotal !== kledoTotal) {
      return "row-different-total";
    }
    if (wakandaPaid !== kledoPaid) {
      return "row-different-paid";
    }
    if (wakandaRemaining !== kledoRemaining) {
      return "row-different-remaining";
    }

    return "";
  };
  // Kolom Wakanda dan Kledo
  const columns = [
    {
      title: "No",
      key: "no",
      render: (_: any, record: any, index: number) => {
        const refNumber = record?.wakanda?.memo;
        if (!refNumber || refNumber === "-") {
          return index + 1; 
        }
        return (
          <a
            href={`/getinvbasedondate/${refNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            {index + 1}
          </a>
        );
      },
      width: 50,
    },
    
    
    {
      title: "Wakanda ID",
      dataIndex: ["wakanda", "id"],
      key: "wakanda_id",
      render: (text: any) => text || "-",
    },
    {
      title: "Wakanda Inv",
      dataIndex: ["wakanda", "memo"],
      key: "wakanda_memo",
      render: (text: string) => {
        if (!text || text === "-") {
          return "-";
        }
        return (
          <a
            href={`/kopipenjualan/${text}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            {text}
          </a>
        );
      },
    },
    {
      title: "Wakanda Tanggal",
      dataIndex: ["wakanda", "trans_date"],
      key: "wakanda_date",
      render: (text: any) => text || "-",
    },
    {
      title: "Wakanda Total",
      dataIndex: ["wakanda", "amount"],
      key: "wakanda_total",
      render: (amount: number) =>
        amount !== undefined ? roundUpIndonesianNumber(amount) : "-",
      align: "right",
    },

    {
      title: "Terbayar",
      dataIndex: ["wakanda", "witholdings"],

      key: "witholdings",
      align: "center",
      render: (witholdings: any[]) => {
        const totalDownPayment = (
          witholdings?.filter((witholding) => witholding.status === 0) || []
        ).reduce((sum, witholding) => sum + (witholding.down_payment || 0), 0);

        return (
          <div style={{ textAlign: "right" }}>
            {totalDownPayment !== undefined
              ? roundUpIndonesianNumber(totalDownPayment)
              : "Rp 0"}
          </div>
        );
      },
    },

    {
      title: "Sisa Tagihan",
      key: "remaining_balance",
      render: (_: any, record: any) => {
        const total = record?.wakanda?.amount || 0;
        const paid = (
          record?.wakanda?.witholdings?.filter(
            (witholding: any) => witholding.status === 0
          ) || []
        ).reduce(
          (sum: number, witholding: any) =>
            sum + (witholding.down_payment || 0),
          0
        );

        const remainingBalance = total - paid;

        return (
          <div style={{ textAlign: "right" }}>
            {remainingBalance !== undefined
              ? roundUpIndonesianNumber(remainingBalance)
              : "Rp 0"}
          </div>
        );
      },
      align: "right",
    },

    {
      title: "Pemisah",
      key: "separator",
      render: () => (
        <div
          style={{
            backgroundColor: "green",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {"|"}
        </div>
      ),
      width: 10,
    },

    {
      title: "No Inv",
      dataIndex: ["kledo", "memo"],
      key: "kledo_memo",
      render: (text: any) => text || "-",
    },

    {
      title: "Kledo Total",
      dataIndex: ["kledo", "amount"],
      key: "kledo_total",
      render: (amount: number) =>
        amount !== undefined ? roundUpIndonesianNumber(amount) : "-",
      align: "right",
    },
    {
      title: "Terbayar",
      key: "kledo_paid",
      render: (_: any, record: any) => {
        const totalAmount = record?.kledo?.amount || 0;
        const dueAmount = record?.kledo?.due || 0;

        const paidAmount = totalAmount - dueAmount;

        return (
          <div style={{ textAlign: "right" }}>
            {paidAmount !== undefined
              ? roundUpIndonesianNumber(paidAmount)
              : "Rp 0"}
          </div>
        );
      },
      align: "right",
    },
    {
      title: "Sisa Tagihan",
      dataIndex: ["kledo", "due"],
      key: "kledo_due",
      render: (due: number) =>
        due !== undefined ? roundUpIndonesianNumber(due) : "-",
      align: "right",
    },
  ];

  return (
    <>
      <h1>SIKRONISASI NOTA</h1>

      <Row gutter={16} style={{ marginBottom: 16, marginTop: 16 }}>
        <Col>
          <DatePicker
            placeholder="Dari Tanggal"
            format="DD-MM-YYYY"
            onChange={(date, dateString) =>
              handleDateChange(date, dateString as any)
            } // Panggil fungsi handleDateChange
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
      </Row>
      {/* <Table
        dataSource={filteredData}
        columns={columns as any}
        rowKey="_id"
        pagination={{ pageSize: 100 }}
      /> */}
      <Table
        dataSource={combinedParallelData}
        columns={columns as any}
        rowClassName={rowClassName}
        rowKey={(record, index: any) => index} // Gunakan index sebagai rowKey
        pagination={{
          pageSize: 100,
          showTotal: (total) => `Total ${total} Baris`,
        }}
        summary={(pageData) => {
          let totalAmount = 0;
          let totalTerbayar = 0;
          let totalSisaTagihan = 0;
          const totalRows = filteredData?.length;

          //   pageData.forEach(({ amount, witholdings }) => {
          //     totalAmount += amount
          //     const totalDownPayment = witholdings
          //       .filter((witholding: any) => witholding.status === 0)
          //       .reduce(
          //         (sum: number, witholding: any) =>
          //           sum + (witholding.down_payment || 0),
          //         0
          //       )
          //     totalTerbayar += totalDownPayment
          //     totalSisaTagihan += amount - totalDownPayment
          //   })

          // Hitung total semua halaman (dari dataSource)
          let grandTotalAmount = 0;
          let grandTotalTerbayar = 0;
          let grandTotalSisaTagihan = 0;

          filteredData?.forEach(({ amount, witholdings }) => {
            grandTotalAmount += amount;
            const totalDownPayment = witholdings
              .filter((witholding: any) => witholding.status === 0)
              .reduce(
                (sum: number, witholding: any) =>
                  sum + (witholding.down_payment || 0),
                0
              );
            grandTotalTerbayar += totalDownPayment;
            grandTotalSisaTagihan += amount - totalDownPayment;
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={7} colSpan={7}>
                  <strong>Sub Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <strong>{`${roundUpIndonesianNumber(totalAmount)}`}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <strong>{`${roundUpIndonesianNumber(totalTerbayar)}`}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={17} align="right">
                  <strong>{`${roundUpIndonesianNumber(
                    totalSisaTagihan
                  )}`}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={7} colSpan={7}>
                  <strong>Total Semua Halaman</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <strong>{`${roundUpIndonesianNumber(
                    grandTotalAmount
                  )}`}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <strong>{`${roundUpIndonesianNumber(
                    grandTotalTerbayar
                  )}`}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={17} align="right">
                  <strong>{`${roundUpIndonesianNumber(
                    grandTotalSisaTagihan
                  )}`}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default CariBeda;
