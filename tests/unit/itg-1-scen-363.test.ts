import { generateSalesActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-363
  test('分析対象期間の開始日が欠落しているとき、エラーが発生する', () => {
    const input = {
      startDate: null,
      endDate: '2024-12-31',
      salesPersonId: 'SALES-001'
    };

    expect(() => generateSalesActionPatternReport(input)).toThrow(/startDate/);
  });
});