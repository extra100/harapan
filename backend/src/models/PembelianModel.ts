import { modelOptions, prop, getModelForClass, index } from '@typegoose/typegoose'

@index({ trans_date: 1, warehouse_id: 1 }) // Index untuk pencarian berdasarkan tanggal dan gudang
@index({ unique_id: 1 }) // Index untuk pencarian cepat berdasarkan unique_id
@index({ contact_id: 1 }) // Index untuk pencarian berdasarkan pelanggan/vendor
@index({ ref_transaksi: 1 }) // Index untuk pencarian berdasarkan referensi transaksi
@modelOptions({ schemaOptions: { timestamps: true } })
export class Pembelian {
  @prop({ required: true })
  public id?: number
  @prop({ required: true })
  public trans_date?: string
  @prop({ required: true })
  public jalur?: string
  @prop({ required: true })
  public due_date?: string

  @prop({ required: true })
  public unique_id!: number
  @prop({ required: true })
  public contact_id!: number
  @prop({ required: true })
  public amount!: number
  @prop({ required: true })
  public ref_transaksi!: string
  @prop({ required: true })
  public down_payment!: number
  @prop({ required: true })
  public reason_id!: string
  @prop()
  public sales_id?: number | null
  @prop({ required: true })
  public status_id!: number
  @prop({ required: true })
  public due!: number
  @prop({ required: true })
  public include_tax!: number

  @prop({ required: true })
  public term_id!: number

  @prop({ required: true })
  public ref_number!: string
  @prop({ required: true })
  public externalId!: number
  @prop()
  public memo?: string

  @prop({ type: () => [String], required: true })
  public attachment!: any[]

  @prop({ type: () => [Item], required: true })
  public items!: Item[]

  @prop({ type: () => [Witholding], required: true })
  public witholdings!: Witholding[]

  @prop({ type: () => [Contact], required: true })
  public contacts!: Contact[]
  @prop({ type: () => [Warehouses], required: true })
  public warehouses!: Warehouses[]

  @prop({ required: true })
  public warehouse_id?: number

  @prop({ required: false })
  public message?: string

  @prop({ type: () => [Tages], required: true })
  public tages!: Tages[]

  @prop({ required: true })
  public witholding_percent!: number

  @prop({ required: true })
  public witholding_amount!: number

  @prop({ required: true })
  public witholding_account_id!: number
}

class Item {
  @prop({ required: true })
  public id!: number
  @prop({ required: true })
  public finance_account_id!: number
  @prop()
  public name!: string

  @prop({ required: true })
  public qty!: number
  @prop({ required: true })
  public qty_update!: number

  @prop({ required: true })
  public price!: number

  @prop({ required: true })
  public amount!: number
  
  
  @prop({ required: true })
  public pos_product_category_id!: number

  @prop({ required: true })
  public discount_percent!: number

  @prop({ required: true })
  public discount_amount!: number
  @prop()
  public unit_id!: number

  @prop()
  public satuan!: string
}

class Witholding {
  @prop({ required: true })
  public witholding_account_id!: number
  @prop({ required: true })
  public id!: number
  @prop({ required: true })
  public down_payment!: number
  @prop({ required: true })
  public status!: number
  @prop({ required: true })
  public name!: string
  @prop({ required: true })
  public trans_date!: string
  @prop()
  public witholding_amount!: number
  @prop()
  public witholding_percent!: number
}
class Contact {
  @prop({ required: true })
  public id!: number

  @prop()
  public name!: string
}
class Warehouses {
  @prop({ required: true })
  public warehouse_id!: number

  @prop({ required: true })
  public name!: string
}
class Tages {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public name!: string
}

export const PembelianModel = getModelForClass(Pembelian)
