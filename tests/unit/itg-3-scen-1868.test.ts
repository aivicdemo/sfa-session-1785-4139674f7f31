import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

// Mock AIRecommendationEngine
jest.mock('../../src/adapters/AIRecommendationEngine', () => ({
  AIRecommendationEngine: jest.fn().mockImplementation(() => ({
    evaluatePatternRelevance: jest.fn(),
    explainRecommendationReasoning: jest.fn(),
  })),
}));

describe('推奨内容の根拠表示機能', () => {
  // SCEN-1868
  test('根拠の適用可能性スコアが0未満のとき根拠表示に失敗する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: -0.5,
        patternId: 'pattern-001',
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealData = {
      customerId: 'cust-12345',
      customerName: 'テスト顧客',
      industry: 'IT',
      companySize: 'large',
      dealId: 'deal-67890',
      dealCondition: {
        productCategory: 'software',
        budgetAmount: 5000000,
        decisionTimeline: '2024-02-28',
      },
    };

    const patternData = {
      patternId: 'pattern-001',
      successRate: 0.85,
      relatedCustomerCount: 120,
    };

    expect(() =>
      explainRecommendationReasoning(
        dealData,
        patternData,
        mockAIEngine
      )
    ).toThrow(/適用可能性スコア/);
  });
});