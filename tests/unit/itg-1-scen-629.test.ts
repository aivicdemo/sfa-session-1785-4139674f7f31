import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-629
  test('レポート生成対象の営業担当者IDが欠落しているときエラーになる', () => {
    const invalidInputNull = {
      salesPersonId: null,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    };

    const invalidInputUndefined = {
      salesPersonId: undefined,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    };

    expect(() =>
      generateSalesPersonBehaviorAnalysisReport(invalidInputNull)
    ).toThrow(/営業担当者ID/);

    expect(() =>
      generateSalesPersonBehaviorAnalysisReport(invalidInputUndefined)
    ).toThrow(/営業担当者ID/);
  });
});