import { calculateSeverityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-589: [normal] 問題検出結果の重要度・対応必要性判定機能 - 重要度スコアが正確に数値化される
  test('should calculate severity score of 85 for sales fraud violation with 3 occurrences and 2.5M yen impact', () => {
    const detection_result = {
      violation_type: '売上計上不正',
      violation_count: 3,
      impact_amount_yen: 2500000,
      detection_datetime: '2024-01-15T10:30:00Z'
    };

    const severity_score = calculateSeverityScore(detection_result);

    expect(severity_score).toBe(85);
    expect(typeof severity_score).toBe('number');
    expect(Number.isInteger(severity_score)).toBe(true);
    expect(severity_score).toBeGreaterThanOrEqual(0);
    expect(severity_score).toBeLessThanOrEqual(100);
  });
});