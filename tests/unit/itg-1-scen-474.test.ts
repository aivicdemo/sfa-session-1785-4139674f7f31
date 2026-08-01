import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-474
  test('営業担当者の成約実績が0件の場合、成約率が計算されない', () => {
    const salesperson_id = 'A001';
    const contact_count = 5;
    const contract_count = 0;
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';

    const input = {
      salesperson_id,
      contact_count,
      contract_count,
      analysis_start_date,
      analysis_end_date,
    };

    const report = generateSalesActivityPatternAnalysisReport(input);

    expect(report.salesperson_id).toBe('A001');
    expect(report.contact_count).toBe(5);
    expect(report.contract_count).toBe(0);
    expect(report.contract_rate).toBeNull();
    expect(report.status).toBe('completed');
  });
});