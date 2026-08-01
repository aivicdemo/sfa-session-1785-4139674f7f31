import { extractAndValidateSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-708: 成功・失敗要因の抽出と承認基準判定機能 - 要因の信頼度スコアが承認基準の最小値を超過するとき、承認可能と判定される', () => {
    const factor_data = {
      factor_id: 'factor_001',
      factor_type: 'success',
      factor_description: '初回接触から提案までの期間が14日以内',
      confidence_score: 75.1,
      occurrence_count: 45,
      total_cases: 60,
    };

    const approval_criteria = {
      criteria_id: 'criteria_001',
      minimum_confidence_threshold: 75.0,
      minimum_occurrence_count: 30,
      approval_required: true,
    };

    const result = extractAndValidateSuccessFailureFactors(
      factor_data,
      approval_criteria
    );

    expect(result.approval_status).toBe('APPROVED');
    expect(result.is_approvable).toBe(true);
    expect(result.confidence_score).toBe(75.1);
    expect(result.meets_threshold).toBe(true);
  });
});