import { evaluateApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-988
  test('成功要因・失敗要因の抽出と承認基準判定機能 - 抽出された要因数が承認基準の上限ちょうどのとき承認可能と判定される', () => {
    const approval_criteria_limit = 10;
    const success_factors_count = 6;
    const failure_factors_count = 4;
    const total_factors_count = success_factors_count + failure_factors_count;

    const success_factors = Array.from(
      { length: success_factors_count },
      (_, index) => ({
        factor_id: `sf_${index + 1}`,
        factor_type: 'success',
        factor_description: `Success factor ${index + 1}`,
        occurrence_count: 5 + index,
      })
    );

    const failure_factors = Array.from(
      { length: failure_factors_count },
      (_, index) => ({
        factor_id: `ff_${index + 1}`,
        factor_type: 'failure',
        factor_description: `Failure factor ${index + 1}`,
        occurrence_count: 3 + index,
      })
    );

    const extracted_factors = [...success_factors, ...failure_factors];

    const approval_result = evaluateApprovalCriteria({
      extracted_factors: extracted_factors,
      approval_criteria_limit: approval_criteria_limit,
    });

    expect(approval_result.approval_status).toBe('承認可能');
    expect(approval_result.factor_count).toBe(10);
    expect(approval_result.approval_limit).toBe(10);
    expect(approval_result.judgement_detail).toEqual({
      factor_count: 10,
      approval_limit: 10,
      judgement: '承認可能',
    });
    expect(approval_result.success_factor_count).toBe(6);
    expect(approval_result.failure_factor_count).toBe(4);
    expect(approval_result.is_approvable).toBe(true);
  });
});