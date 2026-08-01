import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-612
  test('過去3ヶ月間の営業担当者1名の場合、その担当者の成約率が正常に抽出される', async () => {
    const sales_person_id = 'sales_001';
    const start_date = new Date('2024-09-01T00:00:00Z');
    const end_date = new Date('2024-11-30T23:59:59Z');
    const total_negotiations = 20;
    const completed_deals = 5;
    const expected_contract_rate = 25.0;

    const report = await generateSalesPersonBehaviorAnalysisReport({
      sales_person_id: sales_person_id,
      start_date: start_date,
      end_date: end_date,
      total_negotiations: total_negotiations,
      completed_deals: completed_deals,
    });

    expect(report).toBeDefined();
    expect(report.sales_person_id).toBe(sales_person_id);
    expect(report.start_date).toEqual(start_date);
    expect(report.end_date).toEqual(end_date);
    expect(report.total_negotiations).toBe(total_negotiations);
    expect(report.completed_deals).toBe(completed_deals);
    expect(report.contract_rate).toBe(expected_contract_rate);
  });
});