export type WarehouseTransfer = {
  trans_date: string
  _id: string
  from_warehouse_id: number
  to_warehouse_id: number
  code: number
  id: number

  from_warehouse_name: string
  to_warehouse_name: string
  ref_number: string
  eksekusi: string
  memo: string
  items: TransferItem[]
  attachment: any[]
}

export type TransferItem = {
  finance_account_id: number
  product_id: number
  product_name: string
  qty: number
  qty_minta: number
  id: number
  unit_name: string
}
// export const WarehouseTransferModel = getModelForClass(WarehouseTransfer)
