import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-2-1-1';

// Mock AIRecommendationEngine
jest.mock('../../src/logic/AIRecommendationEngine', () => ({
  AIRecommendationEngine: {
    findSimilarPatterns: jest.fn(),
    evaluatePatternRelevance: jest.fn(),
    explainRecommendationReasoning: jest.fn(),
  },
}));

describe('AIエージェント推論精度スコア算出機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('SCEN-2381: 顧客対応パターン分析の結果が空である場合、フォールバック値が適用される', () => {
    // Arrange
    const { AIRecommendationEngine } = require('../../src/logic/AIRecommendationEngine');

    // findSimilarPatterns が空配列を返すよう設定
    AIRecommendationEngine.findSimilarPatterns.mockReturnValue([]);

    // evaluatePatternRelevance が null を返すよう設定
    AIRecommendationEngine.evaluatePatternRelevance.mockReturnValue(null);

    // 推奨根拠説明用の簡略版を返すよう設定
    AIRecommendationEngine.explainRecommendationReasoning.mockReturnValue(
      '推奨パターンマスタから統計的に上位の成功パターンに基づく簡略版説明'
    );

    const testDealData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      customerIndustry: 'IT',
      dealStage: 'proposal',
      proposalAmount: 500000,
      dealStatus: 'open',
    };

    // Act
    const result = evaluateInferenceAccuracy(testDealData, AIRecommendationEngine);

    // Assert
    // フォールバック値（0.5）が適用される
    expect(result.accuracyScore).toBe(0.5);

    // 推奨根拠説明が簡略版である
    expect(result.recommendationReasoning).toBe(
      '推奨パターンマスタから統計的に上位の成功パターンに基づく簡略版説明'
    );

    // 分析結果が空であることを示すフラグ
    expect(result.isFallbackApplied).toBe(true);

    // findSimilarPatterns が呼ばれたことを確認
    expect(AIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();

    // evaluatePatternRelevance が呼ばれたことを確認
    expect(AIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});