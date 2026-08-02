import { detectDeviationPattern } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 乖離パターン検出', () => {
  // SCEN-303
  test('全ステップが標準プロセスより早いとき、全体加速パターンとして検出される', () => {
    const standard_process_steps = [
      { step_id: 'A', required_days: 2 },
      { step_id: 'B', required_days: 3 },
      { step_id: 'C', required_days: 2 },
    ];
    const standard_total_days = 7;

    const actual_steps = [
      { step_id: 'A', actual_days: 1 },
      { step_id: 'B', actual_days: 2 },
      { step_id: 'C', actual_days: 1 },
    ];
    const actual_total_days = 4;

    const result = detectDeviationPattern({
      standard_steps: standard_process_steps,
      standard_total_days: standard_total_days,
      actual_steps: actual_steps,
      actual_total_days: actual_total_days,
    });

    expect(result.pattern_type).toBe('全体加速');
    expect(result.deviation_reason).toBe('全ステップが標準プロセスより早い');
    expect(result.deviation_rate).toBe(-42.86);
  });
});