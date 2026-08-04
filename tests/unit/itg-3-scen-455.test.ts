import { calculatePriorityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度スコアリング', () => {
  test('SCEN-455: エラー件数がちょうど閾値（10件）の場合、優先度スコアが正しく算出される', () => {
    // Arrange
    const errorThreshold = 10;
    const dealId = 'DEAL-20240815-001';
    const customerId = 'CUST-12345';
    const industryType = 'manufacturing';
    const dealStage = 'proposal';
    const errorCount = 10; // 閾値と同一

    const dealData = {
      dealId,
      customerId,
      industryType,
      dealStage,
      errorCount,
      dataQualityScore: 85.0,
      recommendationCount: 5,
      adoptionRate: 0.72,
    };

    const mockAiEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachId: 'APPR-001',
        confidence: 0.88,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { patternId: 'PAT-001', similarity: 0.92 },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: 'Based on similar patterns',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({ score: 0.85 }),
    };

    // Act
    const priorityScore = calculatePriorityScore(
      dealData,
      errorThreshold,
      mockAiEngine
    );

    // Assert
    // スコア計算式: (1 - (errorCount / 100)) * 100 = (1 - (10 / 100)) * 100 = 90.0
    // ただしデータ品質スコアの重み（0.85）と採用率の重み（0.15）を適用
    // 最終スコア = 90.0 * 0.85 + 72.0 * 0.15 = 76.5 + 10.8 = 87.3
    expect(priorityScore).toBe(87.3);
    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId,
        errorCount: 10,
      })
    );
  });
});