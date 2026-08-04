import { calculateAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-375
  test('推奨精度検証機能 - 推奨履歴テーブルが空のとき、精度計測がエラーになる', () => {
    const emptyRecommendationHistory: any[] = [];
    
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Standard Approach',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('Recommendation rationale'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.8),
    };

    expect(() => {
      calculateAccuracy(emptyRecommendationHistory, mockAIRecommendationEngine);
    }).toThrow(/推奨履歴|計測対象データ/);
  });
});