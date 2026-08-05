import { determineIssuePriorityForHeadReporting } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-814: 問題検出結果の重要度・根拠・対応必要性判定機能 - 重要度が高い問題は営業部長報告対象として判定される', () => {
    const detectedIssue = {
      issue_id: 'issue_20240215_001',
      severity_level: 'high',
      issue_type: 'sales_process_violation',
      description: '営業プロセス標準書に定義された初回接触ステップが未実行のまま提案段階に進行',
      evidence_data: {
        expected_step: 'initial_contact',
        actual_step: 'proposal',
        customer_id: 'cust_20240201_0042',
        salesperson_id: 'sales_emp_0018',
        violation_date: '2024-02-15T09:30:00Z',
      },
      reporting_criteria_match: ['sales_process_violation', 'contract_confirmation_missing'],
      detected_at: '2024-02-15T10:15:00Z',
      affected_customer_count: 3,
      potential_revenue_impact_jpy: 850000,
    };

    const result = determineIssuePriorityForHeadReporting(detectedIssue);

    expect(result.requires_head_report).toBe(true);
    expect(result.reporting_reason).toMatch(/営業部長報告/);
    expect(result.priority_score).toBeGreaterThanOrEqual(80);
    expect(result.action_required).toBe(true);
    expect(result.escalation_level).toBe('executive');
  });
});