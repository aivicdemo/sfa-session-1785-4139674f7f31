import { validateTrainingDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-033: 学習データ件数が未設定の場合に検証が正常に実行される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 78,
        isApplicable: true,
      }),
    };

    const validationRequest = {
      trainingDataCount: null,
      dataQualityThreshold: 80,
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    const result = await validateTrainingDataQuality(
      validationRequest,
      mockAIRecommendationEngine
    );

    expect(result.status).toBe('success');
    expect(result.warning).toBe(
      '学習データ件数が未設定のため、推奨パターンマスタの統計情報を使用して品質評価を実行しました'
    );
    expect(result.qualityScore).toBe(78);
    expect(typeof result.qualityScore).toBe('number');
    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
    expect(result.qualityScore).toBeLessThanOrEqual(100);
    expect(result.fallbackEvaluationUsed).toBe(true);
  });
});