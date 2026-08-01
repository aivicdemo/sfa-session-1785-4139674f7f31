import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-411
  test('レポート生成対象となる営業担当者が0名の場合、空のレポートリストが返される', async () => {
    const result = await generateSalesRepBehaviorAnalysisReport({
      salesRepIds: [],
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    });

    expect(result.reports).toEqual([]);
    expect(result.reports.length).toBe(0);
    expect(result.statusCode).toBe(200);
    expect(result.errorMessage).toBeUndefined();
  });
});