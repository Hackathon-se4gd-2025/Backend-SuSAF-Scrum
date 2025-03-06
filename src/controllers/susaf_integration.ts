import { Controller, Post } from '@nestjs/common';
import { IntegrationService } from '../services/susaf_integration';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  /**
   * Fetch and store sustainability effects from SuSAF API
   * @returns Success message with stored effects
   */
  @Post('effects')
  async fetchEffects() {
    return this.integrationService.fetchAndStoreSustainabilityEffects();
  }

  /**
   * Fetch and store AI-generated recommendations from SuSAF API
   * @returns Success message with stored recommendations
   */
  @Post('recommendations')
  async fetchRecommendations() {
    return this.integrationService.fetchAndStoreRecommendations();
  }
}