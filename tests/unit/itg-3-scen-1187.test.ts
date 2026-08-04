import { validateProposal } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1187
  test('[normal] 提案妥当性判定機能 - 顧客ニーズが1件の場合に妥当性判定が実行される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 75,
        matchedPatterns: ['pattern_001'],
      }),
    };

    const testInput = {
      customerId: 'CUST_12345',
      dealConditions: {
        industry: 'technology',
        companySize: 'enterprise',
        budget: 5000000,
      },
      customerNeeds: [
        {
          needId: 'NEED_001',
          title: 'システム統合',
          description: 'レガシーシステムの統合化',
          priority: 'high',
        },
      ],
    };

    const result = validateProposal(testInput, mockAIEngine);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(result.isValidationExecuted).toBe(true);
    expect(result.needsCount).toBe(1);
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(result.relevanceScore).toBeLessThanOrEqual(100);
    expect(result.relevanceScore).toBe(75);
  });
});