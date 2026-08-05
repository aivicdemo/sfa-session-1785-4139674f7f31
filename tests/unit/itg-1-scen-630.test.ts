import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-630
  test('行動パターン分析結果テーブルが空のときエラーになる', () => {
    const input = {
      analysisDataset: [],
      salesRepIds: [],
      analysisPeriodStart: '2024-01-01',
      analysisPeriodEnd: '2024-01-31',
    };

    expect(() =>
      generateSalesRepBehaviorAnalysisReport(input)
    ).toThrow(/分析対象の行動データが存在しません/);
  });
});