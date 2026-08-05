import { calculateApprovalStatus } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-987
  test('成功要因・失敗要因の抽出と承認基準判定機能 - 抽出された要因数が承認基準の下限直下のとき承認不可と判定される', () => {
    const success_factors = [
      { factor_id: 'sf_001', factor_name: '顧客接触頻度が週2回以上', factor_type: 'success' },
      { factor_id: 'sf_002', factor_name: '提案内容が顧客ニーズに完全適合', factor_type: 'success' },
      { factor_id: 'sf_003', factor_name: '営業担当者の経験年数が3年以上', factor_type: 'success' },
      { factor_id: 'sf_004', factor_name: '初回接触から成約までが90日以内', factor_type: 'success' }
    ];

    const failure_factors = [];

    const approval_threshold = 5;
    const total_extracted_factors = success_factors.length + failure_factors.length;

    const result = calculateApprovalStatus({
      extracted_factors_count: total_extracted_factors,
      approval_threshold_minimum: approval_threshold,
      success_factors: success_factors,
      failure_factors: failure_factors
    });

    expect(result.is_approved).toBe(false);
    expect(result.approval_status).toBe('Not Approved');
    expect(result.rejection_reason).toMatch(/抽出要因数4件が承認基準下限5件に満たない/);
    expect(result.extracted_factors_count).toBe(4);
    expect(result.approval_threshold_minimum).toBe(5);
    expect(result.shortfall_count).toBe(1);
  });
});