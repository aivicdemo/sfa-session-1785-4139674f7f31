import { generateSalesPersonBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1109
  test('分析対象期間の終了日が欠落しているとき、処理がエラーになること', () => {
    const input = {
      salesPersonId: 'SALES-001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: null,
    };

    expect(() => generateSalesPersonBehaviorPatternAnalysisReport(input)).toThrow(/終了日/);
  });
});