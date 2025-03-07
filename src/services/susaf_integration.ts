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
        this.logger.log('HERE 2');

        // Fetch stored recommendations from the database
        const recommendations = await this.recommendationModel.find();
        this.logger.log('HERE 1');

        if (!recommendations.length) {
            throw new Error('No recommendations found in the database.');
        }
        this.logger.log('HERE 3');

        //this.logger.log('HERE 3', recommendations);


        // Extract recommendation texts
        const recommendationTexts = recommendations.map(rec => Object.values(rec.recommendations)).flat();
        
        this.logger.log('HERE ');

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-2024-08-06",
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
                    
                    Return the output as a JSON array of objects.`
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    "name": "ProductItems",
                    "strict": true,
                    "schema": {
                      "type": "object",
                      "properties": {
                        "items": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                                "title": { "type": "string" },
                                "description": { "type": "string" },
                                "priority": { "type": "number" },
                                "storyPoints": { "type": "number" },
                                "sustainabilityPoints": { "type": "number" },
                                "acceptanceCriteria": { "type": "string" },

                            },
                            "required": ["title", "description", "priority", "storyPoints", "sustainabilityPoints", "acceptanceCriteria"],
                            "additionalProperties": false
                          }
                        }
                      },
                      "required": ["items"],
                      "additionalProperties": false
                    }
                  },
            },
            temperature: 0.7
        });


        this.logger.log('OpenAI Response:', completion);


      if (!completion.choices[0].message.content) {
          throw new Error('No content received from OpenAI');
      }
      const responseContent = JSON.parse(completion.choices[0].message.content);

      // Transform the response into the item structure and save to the database
      const items = responseContent.items.map(item => ({
          title: item.title,
          description: item.description,
          priority: item.priority,
          sustainability: true, // Assuming all items are sustainability-related
          storyPoints: item.storyPoints,
          sustainabilityPoints: item.sustainabilityPoints,
          status: 'AI generated', // Default status
          acceptanceCriteria: item.acceptanceCriteria,
          tags: [], // Assuming no tags provided in the response
          effects: [], // Assuming no effects provided in the response
          sprint: null, // Assuming no sprint provided in the response
          responsible: null // Assuming no responsible person provided in the response
      }));

      await this.itemModel.insertMany(items);

      return { message: 'Items generated and saved successfully', items };

    } catch (error) {
        this.logger.error(`TEST ERROR: ${error.message}`);
        throw new Error(`TEST ERROR1: ${error.message}`);
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