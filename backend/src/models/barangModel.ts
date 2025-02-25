import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Barang {
  public _id?: string
  @prop({ required: true })
  public id!: number
  @prop({ required: true, unique: true })
  public name!: string
  @prop({ required: true, unique: true })
  public code!: string
  @prop({ required: true, unique: true })
  public price!: number
  @prop()
  public unit_id!: number
  @prop({ required: true, unique: true })
  public unit?: {
    id: number
    name: string
  }
  @prop({ required: true, unique: true })
  public pos_product_category_id!: number
  @prop({ required: true, unique: true })
  public qty!: number
}
export const BarangModel = getModelForClass(Barang)
