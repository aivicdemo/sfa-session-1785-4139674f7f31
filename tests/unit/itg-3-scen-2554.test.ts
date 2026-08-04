import { describe, it, expect } from '@jest/globals';
import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  it('SCEN-2554: 信頼度スコアが欠落しているとき、例外が発生する', () => {
    const stub_aiRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        isApplicable: true,
        relevanceScore: 85,
      }),
    };

    const recommendation_input = {
      customer_id: 'CUST-001',
      industry: 'IT',
      company_size: 'medium',
      business_challenge: 'Digital transformation',
      budget: 500000,
      timeline_months: 6,
    };

    const recommendation_result = stub_aiRecommendationEngine.evaluatePatternRelevance(
      recommendation_input
    );

    expect(() => {
      visualizeRecommendationReasoning(
        recommendation_result,
        stub_aiRecommendationEngine
      );
    }).toThrow(/信頼度スコア/);
  });
});