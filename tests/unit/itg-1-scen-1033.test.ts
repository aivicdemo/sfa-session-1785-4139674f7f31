import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1033
  test('[error] 分析対象期間の開始日が欠落しているとき処理がエラーになること', () => {
    const input = {
      salesPersonId: 'EMP001',
      analysisStartDate: null,
      analysisEndDate: '2024-01-31',
    };

    expect(() => generateSalesPersonBehaviorAnalysisReport(input)).toThrow(/開始日/);
  });
});