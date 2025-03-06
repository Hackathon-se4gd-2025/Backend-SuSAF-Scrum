import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SustainabilityEffect, EffectDetail, Recommendation } from '../schemas/sustainability';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';

dotenv.config(); // ✅ Load environment variables from .env

@Injectable()
export class IntegrationService {
  private readonly API_BASE_URL = process.env.SUSAF_API_URL;
  private readonly API_TOKEN = process.env.SUSAF_API_TOKEN;
  private readonly logger = new Logger(IntegrationService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(SustainabilityEffect.name) private readonly effectModel: Model<SustainabilityEffect>,
    @InjectModel(EffectDetail.name) private readonly effectDetailModel: Model<EffectDetail>,
    @InjectModel(Recommendation.name) private readonly recommendationModel: Model<Recommendation>
  ) {}

  async fetchAndStoreSustainabilityEffects(): Promise<any> {
    try {
      // Fetch Effects Data
      const url = `${this.API_BASE_URL}/effects/${this.API_TOKEN}`;
      this.logger.log(`Fetching Sustainability Effects from: ${url}`);

      const response = await firstValueFrom(this.httpService.post(url));
      if (!response || !response.data) {
        throw new Error('No response received from the API');
      }

      const data = response.data;

      // Process and Save Effects
      const effectDocuments = await Promise.all(
        data.effects.map(async (effect) => {
          const effectDetails = await this.effectDetailModel.insertMany(effect.effects);
          return await this.effectModel.create({
            name: effect.name,
            question: effect.question,
            capture_id: effect.capture_id,
            created_at: new Date(effect.created_at),
            effects: effectDetails.map((detail) => detail),
          });
        })
      );

      return { message: 'Sustainability effects saved successfully', effects: effectDocuments };
    } catch (error) {
      this.logger.error(`Error fetching sustainability effects: ${error.message}`);
      throw new Error(`Failed to fetch and save sustainability effects: ${error.message}`);
    }
  }

  async fetchAndStoreRecommendations(): Promise<any> {
    try {
      // Fetch Recommendations Data
      const url = `${this.API_BASE_URL}/recommendations/${this.API_TOKEN}`;
      this.logger.log(`Fetching Recommendations from: ${url}`);

      const response = await firstValueFrom(this.httpService.post(url));
      if (!response || !response.data) {
        throw new Error('No response received from the API');
      }

      const data = response.data;

      // Process and Save Recommendations
      const recommendationDocuments = await Promise.all(
        Object.values(data.synthesis).map((rec: any) =>
          this.recommendationModel.create({
            threats: rec.recommendation.threats,
            opportunities: rec.recommendation.opportunities,
            recommendations: rec.recommendation.recommendations,
          })
        )
      );

      return { message: 'Recommendations saved successfully', recommendations: recommendationDocuments };
    } catch (error) {
      this.logger.error(`Error fetching recommendations: ${error.message}`);
      throw new Error(`Failed to fetch and save recommendations: ${error.message}`);
    }
  }
}