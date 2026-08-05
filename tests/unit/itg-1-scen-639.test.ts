import { analyzeAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-639
  test('顧客対応パターンと成功パターンの合致度が閾値直下（79.9%）のとき、非合致として判定される', () => {
    const customer_pattern = {
      id: 'pattern_001',
      name: '初回訪問→提案→フォローアップ',
      steps: ['initial_visit', 'proposal', 'followup'],
    };

    const success_pattern = {
      id: 'success_001',
      name: '初回訪問→提案→フォローアップ',
      steps: ['initial_visit', 'proposal', 'followup'],
      threshold: 80,
    };

    const salesperson_activity = {
      salesperson_id: 'A001',
      salesperson_name: '営業担当者A',
      customer_id: 'C1',
      customer_name: '顧客C1',
      action_log: ['initial_visit', 'proposal', 'followup'],
      actions_timestamp: [
        new Date('2024-01-10T09:00:00Z'),
        new Date('2024-01-15T14:00:00Z'),
        new Date('2024-01-20T11:00:00Z'),
      ],
    };

    const pattern_match_result = {
      customer_id: 'C1',
      salesperson_id: 'A001',
      match_degree: 79.9,
      threshold: 80,
      is_matched: false,
    };

    const report = analyzeAndGenerateReport(
      [salesperson_activity],
      [customer_pattern],
      [success_pattern],
      pattern_match_result,
      80
    );

    expect(report).toBeDefined();
    expect(report.analysis_results).toBeDefined();
    expect(report.analysis_results.length).toBeGreaterThan(0);

    const result_for_customer_c1 = report.analysis_results.find(
      (r: any) =>
        r.customer_id === 'C1' && r.salesperson_id === 'A001'
    );

    expect(result_for_customer_c1).toBeDefined();
    expect(result_for_customer_c1.match_degree).toBe(79.9);
    expect(result_for_customer_c1.threshold).toBe(80);
    expect(result_for_customer_c1.is_matched).toBe(false);
    expect(result_for_customer_c1.judgment).toBe('非合致');
    expect(report.unmatched_results).toContainEqual(
      expect.objectContaining({
        customer_id: 'C1',
        salesperson_id: 'A001',
        match_degree: 79.9,
      })
    );
    expect(report.matched_results).not.toContainEqual(
      expect.objectContaining({
        customer_id: 'C1',
        salesperson_id: 'A001',
      })
    );
  });
});