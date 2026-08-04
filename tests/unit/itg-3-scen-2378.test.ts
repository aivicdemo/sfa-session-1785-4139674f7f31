import { evaluateInferenceConfidence } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  test('SCEN-2378: 推論に用いた成功パターンが1件のみのとき、限定的な信頼度スコアが算出される', () => {
    // Arrange: スタブ化した推奨エンジンメソッドを準備
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: 'pattern-001',
        industry: 'IT',
        dealStage: 'proposal',
        budgetRange: '5000000',
        successRate: 0.78,
        caseCount: 12,
      },
    ]);

    const mockEvaluatePatternRelevance = jest.fn().mockReturnValue(0.75);

    const mockRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const newDealData = {
      customerIndustry: 'IT',
      dealStage: 'proposal',
      budgetScale: 5000000,
    };

    // Act: 推論精度スコア算出機能を実行
    const result = evaluateInferenceConfidence(newDealData, mockRecommendationEngine);

    // Assert: スコアが0.0～1.0の範囲内であることを確認
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1.0);

    // Assert: スコアが限定的な値（0.60～0.75の範囲）であることを確認
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.60);
    expect(result.confidenceScore).toBeLessThanOrEqual(0.75);

    // Assert: メタデータに参考パターン数が含まれていることを確認
    expect(result.metadata).toBeDefined();
    expect(result.metadata.referencePatternsCount).toBe(1);

    // Assert: 信頼度レベルが『限定的』と判定されていることを確認
    expect(result.metadata.confidenceLevel).toMatch(/限定的|低/);

    // Assert: スコアが0.60～0.75の範囲内（1件パターン基準）であることを確認
    expect(result.confidenceScore).toBe(0.60);

    // Assert: 推奨がスタブメソッドで正しく呼び出されたことを確認
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockEvaluatePatternRelevance).toHaveBeenCalled();
  });
});