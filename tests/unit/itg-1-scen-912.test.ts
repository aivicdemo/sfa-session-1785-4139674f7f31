import { describe, test, expect } from '@jest/globals';
import { analyzeTeamSalesQualityMonthly } from '../../src/logic/it-1-br-2-1-1';

describe('IT-1-BR-2-1-1: チーム営業品質月次分析機能', () => {
  // SCEN-912: [edge] フォローアップ成功率の乖離度が改善優先度の閾値直上のときに優先度が異なる等級に判定される
  test('should assign priority level "medium" when follow-up success rate deviation equals threshold 5.0%', () => {
    const analysis_period_start = new Date('2024-01-01');
    const analysis_period_end = new Date('2024-01-31');
    
    const team_quality_metrics = {
      team_id: 'TEAM-001',
      proposal_success_rate: 0.65,
      proposal_success_rate_deviation: 0.08,
      follow_up_success_rate: 0.72,
      follow_up_success_rate_deviation: 0.05,
      contract_rate: 0.58,
      contract_rate_deviation: 0.12,
      analysis_period_start,
      analysis_period_end,
      data_quality_score: 0.96,
      sales_rep_count: 8,
      total_opportunities: 156,
    };

    const result = analyzeTeamSalesQualityMonthly(team_quality_metrics);

    expect(result.priority_level).toBe('medium');
    expect(result.follow_up_success_rate_deviation).toBe(0.05);
    expect(result.priority_level).not.toBe('high');
  });
});