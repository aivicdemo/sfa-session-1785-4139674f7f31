import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-391: 推論精度検証機能 - 推奨内容と実際の結果が一致したレコードが1件のとき、その件数をカウント対象に含める', () => {
    // Arrange: 推奨レコードデータの準備
    const recommendationRecords = [
      {
        recommendationId: 'REC-001',
        proposalApproach: 'Value-focused approach',
        actualResult: 'Value-focused approach',
        match: true
      },
      {
        recommendationId: 'REC-002',
        proposalApproach: 'Competitor differentiation',
        actualResult: 'Price-based negotiation',
        match: false
      },
      {
        recommendationId: 'REC-003',
        proposalApproach: 'Long-term partnership',
        actualResult: 'One-time transaction',
        match: false
      }
    ];

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Act: 精度検証ロジックを実行
    const result = evaluateRecommendationAccuracy(
      recommendationRecords,
      mockAIEngine
    );

    // Assert: 期待結果の検証
    expect(result.matchedRecommendationCount).toBe(1);
    expect(result.matchedRecordIds).toEqual(['REC-001']);
    expect(result.accuracyScore).toBeCloseTo(0.333, 2);
  });
});