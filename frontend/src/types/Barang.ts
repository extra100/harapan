export type Barang = {
  _id: string
  id: number
  name: string
  code: string
  price: number
  unit_id: number
  qty: number
  pos_product_category_id: number

  unit?: {
    id: number
    name: string
  }
}
