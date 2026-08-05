import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateSuccessFailureFactorsApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-978
  test('成功要因・失敗要因の抽出と承認判定機能 - 営業部長の承認基準定義がnullのとき、適合性判定ができずエラーになる', () => {
    const input_approval_criteria = null;
    const input_success_factors = [
      { factor_id: 'SF001', factor_name: '初回接触から3日以内に提案実施', factor_type: 'success' },
      { factor_id: 'SF002', factor_name: '顧客ニーズ確認後、即座に提案資料を提示', factor_type: 'success' },
    ];
    const input_failure_factors = [
      { factor_id: 'FF001', factor_name: 'フォローアップ期間が14日以上', factor_type: 'failure' },
      { factor_id: 'FF002', factor_name: '提案内容が顧客ニーズと乖離', factor_type: 'failure' },
    ];

    expect(() =>
      validateSuccessFailureFactorsApprovalCriteria({
        approval_criteria: input_approval_criteria,
        success_factors: input_success_factors,
        failure_factors: input_failure_factors,
      })
    ).toThrow(/承認基準/);
  });
});