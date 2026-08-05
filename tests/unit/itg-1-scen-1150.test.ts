import { analyzeActionPatternAndGenerateReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1150
  test('標準プロセスとの乖離率が許容閾値直下（+4.9%）のとき正常範囲として分類される', () => {
    const input = {
      salesRepId: 'REP-001',
      salesRepName: '営業担当者A',
      standardProcessHours: 100,
      actualHours: 104.9,
      toleranceThresholdPercent: 5.0,
      successPatternMatches: [],
      failurePatternMatches: [],
    };

    const result = analyzeActionPatternAndGenerateReport(input);

    expect(result.deviationRatePercent).toBe(4.9);
    expect(result.classificationStatus).toBe('正常範囲');
    expect(result.warningFlag).toBe(false);
  });
});