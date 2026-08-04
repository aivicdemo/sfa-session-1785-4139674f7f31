import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1779
  test('単一の成功パターンが推奨根拠として表示される', () => {
    const mockSuccessPattern = {
      patternId: 'SUCCESS_001',
      description: '顧客規模50-100名の中堅企業への段階的提案アプローチ',
      successRate: 0.87,
      similarCaseCount: 12,
    };

    const mockReasoningText =
      '過去12件の類似案件で87%の成約率を達成した提案パターンです。同規模顧客への段階的アプローチが効果的であることが統計的に実証されています。';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        patterns: [mockSuccessPattern],
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(mockReasoningText),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerCondition = {
      customerId: 'CUST_001',
      industry: 'IT',
      employeeCount: 75,
      annualRevenue: 5000000,
    };

    const dealCondition = {
      dealId: 'DEAL_001',
      productCategory: 'Enterprise Solution',
      proposedValue: 2000000,
    };

    const result = visualizeRecommendationRationale(
      mockSuccessPattern,
      mockReasoningText,
      {
        aiEngine: mockAIRecommendationEngine,
        customerData: customerCondition,
        dealData: dealCondition,
      }
    );

    expect(result.displayText).toBe(mockReasoningText);
    expect(result.patternId).toBe('SUCCESS_001');
    expect(result.displayText).toContain('過去12件の類似案件で87%の成約率');
    expect(result.displayText).toContain('段階的アプローチ');
    expect(result.patternCount).toBe(1);
    expect(result.successRate).toBe(0.87);
    expect(result.similarCaseCount).toBe(12);
  });
});