import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-157
  test('異なる営業担当者の商談記録が混在するとき、営業担当者ごとに正しく分離して計算される', () => {
    const deal_records = [
      {
        sales_person_id: 'A',
        deal_date: '2024-01-10',
        deal_amount: 100000,
        result_status: 'won',
      },
      {
        sales_person_id: 'A',
        deal_date: '2024-01-15',
        deal_amount: 150000,
        result_status: 'won',
      },
      {
        sales_person_id: 'A',
        deal_date: '2024-01-20',
        deal_amount: 80000,
        result_status: 'lost',
      },
      {
        sales_person_id: 'A',
        deal_date: '2024-01-25',
        deal_amount: 120000,
        result_status: 'won',
      },
      {
        sales_person_id: 'B',
        deal_date: '2024-01-12',
        deal_amount: 200000,
        result_status: 'won',
      },
      {
        sales_person_id: 'B',
        deal_date: '2024-01-18',
        deal_amount: 90000,
        result_status: 'lost',
      },
      {
        sales_person_id: 'B',
        deal_date: '2024-01-22',
        deal_amount: 110000,
        result_status: 'won',
      },
      {
        sales_person_id: 'C',
        deal_date: '2024-01-11',
        deal_amount: 75000,
        result_status: 'lost',
      },
      {
        sales_person_id: 'C',
        deal_date: '2024-01-17',
        deal_amount: 160000,
        result_status: 'won',
      },
      {
        sales_person_id: 'C',
        deal_date: '2024-01-23',
        deal_amount: 95000,
        result_status: 'lost',
      },
    ];

    const report = generateSalesPersonAnalysisReport(deal_records);

    const report_a = report.find((r) => r.sales_person_id === 'A');
    const report_b = report.find((r) => r.sales_person_id === 'B');
    const report_c = report.find((r) => r.sales_person_id === 'C');

    expect(report_a?.total_deals).toBe(4);
    expect(report_b?.total_deals).toBe(3);
    expect(report_c?.total_deals).toBe(3);

    expect(report_a?.won_deals).toBe(3);
    expect(report_b?.won_deals).toBe(2);
    expect(report_c?.won_deals).toBe(1);

    expect(report_a?.win_rate).toBeCloseTo(0.75, 5);
    expect(report_b?.win_rate).toBeCloseTo(0.6666666666666666, 5);
    expect(report_c?.win_rate).toBeCloseTo(0.3333333333333333, 5);

    expect(report_a?.average_deal_amount).toBeCloseTo(112500, 2);
    expect(report_b?.average_deal_amount).toBeCloseTo(133333.33333333334, 2);
    expect(report_c?.average_deal_amount).toBeCloseTo(110000, 2);
  });
});