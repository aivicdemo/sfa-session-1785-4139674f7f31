import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-341
  test('分析対象期間の開始日がnullのとき、エラーが発生する', () => {
    const analysisRequest = {
      startDate: null,
      endDate: new Date('2024-12-31'),
      targetSalesPersonIds: ['SP001', 'SP002'],
      includeSuccessPatterns: true,
      includeFailurePatterns: true,
    };

    expect(() =>
      generateSalesActivityAnalysisReport(analysisRequest)
    ).toThrow(/分析対象期間の開始日/);
  });
});