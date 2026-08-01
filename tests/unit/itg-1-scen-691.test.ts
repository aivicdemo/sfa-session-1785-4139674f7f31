import { evaluateSuccessFactorApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-691
  test('成功・失敗要因の抽出と承認基準判定機能 - ワークショップから抽出された成功要因が営業部長の承認基準を満たすとき、承認可能な状態として評価される', () => {
    const extractedSuccessFactors = [
      {
        factor_id: 'SF001',
        factor_name: '顧客ニーズの正確な把握',
        score: 85,
        is_required: true,
      },
      {
        factor_id: 'SF002',
        factor_name: '提案資料の質',
        score: 75,
        is_required: true,
      },
      {
        factor_id: 'SF003',
        factor_name: '営業担当者のフォローアップ頻度',
        score: 80,
        is_required: true,
      },
    ];

    const approval_criteria = {
      min_factor_score: 70,
      min_required_factors_count: 3,
      total_factors_required: 3,
    };

    const result = evaluateSuccessFactorApprovalCriteria(
      extractedSuccessFactors,
      approval_criteria
    );

    expect(result.status).toBe('承認可能');
    expect(result.is_approved).toBe(true);
    expect(result.all_factors_meet_criteria).toBe(true);
    expect(result.required_factors_count).toBe(3);
    expect(result.factors_above_min_score).toBe(3);
  });
});