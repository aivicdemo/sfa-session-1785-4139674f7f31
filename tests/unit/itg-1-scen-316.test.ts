import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-316
  test('成約実績が0件の営業担当者について成約率が正常に計算される', () => {
    const salesPersonId = 'A001';
    const contactCount = 5;
    const closedDealCount = 0;

    const report = generateBehaviorPatternAnalysisReport({
      salesPersonId,
      contactCount,
      closedDealCount,
    });

    expect(report.closingRate).toBe(0.0);
    expect(report.reportStatus).toBe('completed');
  });
});