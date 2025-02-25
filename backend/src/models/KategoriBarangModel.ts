import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Karbar {
  public _id?: string
  @prop({ required: true })
  public id!: number
  @prop({ required: true })
  public name!: string
}

export const KategoriBarangModel = getModelForClass(Karbar)
