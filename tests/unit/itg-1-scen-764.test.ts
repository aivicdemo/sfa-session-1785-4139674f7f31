import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-764
  test('行動パターン分析対象指標の自動選定機能 - 分析期間が年度をまたぐ場合、両年度のデータが正しく集計される', () => {
    const analysis_start_date = new Date('2024-03-01T00:00:00Z');
    const analysis_end_date = new Date('2025-03-31T23:59:59Z');

    const fiscal_year_2024_start = new Date('2024-04-01T00:00:00Z');
    const fiscal_year_2024_end = new Date('2025-03-31T23:59:59Z');

    const fiscal_year_2025_start = new Date('2025-04-01T00:00:00Z');
    const fiscal_year_2025_end = new Date('2026-03-31T23:59:59Z');

    const sales_rep_id = 'sales_rep_001';

    const result = selectAnalysisIndicators({
      analysis_start_date,
      analysis_end_date,
      sales_rep_id,
    });

    expect(result).toEqual({
      analysis_period: {
        start_date: '2024-03-01T00:00:00Z',
        end_date: '2025-03-31T23:59:59Z',
      },
      fiscal_year_2024: {
        period_start: '2024-04-01T00:00:00Z',
        period_end: '2025-03-31T23:59:59Z',
        data_count: 15,
        total_sales_amount: 15000000,
      },
      fiscal_year_2025: {
        period_start: '2025-04-01T00:00:00Z',
        period_end: '2026-03-31T23:59:59Z',
        data_count: 12,
        total_sales_amount: 12000000,
      },
      aggregated_total: {
        combined_data_count: 27,
        combined_sales_amount: 27000000,
      },
      selected_indicators: [
        'initial_contact_frequency',
        'proposal_success_rate',
        'followup_interval',
        'customer_response_time',
        'deal_closure_rate',
      ],
    });

    expect(result.fiscal_year_2024.data_count).toBe(15);
    expect(result.fiscal_year_2024.total_sales_amount).toBe(15000000);
    expect(result.fiscal_year_2025.data_count).toBe(12);
    expect(result.fiscal_year_2025.total_sales_amount).toBe(12000000);
    expect(result.aggregated_total.combined_data_count).toBe(27);
    expect(result.aggregated_total.combined_sales_amount).toBe(27000000);
  });
});