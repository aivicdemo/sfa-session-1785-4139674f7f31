import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { validateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨精度検証機能 - 推奨内容が null のエラーハンドリング', () => {
  let mockAIEngine: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  // SCEN-352
  test('推奨内容が null のとき、精度検証がエラーになる', () => {
    const nullRecommendation = null;
    const validationContext = {
      customerId: 'CUST-12345',
      dealId: 'DEAL-98765',
      dealConditions: {
        industry: '製造業',
        companySize: '大企業',
        budget: 5000000,
        timeline: '3ヶ月以内',
      },
    };

    expect(() => {
      validateRecommendationAccuracy(
        nullRecommendation,
        validationContext,
        mockAIEngine
      );
    }).toThrow(/推奨内容がnull/);
  });
});