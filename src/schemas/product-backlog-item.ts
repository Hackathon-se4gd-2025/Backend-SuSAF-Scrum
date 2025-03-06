import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Backlog extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const BacklogSchema = SchemaFactory.createForClass(Backlog);

@Schema()
export class Item extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  priority: number;

  @Prop({ required: true, type: Boolean })
  sustainability: boolean;

  @Prop({ type: Number })
  storyPoints: number;

  @Prop({ type: Number })
  sustainabilityPoints: number;

  @Prop({ required: true })
  status: string;

  @Prop()
  acceptanceCriteria: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [String] })
  effects: string[];

  @Prop()
  sprint: string;

  @Prop()
  responsible: string;
}


export const ItemSchema = SchemaFactory.createForClass(Item);