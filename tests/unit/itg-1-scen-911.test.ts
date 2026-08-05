import { analyzeTeamSalesQualityMonthly } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質月次分析機能 - フォローアップ成功率乖離度による優先度判定', () => {
  // SCEN-911
  test('フォローアップ成功率の乖離度が改善優先度の閾値直下のときに優先度等級が異なる', () => {
    const followup_success_rate_deviation_below_threshold = 4.9;
    const followup_success_rate_deviation_at_threshold = 5.0;
    const priority_threshold = 5.0;

    const team_sales_data = {
      month: '2024-01',
      sales_staff_count: 5,
      average_proposal_success_rate: 45.2,
      average_followup_success_rate: 52.8,
      proposal_success_rate_deviation: 8.3,
      followup_success_rate_deviation_low: followup_success_rate_deviation_below_threshold,
      followup_success_rate_deviation_high: followup_success_rate_deviation_at_threshold,
      improved_staffs: 2,
      staff_performance_data: [
        {
          staff_id: 'staff_001',
          proposal_count: 12,
          proposal_success_count: 5,
          followup_count: 10,
          followup_success_count: 6,
          followup_success_rate_deviation: followup_success_rate_deviation_below_threshold,
        },
        {
          staff_id: 'staff_002',
          proposal_count: 15,
          proposal_success_count: 7,
          followup_count: 12,
          followup_success_count: 8,
          followup_success_rate_deviation: followup_success_rate_deviation_at_threshold,
        },
        {
          staff_id: 'staff_003',
          proposal_count: 10,
          proposal_success_count: 4,
          followup_count: 8,
          followup_success_count: 5,
          followup_success_rate_deviation: 3.2,
        },
        {
          staff_id: 'staff_004',
          proposal_count: 14,
          proposal_success_count: 6,
          followup_count: 11,
          followup_success_count: 7,
          followup_success_rate_deviation: 6.5,
        },
        {
          staff_id: 'staff_005',
          proposal_count: 13,
          proposal_success_count: 5,
          followup_count: 9,
          followup_success_count: 5,
          followup_success_rate_deviation: 2.1,
        },
      ],
    };

    const analysis_result = analyzeTeamSalesQualityMonthly(team_sales_data);

    const staff_001_priority = analysis_result.improvement_priorities.find(
      (p) => p.staff_id === 'staff_001'
    );
    const staff_002_priority = analysis_result.improvement_priorities.find(
      (p) => p.staff_id === 'staff_002'
    );

    expect(staff_001_priority).toBeDefined();
    expect(staff_002_priority).toBeDefined();

    expect(staff_001_priority!.priority_grade).toBe('low');
    expect(staff_002_priority!.priority_grade).toBe('medium');

    expect(staff_001_priority!.followup_success_rate_deviation).toBe(
      followup_success_rate_deviation_below_threshold
    );
    expect(staff_002_priority!.followup_success_rate_deviation).toBe(
      followup_success_rate_deviation_at_threshold
    );

    expect(staff_001_priority!.priority_grade).not.toEqual(
      staff_002_priority!.priority_grade
    );
  });
});