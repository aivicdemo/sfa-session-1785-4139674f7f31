import { calculateDeviationAnalysis } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-789
  test('標準プロセスとの乖離度が許容閾値未満の場合、乖離なしと判定される', () => {
    const standardPattern = {
      monthlyVisits: 30,
      proposalDocumentsCreated: 15,
      followUpCount: 20,
    };

    const salesPersonPattern = {
      monthlyVisits: 28.5,
      proposalDocumentsCreated: 14.3,
      followUpCount: 19.0,
    };

    const result = calculateDeviationAnalysis(standardPattern, salesPersonPattern);

    expect(result.deviationStatus).toBe('compliant');
    expect(result.deviationPercentage).toBeLessThan(5);
    expect(result.deviationPercentage).toBeGreaterThanOrEqual(0);
    expect(result.isWithinThreshold).toBe(true);
  });
});