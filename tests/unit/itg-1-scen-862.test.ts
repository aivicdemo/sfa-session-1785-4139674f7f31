import { describe, test, expect } from '@jest/globals';
import { analyzeMonthlyProposalQuality } from '../../src/logic/it-1-br-2-1-1';

describe('月次営業品質統計分析機能', () => {
  // SCEN-862
  test('過去3ヶ月の営業担当者別提案精度が正常に集計される', () => {
    const analysis_period_months = 3;
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_end_date = new Date('2024-03-31T23:59:59Z');

    const sales_rep_A_proposals = 10;
    const sales_rep_A_closures = 8;
    const sales_rep_A_expected_precision = 80;

    const sales_rep_B_proposals = 15;
    const sales_rep_B_closures = 12;
    const sales_rep_B_expected_precision = 80;

    const sales_rep_C_proposals = 12;
    const sales_rep_C_closures = 9;
    const sales_rep_C_expected_precision = 75;

    const input_data = {
      period_months: analysis_period_months,
      start_date: analysis_start_date,
      end_date: analysis_end_date,
      sales_representatives: [
        {
          rep_id: 'rep_001',
          rep_name: '営業担当者A',
          total_proposals: sales_rep_A_proposals,
          total_closures: sales_rep_A_closures,
        },
        {
          rep_id: 'rep_002',
          rep_name: '営業担当者B',
          total_proposals: sales_rep_B_proposals,
          total_closures: sales_rep_B_closures,
        },
        {
          rep_id: 'rep_003',
          rep_name: '営業担当者C',
          total_proposals: sales_rep_C_proposals,
          total_closures: sales_rep_C_closures,
        },
      ],
    };

    const result = analyzeMonthlyProposalQuality(input_data);

    expect(result.analysis_period_months).toBe(3);
    expect(result.analysis_start_date).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(result.analysis_end_date).toEqual(new Date('2024-03-31T23:59:59Z'));

    expect(result.sales_rep_statistics).toHaveLength(3);

    const stat_A = result.sales_rep_statistics.find(
      (s) => s.rep_id === 'rep_001'
    );
    expect(stat_A).toBeDefined();
    expect(stat_A?.rep_name).toBe('営業担当者A');
    expect(stat_A?.total_proposals).toBe(10);
    expect(stat_A?.total_closures).toBe(8);
    expect(stat_A?.proposal_precision_percentage).toBe(80);

    const stat_B = result.sales_rep_statistics.find(
      (s) => s.rep_id === 'rep_002'
    );
    expect(stat_B).toBeDefined();
    expect(stat_B?.rep_name).toBe('営業担当者B');
    expect(stat_B?.total_proposals).toBe(15);
    expect(stat_B?.total_closures).toBe(12);
    expect(stat_B?.proposal_precision_percentage).toBe(80);

    const stat_C = result.sales_rep_statistics.find(
      (s) => s.rep_id === 'rep_003'
    );
    expect(stat_C).toBeDefined();
    expect(stat_C?.rep_name).toBe('営業担当者C');
    expect(stat_C?.total_proposals).toBe(12);
    expect(stat_C?.total_closures).toBe(9);
    expect(stat_C?.proposal_precision_percentage).toBe(75);

    expect(result.all_data_included_for_3_months).toBe(true);
  });
});