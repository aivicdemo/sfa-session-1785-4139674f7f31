import { generateReportMetadata } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - レポートメタデータ生成', () => {
  // SCEN-471
  test('[normal] レポート生成対象期間が正しく記録される', () => {
    // Arrange: システム日時を固定
    const fixedNow = new Date('2026-08-15T10:30:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);

    // AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        approach: 'test-approach',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: レポートメタデータ生成関数を呼び出し
    const periodStart = '2026-07-01';
    const periodEnd = '2026-08-15';

    const metadata = generateReportMetadata(
      {
        periodStart,
        periodEnd,
      },
      mockAIEngine
    );

    // Assert: メタデータプロパティの検証
    expect(metadata.periodStart).toBe('2026-07-01T00:00:00Z');
    expect(metadata.periodEnd).toBe('2026-08-15T23:59:59Z');
    expect(metadata.generationTimestamp).toBe('2026-08-15T10:30:00Z');

    // Cleanup
    jest.useRealTimers();
  });
});