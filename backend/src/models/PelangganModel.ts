import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Pelanggan {
  @prop({ required: true })
  public address!: string

  @prop({ required: true })
  public name!: string
  
  @prop({ required: true })
  public phone!: string

  @prop({ required: true })
  public outlet_name?: string

  
  @prop({ required: true })
  public id_outlet?: number
  @prop({ required: true })
  public id_kontak?: number

 
  
  
}

export const PelangganModel = getModelForClass(Pelanggan)
