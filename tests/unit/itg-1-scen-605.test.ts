import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-605
  test('営業担当者が提案を0件入力した場合、レポートが生成されて分析結果が0件として記録される', () => {
    const input_sales_rep_id = 'SR_001';
    const input_period_start = new Date('2024-01-01T00:00:00Z');
    const input_period_end = new Date('2024-01-31T23:59:59Z');
    const input_proposal_count = 0;
    const input_generated_at = new Date('2024-01-31T15:30:00Z');

    const result = generateSalesRepBehaviorAnalysisReport({
      sales_rep_id: input_sales_rep_id,
      period_start: input_period_start,
      period_end: input_period_end,
      proposal_count: input_proposal_count,
      generated_at: input_generated_at,
    });

    expect(result).toEqual({
      report_id: expect.any(String),
      sales_rep_id: input_sales_rep_id,
      period_start: input_period_start,
      period_end: input_period_end,
      analysis_result: {
        proposal_count: 0,
      },
      generated_at: input_generated_at,
      recorded_in_history: true,
      history_record_count: 1,
    });

    expect(result.report_id).toBeDefined();
    expect(result.report_id.length).toBeGreaterThan(0);
    expect(result.recorded_in_history).toBe(true);
    expect(result.history_record_count).toBe(1);
    expect(result.analysis_result.proposal_count).toBe(0);
  });
});