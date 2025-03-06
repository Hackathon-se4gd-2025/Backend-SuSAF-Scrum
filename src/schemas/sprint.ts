import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Item } from './item'; // Assuming you already have Item schema
import { Types } from 'mongoose';

@Schema()
export class Sprint extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Date })
  start: Date;

  @Prop({ required: true, type: Date })
  end: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }] })
  items: Types.ObjectId[];
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);