import { calculateRecommendationTrustworthiness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2457
  test('推奨精度スコア算出機能 - 同一の入力で信頼度スコア算出を2回実行したとき同じスコア値が返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.8523),
    };

    const testInput = {
      customerId: 'CUST-20240115-001',
      customerIndustry: '製造業',
      customerScale: 'large',
      dealStage: 'proposal',
      dealAmount: 5000000,
      dealConditions: {
        budgetLimit: 5500000,
        decisionTimeline: '2024-03-31',
        requiredFeatures: ['品質管理', 'コスト削減'],
      },
    };

    const firstScore = calculateRecommendationTrustworthiness(
      testInput,
      mockAIRecommendationEngine
    );

    const secondScore = calculateRecommendationTrustworthiness(
      testInput,
      mockAIRecommendationEngine
    );

    expect(firstScore).toBe(0.8523);
    expect(secondScore).toBe(0.8523);
    expect(firstScore).toEqual(secondScore);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(2);
  });
});