import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-422
  test('複数の営業担当者のデータがレポートに含まれる場合、営業担当者ごとに正確に集計される', () => {
    const sales_person_data = [
      {
        sales_person_id: 'SP_001',
        sales_person_name: '営業担当者A',
        visit_count: 15,
        contract_count: 3,
      },
      {
        sales_person_id: 'SP_002',
        sales_person_name: '営業担当者B',
        visit_count: 22,
        contract_count: 5,
      },
      {
        sales_person_id: 'SP_003',
        sales_person_name: '営業担当者C',
        visit_count: 18,
        contract_count: 4,
      },
    ];

    const report = generateSalesPersonBehaviorAnalysisReport(sales_person_data);

    expect(report).toEqual({
      report_id: expect.any(String),
      generated_at: expect.any(String),
      sales_person_reports: [
        {
          sales_person_id: 'SP_001',
          sales_person_name: '営業担当者A',
          visit_count: 15,
          contract_count: 3,
          contract_rate: 20.0,
        },
        {
          sales_person_id: 'SP_002',
          sales_person_name: '営業担当者B',
          visit_count: 22,
          contract_count: 5,
          contract_rate: 22.7,
        },
        {
          sales_person_id: 'SP_003',
          sales_person_name: '営業担当者C',
          visit_count: 18,
          contract_count: 4,
          contract_rate: 22.2,
        },
      ],
    });

    expect(report.sales_person_reports[0].contract_rate).toBe(20.0);
    expect(report.sales_person_reports[1].contract_rate).toBeCloseTo(22.727272, 5);
    expect(report.sales_person_reports[2].contract_rate).toBeCloseTo(22.222222, 5);
  });
});