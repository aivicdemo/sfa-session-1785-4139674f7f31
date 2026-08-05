import { validateSuccessFactorsAgainstApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-962: 成功要因・失敗要因の抽出と承認基準検証 - ワークショップで抽出された複数の成功要因が営業部長の承認基準を満たす', () => {
    const success_factors = [
      {
        factor_id: 'sf_001',
        factor_name: '顧客との信頼関係構築',
        importance_score: 45,
        feasibility_score: 35,
      },
      {
        factor_id: 'sf_002',
        factor_name: '提案資料の質',
        importance_score: 50,
        feasibility_score: 35,
      },
      {
        factor_id: 'sf_003',
        factor_name: '営業担当者の対応速度',
        importance_score: 40,
        feasibility_score: 35,
      },
    ];

    const approval_criteria_threshold = 70;

    const result = validateSuccessFactorsAgainstApprovalCriteria(
      success_factors,
      approval_criteria_threshold
    );

    expect(result.total_factors_submitted).toBe(3);
    expect(result.approved_factors_count).toBe(3);
    expect(result.approval_status).toBe('approved');

    expect(result.validation_details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          factor_id: 'sf_001',
          factor_name: '顧客との信頼関係構築',
          criteria_score: 80,
          meets_criteria: true,
        }),
        expect.objectContaining({
          factor_id: 'sf_002',
          factor_name: '提案資料の質',
          criteria_score: 85,
          meets_criteria: true,
        }),
        expect.objectContaining({
          factor_id: 'sf_003',
          factor_name: '営業担当者の対応速度',
          criteria_score: 75,
          meets_criteria: true,
        }),
      ])
    );

    expect(result.approved_factor_ids).toEqual(
      expect.arrayContaining(['sf_001', 'sf_002', 'sf_003'])
    );
    expect(result.approved_factor_ids.length).toBe(3);
  });
});