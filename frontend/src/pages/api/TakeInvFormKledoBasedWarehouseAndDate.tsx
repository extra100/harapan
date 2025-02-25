import { useState, useEffect, useMemo } from "react";
import { HOST } from "../../config";
import TOKEN from "../../token";

export interface Invoice {
  id: string;
  ref_number: string;
  contact_id: string;
  warehouse_id: string;
  name: string;
  due: number;
  amount: number;
  trans_date: string;
  memo: string;
  items: {
    finance_account_id: number;
    id: number;
    tran_id: number;
    trans_type_id: number;
    qty: number;
    price: number;
    amount: number;
    price_after_tax: number;
    amount_after_tax: number;
    discount_amount: number;
    discount_persen: number;
  }[];
  witholdings: {
    down_payment: number;
    status: string;
    id: string;
  }[];
}

export function TakeInvFormKledoBasedWarehouseAndDate(
  dateFrom: string | null,
  dateTo: string | null,
  warehouseId?: string
) {
  const [loading, setLoading] = useState(true);
  const [getInvKledoBasedWarehouseAndDate, setGetInvBasedWarehouseAndDate] =
    useState<Invoice[]>([]);

  useEffect(() => {
    if (!dateFrom || !dateTo) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let allInvoices: Invoice[] = [];
        let page = 1;
        let hasMoreData = true;

        while (hasMoreData) {
          const url = `${HOST}/finance/invoices?warehouse_id=${
            warehouseId || ""
          }&page=${page}&date_from=${dateFrom}&date_to=${dateTo}&per_page=50000000000`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch invoices");
          }

          const data = await response.json();
          console.log('sgrfrfhzfhzthsfEGRTHThjthj',data );

          const formattedData: Invoice[] = data.data.data.map((inv: any) => ({
            id: inv.id,
            ref_number: inv.ref_number,
            contact_id: inv.contact_id,
            warehouse_id: inv.warehouse_id,
            name: inv.contact?.name || "Unknown Contact",
            due: inv.due,
            amount: inv.amount,
            memo: inv.memo,
            trans_date: inv.trans_date,
            items: Array.isArray(inv.items)
              ? inv.items.map((item: any) => ({
                  finance_account_id: item.finance_account_id,
                  id: item.id,
                  tran_id: item.tran_id,
                  trans_type_id: item.trans_type_id,
                  qty: item.qty,
                  price: item.price,
                  amount: item.amount,
                  price_after_tax: item.price_after_tax,
                  discount_amount: item.discount_amount,
                  discount_persen: item.discount_persen,
                  amount_after_tax: item.amount_after_tax,
                }))
              : [],
            witholdings: Array.isArray(inv.witholdings)
              ? inv.witholdings.map((witholding: any) => ({
                  down_payment: witholding.down_payment,
                  status: witholding.status,
                  id: witholding.id,
                }))
              : [],
          }));

          allInvoices = [...allInvoices, ...formattedData];

          if (data.data.data.length < 50000000000) {
            hasMoreData = false;
          } else {
            page++;
          }
        }

        setGetInvBasedWarehouseAndDate(allInvoices);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateFrom, dateTo, warehouseId]);

  const memoizedData = useMemo(
    () => getInvKledoBasedWarehouseAndDate,
    [getInvKledoBasedWarehouseAndDate]
  );

  return { loading, getInvKledoBasedWarehouseAndDate };
}
export function TakeInvFormKledoBasedAndDate(dateFrom: string | null, dateTo: string | null) {
  const [loading, setLoading] = useState(true);
  const [getInvKledoBaseddDate, TakeInvFormKledoBasedAndDate] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!dateFrom || !dateTo) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let allInvoices: Invoice[] = [];
        let page = 1;
        let hasMoreData = true;

        while (hasMoreData) {
          const url = `${HOST}/finance/invoices?page=${page}&date_from=${dateFrom}&date_to=${dateTo}&per_page=50000000000`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch invoices");
          }

          const data = await response.json();
          console.log('Fetched Invoices:', data);

          const formattedData: Invoice[] = data.data.data.map((inv: any) => ({
            id: inv.id,
            ref_number: inv.ref_number,
            contact_id: inv.contact_id,
            warehouse_id: inv.warehouse_id,
            name: inv.contact?.name || "Unknown Contact",
            due: inv.due,
            amount: inv.amount,
            memo: inv.memo,
            trans_date: inv.trans_date,
            items: Array.isArray(inv.items)
              ? inv.items.map((item: any) => ({
                  finance_account_id: item.finance_account_id,
                  id: item.id,
                  tran_id: item.tran_id,
                  trans_type_id: item.trans_type_id,
                  qty: item.qty,
                  price: item.price,
                  amount: item.amount,
                  price_after_tax: item.price_after_tax,
                  discount_amount: item.discount_amount,
                  discount_persen: item.discount_persen,
                  amount_after_tax: item.amount_after_tax,
                }))
              : [],
            witholdings: Array.isArray(inv.witholdings)
              ? inv.witholdings.map((witholding: any) => ({
                  down_payment: witholding.down_payment,
                  status: witholding.status,
                  id: witholding.id,
                }))
              : [],
          }));

          allInvoices = [...allInvoices, ...formattedData];

          if (data.data.data.length < 50000000000) {
            hasMoreData = false;
          } else {
            page++;
          }
        }

        TakeInvFormKledoBasedAndDate(allInvoices);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateFrom, dateTo]);

  return { loading, getInvKledoBaseddDate };
}

