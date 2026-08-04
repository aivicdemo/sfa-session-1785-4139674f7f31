import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import type { AIRecommendationEngine } from '../../src/adapters/AIRecommendationEngine';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能', () => {
  let mockAIEngine: jest.Mocked<AIRecommendationEngine>;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    } as unknown as jest.Mocked<AIRecommendationEngine>;
  });

  // SCEN-1585
  test('商談条件の期間開始日が終了日より後のとき、エラーが発生する', () => {
    const dealCondition = {
      periodStartDate: new Date('2026-12-31'),
      periodEndDate: new Date('2026-12-01'),
      customerId: 'CUST001',
      productCategory: 'software',
      dealAmount: 500000,
    };

    expect(() => {
      generateRecommendation(dealCondition, mockAIEngine);
    }).toThrow(/期間開始日/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});