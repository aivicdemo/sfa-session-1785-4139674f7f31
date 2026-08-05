import { describe, test, expect } from '@jest/globals';
import { analyzeTeamQualityTrends } from '../../src/logic/it-1-br-2-1-1';

describe('Team Sales Quality Monthly Analysis - Boundary Value Test', () => {
  // SCEN-910
  test('should judge improvement priority as HIGH when proposal accuracy deviation exactly matches threshold', () => {
    const target_month = '2024-01';
    const threshold_deviation_percent = 5.0;
    const team_quality_data = {
      month: target_month,
      sales_reps: [
        {
          rep_id: 'REP001',
          rep_name: 'Tanaka Hiroshi',
          proposal_success_rate: 65.0,
          team_avg_proposal_success_rate: 70.0,
          proposal_accuracy_deviation: 5.0,
          followup_completion_rate: 75.0,
          team_avg_followup_completion_rate: 80.0,
          followup_deviation: 5.0,
          contract_rate: 45.0,
          team_avg_contract_rate: 50.0,
          contract_deviation: 5.0,
          activity_count: 25,
          team_avg_activity_count: 30,
        },
      ],
      priority_threshold_deviation_percent: threshold_deviation_percent,
      priority_levels: {
        high: { min_deviation: threshold_deviation_percent, max_deviation: 100 },
        medium: { min_deviation: 2.5, max_deviation: threshold_deviation_percent - 0.1 },
        low: { min_deviation: 0, max_deviation: 2.4 },
      },
    };

    const analysis_result = analyzeTeamQualityTrends(team_quality_data);

    expect(analysis_result).toEqual({
      month: '2024-01',
      analysis_results: [
        {
          rep_id: 'REP001',
          rep_name: 'Tanaka Hiroshi',
          proposal_accuracy_deviation: 5.0,
          improvement_priority: 'HIGH',
          improvement_reasons: [
            'Proposal accuracy deviation 5.0% meets high-priority threshold',
            'All quality metrics show 5.0% deviation from team average',
          ],
          recommended_actions: [
            'Review proposal content and customer interaction patterns',
            'Prioritize coaching on successful proposal approaches',
            'Implement follow-up activity plan',
          ],
        },
      ],
      team_summary: {
        total_reps_analyzed: 1,
        high_priority_count: 1,
        medium_priority_count: 0,
        low_priority_count: 0,
        analysis_timestamp: expect.any(String),
      },
    });

    expect(analysis_result.analysis_results[0].improvement_priority).toBe('HIGH');
    expect(analysis_result.team_summary.high_priority_count).toBe(1);
  });
});