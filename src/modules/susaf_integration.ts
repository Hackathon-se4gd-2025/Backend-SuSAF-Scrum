import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationService } from '../services/susaf_integration';
import { IntegrationController } from '../controllers/susaf_integration';
import { SustainabilityEffect, SustainabilityEffectSchema, EffectDetail, EffectDetailSchema } from '../schemas/sustainability';
import { Recommendation, RecommendationSchema } from '../schemas/sustainability';
import { Item, ItemSchema } from '../schemas/item'; // ✅ Import ItemSchema
import { Project, ProjectSchema } from '../schemas/project'; // ✅ Add this if missing


@Module({
  imports: [
    HttpModule, // ✅ Allows HTTP requests to external APIs
    MongooseModule.forFeature([
      { name: SustainabilityEffect.name, schema: SustainabilityEffectSchema },
      { name: EffectDetail.name, schema: EffectDetailSchema },
      { name: Recommendation.name, schema: RecommendationSchema },
      { name: Item.name, schema: ItemSchema }, // ✅ Register ItemModel here
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}