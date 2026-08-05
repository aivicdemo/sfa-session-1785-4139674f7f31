import { describe, test, expect } from '@jest/globals';
import { analyzeTeamSalesQualityMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  // SCEN-899
  test('個別営業担当者の提案精度がNaN（非数値）のとき、エラーになる', () => {
    const invalid_team_metrics = {
      sales_representatives: [
        {
          representative_id: 'SR001',
          representative_name: '営業太郎',
          proposal_accuracy: NaN,
          deal_close_rate: 0.65,
          follow_up_success_rate: 0.72,
          analysis_period_start_date: '2024-01-01',
          analysis_period_end_date: '2024-03-31',
        },
      ],
      team_average_proposal_accuracy: 0.75,
      team_average_deal_close_rate: 0.68,
      team_average_follow_up_success_rate: 0.70,
      analysis_execution_date: '2024-04-15T10:00:00Z',
    };

    expect(() => analyzeTeamSalesQualityMetrics(invalid_team_metrics))
      .toThrow(/INVALID_PROPOSAL_ACCURACY/);
  });
});