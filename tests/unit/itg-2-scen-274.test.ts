import { calculateProcessComplianceDeviationScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  // SCEN-274
  test('初回接触ステップが標準プロセスから1日早いとき、乖離度として正の値が計算される', () => {
    const standard_initial_contact_date = new Date('2024-01-15T00:00:00Z');
    const actual_initial_contact_date = new Date('2024-01-14T00:00:00Z');

    const deviation_score = calculateProcessComplianceDeviationScore({
      standard_step_date: standard_initial_contact_date,
      actual_step_date: actual_initial_contact_date,
    });

    expect(deviation_score).toBe(1);
  });
});