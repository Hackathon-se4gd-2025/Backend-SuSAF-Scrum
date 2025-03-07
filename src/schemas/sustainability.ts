import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class EffectDetail extends Document {
  @Prop({ required: true })
  external_id: number; // ✅ Store the external API ID

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  is_positive: boolean;

  @Prop({ required: true })
  likelihood: number;

  @Prop({ required: true })
  impact_level: number;

  @Prop({ required: true })
  order_of_impact: string;

  @Prop({ required: true })
  dimension_name: string;

  @Prop({ required: true })
  dimension_id: number;

  @Prop({ required: true })
  added_by_username: string;

  @Prop({ required: true })
  added_by_email: string;

  @Prop({ type: String, default: null })
  related_feature?: string;
}

export const EffectDetailSchema = SchemaFactory.createForClass(EffectDetail);

@Schema({ timestamps: true })
export class SustainabilityEffect extends Document {
  @Prop({ required: true })
  external_id: number; // ✅ Store the external API ID

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  capture_id: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'EffectDetail' }] })
  effects: Types.ObjectId[];
}

export const SustainabilityEffectSchema = SchemaFactory.createForClass(SustainabilityEffect);

@Schema({ timestamps: true })
export class Recommendation extends Document {
  @Prop({ type: Map, of: String }) // ✅ Explicitly define as a key-value object
  threats: Record<string, string>;

  @Prop({ type: Map, of: String }) // ✅ Explicitly define as a key-value object
  opportunities: Record<string, string>;

  @Prop({ type: Map, of: String }) // ✅ Explicitly define as a key-value object
  recommendations: Record<string, string>;
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);