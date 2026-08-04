import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1884
  test('[error] 提案内容がnullのとき照合に失敗する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue(null),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: 'CUST-12345',
      customerIndustry: '製造業',
      customerScale: '従業員500名',
      dealCondition: '既存製品の追加購入',
      dealAmount: 5000000,
      dealStage: '提案準備',
    };

    const successPatterns = [
      {
        patternId: 'PAT-001',
        industry: '製造業',
        scale: '従業員500名',
        successRate: 0.85,
        approachDescription: 'コスト削減提案',
      },
    ];

    expect(() =>
      generateRecommendation(newDealData, successPatterns, mockAIEngine)
    ).toThrow(/提案内容/);
  });
});