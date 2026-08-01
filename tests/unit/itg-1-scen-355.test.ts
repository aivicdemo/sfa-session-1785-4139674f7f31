import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-355
  test('成約実績データが0件のとき、成約率が0%で計算される', () => {
    const sales_rep_id = 'SR001';
    const sales_rep_name = '山田太郎';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');
    const contact_frequency = 12;
    const proposal_count = 5;
    const contract_actual_count = 0;
    const deal_count = 5;

    const input = {
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      analysis_period_start: analysis_period_start,
      analysis_period_end: analysis_period_end,
      contact_frequency: contact_frequency,
      proposal_count: proposal_count,
      contract_actual_count: contract_actual_count,
      deal_count: deal_count,
    };

    const result = generateBehaviorPatternAnalysisReport(input);

    expect(result).toBeDefined();
    expect(result.sales_rep_id).toBe('SR001');
    expect(result.sales_rep_name).toBe('山田太郎');
    expect(result.analysis_period_start).toEqual(analysis_period_start);
    expect(result.analysis_period_end).toEqual(analysis_period_end);
    expect(result.contact_frequency).toBe(12);
    expect(result.proposal_count).toBe(5);
    expect(result.contract_actual_count).toBe(0);
    expect(result.deal_count).toBe(5);
    expect(result.contract_rate).toBe(0);
    expect(result.contract_rate_display).toBe('0%');
  });
});