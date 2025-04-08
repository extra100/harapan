import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Biaya {
    public _id?: string
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public kategori!: string
  
  
}

export const BiayaModel = getModelForClass(Biaya)
