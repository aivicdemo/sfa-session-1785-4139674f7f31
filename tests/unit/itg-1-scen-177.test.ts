import { determineConductDeviationJudgment } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-177
  test('乖離度が許容範囲の上限ちょうどの場合、改善指導対象の境界線上として判定される', () => {
    const sales_person_id = 'SP001';
    const sales_person_name = '営業太郎';
    const deviation_score = 100.0;
    const tolerance_upper_limit = 100.0;
    const deviation_reason = '乖離度が許容範囲の上限に該当';

    const input_data = {
      sales_person_id: sales_person_id,
      sales_person_name: sales_person_name,
      deviation_score: deviation_score,
      tolerance_upper_limit: tolerance_upper_limit,
    };

    const result = determineConductDeviationJudgment(input_data);

    expect(result.judgment_result).toBe('境界線上（改善指導対象）');
    expect(result.improvement_instruction_flag).toBe(true);
    expect(result.deviation_score).toBe(100.0);
    expect(result.judgment_reason).toBe(deviation_reason);
  });
});