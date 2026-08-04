import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  test('SCEN-788: マッチング類似度スコアが入力されたとき、信頼度に反映される', () => {
    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pat-001',
          matchingScore: 0.85,
          successRate: 0.90,
          sampleSize: 50,
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件データ
    const newCaseData = {
      customerIndustry: '製造業',
      dealStage: '提案中',
      budgetScale: '500万円以上',
      customerId: 'cust-001',
      dealId: 'deal-001',
    };

    // 推奨信頼度スコア算出ロジックを実行
    const result = calculateRecommendationConfidenceScore(
      newCaseData,
      mockAIEngine
    );

    // 推奨信頼度スコアが0.85以上0.95以下の範囲に収まっていることを検証
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.85);
    expect(result.confidenceScore).toBeLessThanOrEqual(0.95);

    // 信頼度スコアの計算に使用された要素にマッチング類似度スコアが含まれていることを確認
    expect(result.scoringComponents).toContainEqual(
      expect.objectContaining({
        componentName: 'matchingScore',
        value: 0.85,
      })
    );

    // マッチング類似度スコアがスコア計算に正しく反映されていることの二重確認
    expect(result.scoringComponents).toHaveLength(
      expect.any(Number)
    );
    expect(
      result.scoringComponents.some(
        (component: { componentName: string; value: number }) =>
          component.componentName === 'matchingScore' && component.value === 0.85
      )
    ).toBe(true);

    // AIエンジンのfindSimilarPatternsメソッドが呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customerIndustry: '製造業',
        dealStage: '提案中',
        budgetScale: '500万円以上',
      })
    );
  });
});