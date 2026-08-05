import { calculateCoachingPriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-262: [normal] 行動パターン分析と改善指導優先順位判定機能 - 標準プロセス乖離度が小さく成約実績が高い営業担当者が、改善指導対象から除外される
  test('should exclude sales rep with low process deviation and high win rate from coaching priority list', () => {
    // Arrange: テストデータ - 営業担当者Aの当月実績
    const salesRepAId = 'SR-A001';
    const processDeviationRate = 15; // 基準値30%以下、小さい乖離度
    const winRatePercentage = 95; // 基準値80%以上、高い成約実績
    const evaluationPeriod = '2024-01';

    // Act: 改善指導優先順位判定ロジックを実行
    const coachingPriorityResult = calculateCoachingPriority({
      salesRepId: salesRepAId,
      processDeviationPercentage: processDeviationRate,
      winRatePercentage: winRatePercentage,
      evaluationMonth: evaluationPeriod,
    });

    // Assert: 営業担当者Aが改善指導対象から除外される
    expect(coachingPriorityResult.requiresCoaching).toBe(false);
    expect(coachingPriorityResult.coachingPriorityLevel).toBe('excluded');
    expect(coachingPriorityResult.salesRepId).toBe(salesRepAId);
    expect(coachingPriorityResult.isTargetForImprovement).toBe(false);
  });
});