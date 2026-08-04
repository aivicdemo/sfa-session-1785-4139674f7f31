import { verifyRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-338
  test('推奨精度検証機能 - 検証期間の開始日と終了日が同日の場合、その日付の推奨のみが対象になる', () => {
    const verificationStartDate = new Date('2026-08-15T00:00:00Z');
    const verificationEndDate = new Date('2026-08-15T23:59:59Z');

    const testRecommendations = [
      {
        recommendationId: 'REC-001',
        generatedAt: new Date('2026-08-14T10:00:00Z'),
        confidenceScore: 85,
      },
      {
        recommendationId: 'REC-002',
        generatedAt: new Date('2026-08-15T14:30:00Z'),
        confidenceScore: 92,
      },
      {
        recommendationId: 'REC-003',
        generatedAt: new Date('2026-08-16T09:00:00Z'),
        confidenceScore: 78,
      },
    ];

    const result = verifyRecommendationAccuracy({
      startDate: verificationStartDate,
      endDate: verificationEndDate,
      recommendations: testRecommendations,
    });

    expect(result.targetCount).toBe(1);
    expect(result.targetRecommendations).toHaveLength(1);
    expect(result.targetRecommendations[0]).toEqual({
      recommendationId: 'REC-002',
      generatedAt: new Date('2026-08-15T14:30:00Z'),
      confidenceScore: 92,
    });
  });
});