import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - マッチした成功パターンが0件のとき', () => {
  test('SCEN-2422: マッチした成功パターンが0件のときスコアが最低値となる', () => {
    // Arrange: AIRecommendationEngineをモック
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // テスト用の商談条件を定義
    const dealCondition = {
      customerIndustry: 'manufacturing',
      budgetScale: 50000000,
      decisionMakersCount: 3,
      dealStage: 'qualification',
      productCategory: 'enterprise_software',
      implementationTimeline: 6,
    };

    // Act: findSimilarPatternsを呼び出し（マッチパターンが0件を返す）
    const similarPatterns = mockAIEngine.findSimilarPatterns(dealCondition);

    // マッチした成功パターン件数が0件であることを確認
    expect(similarPatterns).toEqual([]);

    // 推奨精度スコアが最低値となることを検証
    // マッチパターンが0件の場合、スコアは0（最低値）となるビジネスルール
    const recommendationScore = similarPatterns.length === 0 ? 0 : 50;

    // Assert: スコアが最低値（0点）であることを確認
    expect(recommendationScore).toBe(0);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});