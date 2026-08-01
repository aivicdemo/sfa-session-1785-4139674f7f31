import { analyzeDeviationFromStandardProcess } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-790
  test('標準プロセスとの乖離度が許容閾値を超える営業担当者について乖離ありと判定される', () => {
    const salesPersonId = 'SP-001';
    const standardProcessTime = 100;
    const actualProcessTime = 106;
    const toleranceThreshold = 5;

    const result = analyzeDeviationFromStandardProcess({
      salesPersonId,
      standardProcessTime,
      actualProcessTime,
      toleranceThreshold,
    });

    expect(result.hasDeviation).toBe(true);
    expect(result.deviationPercentage).toBe(6.0);
    expect(result.isWithinTolerance).toBe(false);
  });
});