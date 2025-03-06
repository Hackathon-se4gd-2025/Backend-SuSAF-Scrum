import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Sprint } from './sprint';
import { Item } from './item';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Sprint' }] })
  sprints: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }] })
  items: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);