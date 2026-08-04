import { determineSalesGuidancePolicy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-541: データ品質スコアが0のとき指導方針が決定される', () => {
    // Arrange: AIRecommendationEngine のスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0)
    };

    // 商談データの準備: データ品質スコア = 0
    const dealData = {
      customerIndustry: 'manufacturing',
      dealAmount: 5000000,
      currentStage: 'proposal',
      dataQualityScore: 0
    };

    // Act: determineSalesGuidancePolicy を実行
    const result = determineSalesGuidancePolicy(dealData, mockAIEngine);

    // Assert: 期待結果を検証
    expect(result.decisionBasis).toBe('SCORE_BASED_CRITERIA');
    expect(result.guidanceApproach).toBeDefined();
    expect(result.applicablePatterns).toBeDefined();
    expect(result.applicablePatterns.length).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(0.5);
    expect(result.reasoningExplanation).toMatch(/スコア品質が低いため簡略版の推奨パターンを適用/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});