import { calculateImportanceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-566: [edge] 重要度スコアの計算機能 - 重要度スコアの計算で端数が発生する場合、正しく丸められる
  test('should round importance score to 2 decimal places when fractional values are input', () => {
    const customer_scale_score = 3.5;
    const deal_amount_score = 2.7;
    const deal_period_score = 1.9;

    const result = calculateImportanceScore(
      customer_scale_score,
      deal_amount_score,
      deal_period_score
    );

    const expected = 2.7;
    expect(result).toBe(expected);
    expect(typeof result).toBe('number');
    expect(result.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});