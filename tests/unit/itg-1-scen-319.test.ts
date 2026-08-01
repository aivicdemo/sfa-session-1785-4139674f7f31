import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-319
  test('[edge] 営業案件が0件の営業担当者について乖離度が正常に計算される', () => {
    const salesRepId = 'SA001';
    const salesRepName = '営業担当者A';
    const dealCount = 0;
    const standardProcessSteps = 4;
    const completedSteps = 0;

    const report = generateSalesRepBehaviorAnalysisReport({
      salesRepId,
      salesRepName,
      dealCount,
      standardProcessSteps,
      completedSteps,
    });

    expect(report.salesRepId).toBe('SA001');
    expect(report.salesRepName).toBe('営業担当者A');
    expect(report.dealCount).toBe(0);
    expect(report.deviation).toBe(0.0);
    expect(report.deviation).not.toBeNull();
    expect(report.deviation).not.toBeUndefined();
    expect(typeof report.deviation).toBe('number');
  });
});