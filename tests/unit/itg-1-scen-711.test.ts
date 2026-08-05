import { analyzeProposalAndCustomerResponsePattern } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  // SCEN-711: [edge] 提案内容と顧客対応パターンの標準プロセス比較 - 提案実行から顧客対応記録入力までの期間が閾値を超過する場合に異常パターン検出される
  test('提案実行後の顧客対応記録入力が閾値を超過したとき、異常パターンが検出される', () => {
    const proposal_executed_at = new Date('2024-01-01T10:00:00Z');
    const customer_response_recorded_at = new Date('2024-01-05T11:00:00Z');
    const response_delay_threshold_days = 3;

    const result = analyzeProposalAndCustomerResponsePattern({
      proposal_executed_at,
      customer_response_recorded_at,
      response_delay_threshold_days,
    });

    expect(result.anomaly_detected).toBe(true);
    expect(result.anomaly_pattern_type).toBe('提案後対応遅延');
    expect(result.excess_hours).toBe(25);
    expect(result.severity_level).toBe('HIGH');
  });
});