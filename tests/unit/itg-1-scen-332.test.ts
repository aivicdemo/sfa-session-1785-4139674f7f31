import { generateSalesPersonActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-332
  test('[edge] 営業担当者が0人の場合、空のレポートが生成される', () => {
    const salesPersonCount = 0;
    const analysisData = [];
    const reportBody = [];

    const result = generateSalesPersonActionPatternReport({
      salesPersonCount,
      analysisData,
      reportBody,
    });

    expect(result).toEqual({
      salesPersonCount: 0,
      analysisData: [],
      reportBody: [],
      error: null,
    });
    expect(result.error).toBeNull();
  });
});