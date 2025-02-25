import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true, collection: 'penjualankategory' } })
export class KategoryPenjualan {
  public _id?: string
  @prop({ required: true })
  public id_outlet!: number
  @prop({ required: true })
  public outlet_name!: string
  @prop({ required: true })
  public month!: number
  @prop({ required: true })
  public atap!: number
  @prop({ required: true })
  public genteng_pasir!: number
  @prop({ required: true })
  public baja!: number
  @prop({ required: true })
  public baut!: number
  @prop({ required: true })
  public plafon!: number
  @prop({ required: true })
  public besi_kotak!: number
  @prop({ required: true })
  public triplek!: number
  @prop({ required: true })
  public asesoris!: number
  @prop({ required: true })
  public spandek_pasir!: number
  @prop({ required: true })
  public besi!: number
  @prop({ required: true })
  public pipa_air!: number
  @prop({ required: true })
  public target!: number
}

export const KategoryPenjualanModel = getModelForClass(KategoryPenjualan)
