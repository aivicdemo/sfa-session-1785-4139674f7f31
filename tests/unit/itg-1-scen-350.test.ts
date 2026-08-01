import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-350
  test('営業担当者の商談実績データが1件のとき、成功パターン・失敗パターン・成約率が正しく計算される', () => {
    const salesPersonId = 'sales-001';
    const dealData = [
      {
        dealId: 'deal-001',
        salesPersonId: 'sales-001',
        dealAmount: 1000000,
        status: '成功',
        dealType: '新規案件'
      }
    ];

    const report = generateSalesPersonBehaviorAnalysisReport(salesPersonId, dealData);

    expect(report.successPatternCount).toBe(1);
    expect(report.failurePatternCount).toBe(0);
    expect(report.conversionRate).toBe(100);
  });
});