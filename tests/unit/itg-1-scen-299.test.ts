import { calculateMonthlyComplianceAndIdentifyCoachingTargets } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-299: [edge] 行動パターン分析と改善指導優先順位判定機能 - 月次モニタリング期間が月末日で集計完了した場合、改善指導対象者の判定に含める
  test('月末日で集計が完了した月次モニタリング期間に改善指導基準を満たすユーザーが対象者リストに含まれ、判定対象期間に月末日が記録されること', () => {
    const monitoring_start_date = new Date('2024-01-01T00:00:00Z');
    const monitoring_end_date = new Date('2024-01-31T23:59:59Z');

    const sales_activity_logs = [
      {
        sales_rep_id: 'SR001',
        activity_date: new Date('2024-01-15T10:00:00Z'),
        activity_type: 'proposal_creation',
        proposal_document_created: true,
        customer_id: 'C001',
      },
      {
        sales_rep_id: 'SR001',
        activity_date: new Date('2024-01-20T14:30:00Z'),
        activity_type: 'customer_contact',
        proposal_document_created: false,
        customer_id: 'C002',
      },
      {
        sales_rep_id: 'SR001',
        activity_date: new Date('2024-01-25T09:00:00Z'),
        activity_type: 'customer_contact',
        proposal_document_created: false,
        customer_id: 'C003',
      },
      {
        sales_rep_id: 'SR001',
        activity_date: new Date('2024-01-30T11:00:00Z'),
        activity_type: 'customer_contact',
        proposal_document_created: false,
        customer_id: 'C004',
      },
    ];

    const coaching_standard_thresholds = {
      min_proposal_document_creation_rate: 0.7,
    };

    const result = calculateMonthlyComplianceAndIdentifyCoachingTargets({
      monitoring_start_date,
      monitoring_end_date,
      sales_activity_logs,
      coaching_standard_thresholds,
    });

    expect(result.coaching_target_candidates).toHaveLength(1);
    expect(result.coaching_target_candidates[0].sales_rep_id).toBe('SR001');
    expect(result.coaching_target_candidates[0].proposal_document_creation_rate).toBe(0.25);
    expect(result.coaching_target_candidates[0].evaluation_period_end_date).toEqual(
      new Date('2024-01-31T23:59:59Z')
    );
    expect(result.aggregation_period_start).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(result.aggregation_period_end).toEqual(new Date('2024-01-31T23:59:59Z'));
  });
});