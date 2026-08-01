import { generateSalesActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-365
  test('分析対象期間が月初から月末にかけて跨るとき、正しく集計される', () => {
    const salesperson_id = 'SP-001';
    const analysis_start_date = new Date('2024-01-31T00:00:00Z');
    const analysis_end_date = new Date('2024-02-01T23:59:59Z');

    const action_data = [
      {
        salesperson_id: salesperson_id,
        action_date: new Date('2024-01-31T09:00:00Z'),
        action_type: 'negotiation',
        action_count: 3,
      },
      {
        salesperson_id: salesperson_id,
        action_date: new Date('2024-02-01T09:00:00Z'),
        action_type: 'negotiation',
        action_count: 2,
      },
      {
        salesperson_id: salesperson_id,
        action_date: new Date('2024-01-31T14:00:00Z'),
        action_type: 'email',
        action_count: 4,
      },
      {
        salesperson_id: salesperson_id,
        action_date: new Date('2024-02-01T14:00:00Z'),
        action_type: 'email',
        action_count: 3,
      },
    ];

    const report = generateSalesActionPatternReport({
      salesperson_id: salesperson_id,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      action_data: action_data,
    });

    const negotiation_total = report.summary.action_type_totals.find(
      (item) => item.action_type === 'negotiation'
    )?.total_count;
    const email_total = report.summary.action_type_totals.find(
      (item) => item.action_type === 'email'
    )?.total_count;

    const jan31_daily = report.daily_breakdown.find(
      (item) => item.date === '2024-01-31'
    )?.total_count;
    const feb01_daily = report.daily_breakdown.find(
      (item) => item.date === '2024-02-01'
    )?.total_count;

    expect(negotiation_total).toBe(5);
    expect(email_total).toBe(7);
    expect(jan31_daily).toBe(7);
    expect(feb01_daily).toBe(5);
  });
});