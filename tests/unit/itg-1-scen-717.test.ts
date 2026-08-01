import { extractSuccessFailureFactorsWithApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-717
  test('成功・失敗要因の抽出と承認基準判定機能 - 営業部長の承認基準がnullのとき、デフォルト承認基準が適用される', () => {
    const division_manager_user = {
      user_id: 'user_001',
      user_name: '営業部長',
      role: 'division_manager',
      approval_criteria: null,
    };

    const system_default_approval_criteria = {
      min_sales_amount: 10000000,
      min_contract_rate: 0.6,
    };

    const business_events = [
      {
        event_id: 'event_001',
        sales_amount: 12000000,
        contract_rate: 0.65,
        outcome: 'success',
        success_factors: ['顧客ニーズの把握', '提案内容の質'],
        failure_factors: [],
      },
      {
        event_id: 'event_002',
        sales_amount: 8000000,
        contract_rate: 0.55,
        outcome: 'failure',
        success_factors: [],
        failure_factors: ['提案タイミングの遅延', '顧客との関係構築不足'],
      },
      {
        event_id: 'event_003',
        sales_amount: 15000000,
        contract_rate: 0.75,
        outcome: 'success',
        success_factors: ['継続的なフォローアップ', '提案の複数パターン提示'],
        failure_factors: [],
      },
    ];

    const result = extractSuccessFailureFactorsWithApprovalCriteria(
      division_manager_user,
      system_default_approval_criteria,
      business_events
    );

    expect(result.applied_criteria).toEqual({
      min_sales_amount: 10000000,
      min_contract_rate: 0.6,
      source: 'system_default',
    });

    expect(result.criteria_source).toBe('system_default');

    expect(result.extracted_success_factors).toContain('顧客ニーズの把握');
    expect(result.extracted_success_factors).toContain('提案内容の質');
    expect(result.extracted_success_factors).toContain('継続的なフォローアップ');
    expect(result.extracted_success_factors).toContain('提案の複数パターン提示');

    expect(result.extracted_failure_factors).toContain('提案タイミングの遅延');
    expect(result.extracted_failure_factors).toContain('顧客との関係構築不足');

    expect(result.approved_events.length).toBe(2);
    expect(result.approved_events[0].event_id).toBe('event_001');
    expect(result.approved_events[1].event_id).toBe('event_003');

    expect(result.rejected_events.length).toBe(1);
    expect(result.rejected_events[0].event_id).toBe('event_002');

    expect(result.approval_criteria_application_timestamp).toBeDefined();
    expect(typeof result.approval_criteria_application_timestamp).toBe('string');
  });
});