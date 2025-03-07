import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SustainabilityEffect, EffectDetail, Recommendation } from '../schemas/sustainability';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
import {OpenAI } from 'openai';
import { Item } from '../schemas/item';


dotenv.config(); // ✅ Load environment variables from .env

@Injectable()
export class IntegrationService {
  private readonly API_BASE_URL = process.env.SUSAF_API_URL;
  private readonly API_TOKEN = process.env.SUSAF_API_TOKEN;
  private readonly logger = new Logger(IntegrationService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(SustainabilityEffect.name) private readonly effectModel: Model<SustainabilityEffect>,
    @InjectModel(EffectDetail.name) private readonly effectDetailModel: Model<EffectDetail>,
    @InjectModel(Recommendation.name) private readonly recommendationModel: Model<Recommendation>,
    @InjectModel(Item.name) private readonly itemModel: Model<Item>
  ) {
    this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // ✅ Ensure API key is correctly set
      });
  }

  async generateItemsFromRecommendations(): Promise<any> {
    try {
      // Fetch stored recommendations from the database
      const recommendations = await this.recommendationModel.find();
      if (!recommendations.length) {
        throw new Error('No recommendations found in the database.');
      }

      // Extract recommendation texts
      const recommendationTexts = recommendations.flatMap(rec => Object.values(rec.recommendations));

      // ✅ OpenAI API Request
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o", // ✅ Use the latest model
        messages: [
          {
            role: "user",
            content: `Based on the following sustainability recommendations, generate structured backlog items.

            Recommendations:
            ${recommendationTexts.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

            Each backlog item should have:
            - A title
            - A short description
            - A priority level (low, medium, high)
            - Tags related to sustainability (list of relevant keywords)

            Return the output as a JSON array of objects, like this:
            [
              { "title": "Item Title", "description": "Short Description", "priority": "high", "tags": ["tag1", "tag2"] },
              ...
            ]`
          }
        ],
        temperature: 0.7
      });

      // ✅ Extract and parse the AI response
      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }
      const generatedItems = JSON.parse(content);

      // ✅ Store generated items in the database
      const savedItems = await this.itemModel.insertMany(generatedItems);

      return { message: 'Generated items successfully', items: savedItems };
    } catch (error) {
      this.logger.error(`Error generating items from recommendations: ${error.message}`);
      throw new Error(`Failed to generate items: ${error.message}`);
    }
  }

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
                // Process Effect Details
                const effectDetails = await Promise.all(
                    effect.effects.map(async (detail) => {
                        // ✅ Check if effect detail exists
                        const existingEffectDetail = await this.effectDetailModel.findOne({ external_id: detail.id });

                        if (existingEffectDetail) {
                            // ✅ Update existing effect detail
                            return await this.effectDetailModel.findOneAndUpdate(
                                { external_id: detail.id },
                                {
                                    description: detail.description,
                                    is_positive: detail.is_positive,
                                    likelihood: detail.likelihood,
                                    impact_level: detail.impact_level,
                                    order_of_impact: detail.order_of_impact,
                                    dimension_name: detail.dimension_name,
                                    dimension_id: detail.dimension_id,
                                    createdAt: new Date(detail.created_at),
                                    updatedAt: new Date(detail.updated_at),
                                    added_by_username: detail.added_by_username,
                                    added_by_email: detail.added_by_email,
                                    related_feature: detail.related_feature || null,
                                },
                                { new: true }
                            );
                        } else {
                            // ✅ Create new effect detail if it doesn't exist
                            return await this.effectDetailModel.create({
                                external_id: detail.id,
                                description: detail.description,
                                is_positive: detail.is_positive,
                                likelihood: detail.likelihood,
                                impact_level: detail.impact_level,
                                order_of_impact: detail.order_of_impact,
                                dimension_name: detail.dimension_name,
                                dimension_id: detail.dimension_id,
                                createdAt: new Date(detail.created_at),
                                updatedAt: new Date(detail.updated_at),
                                added_by_username: detail.added_by_username,
                                added_by_email: detail.added_by_email,
                                related_feature: detail.related_feature || null,
                            });
                        }
                    })
                );

                // ✅ Check if the main effect exists
                const existingEffect = await this.effectModel.findOne({ external_id: effect.id });

                if (existingEffect) {
                    // ✅ Update existing effect
                    return await this.effectModel.findOneAndUpdate(
                        { external_id: effect.id },
                        {
                            name: effect.name,
                            question: effect.question,
                            capture_id: effect.capture_id,
                            created_at: new Date(effect.created_at),
                            effects: effectDetails.map((detail) => detail),
                        },
                        { new: true }
                    );
                } else {
                    // ✅ Create new effect if it doesn't exist
                    return await this.effectModel.create({
                        external_id: effect.id,
                        name: effect.name,
                        question: effect.question,
                        capture_id: effect.capture_id,
                        created_at: new Date(effect.created_at),
                        effects: effectDetails.map((detail) => detail),
                    });
                }
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