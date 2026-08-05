import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-699
  test('対象営業担当者IDが空文字列のとき分析対象者の特定に失敗しエラーになる', () => {
    const emptyPersonId = '';

    expect(() => {
      generateSalesPersonBehaviorAnalysisReport({
        salesPersonId: emptyPersonId,
        analysisStartDate: '2024-01-01',
        analysisEndDate: '2024-01-31',
      });
    }).toThrow(/営業担当者ID/);
  });
});