import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析レポート生成機能', () => {
  // SCEN-470
  test('分析対象期間の開始日が欠落している場合、エラーを返す', () => {
    const input = {
      salesPersonId: 'SALES001',
      startDate: null,
      endDate: '2024-12-31',
    };

    expect(() => generateSalesActivityPatternAnalysisReport(input)).toThrow(/開始日/);
  });
});