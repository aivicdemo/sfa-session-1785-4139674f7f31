import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-632
  test('営業活動ログデータが欠落しているときエラーになる', async () => {
    const salesRepId = 'SALES001';
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';

    const requestPayload = {
      salesRepId,
      analysisStartDate,
      analysisEndDate,
    };

    expect(() =>
      generateSalesActivityPatternAnalysisReport(requestPayload)
    ).toThrow(/営業活動ログ/);
  });
});