import { calculateProcessComplianceDeviationScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-281
  test('標準プロセス遵守度スコア計算 - 交渉ステップが標準プロセスから1日遅いとき、乖離度として負の値が計算される', () => {
    const standard_negotiation_scheduled_date = new Date('2024-01-15T00:00:00Z');
    const actual_negotiation_completed_date = new Date('2024-01-16T00:00:00Z');

    const deviation_score = calculateProcessComplianceDeviationScore(
      standard_negotiation_scheduled_date,
      actual_negotiation_completed_date
    );

    expect(deviation_score).toBe(-1);
  });
});