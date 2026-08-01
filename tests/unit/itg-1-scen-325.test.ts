import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-325
  test('標準プロセスからの乖離度が100%超の場合、正常に判定される', () => {
    const standardProcessHours = 100;
    const actualProcessHours = 210;
    const salesRepId = 'A';

    const result = generateSalesRepBehaviorAnalysisReport({
      salesRepId: salesRepId,
      standardProcessHours: standardProcessHours,
      actualProcessHours: actualProcessHours,
    });

    const expectedDeviationPercentage = 110;
    expect(result.deviationPercentage).toBe(expectedDeviationPercentage);
    expect(result.status).toBe('標準プロセスから大幅に乖離');
    expect(result.error).toBeUndefined();
  });
});