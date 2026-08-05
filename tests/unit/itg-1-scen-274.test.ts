import { calculateSalesCoachingJudgment } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-274
  test('成約実績データが null のとき、処理が中断される', () => {
    const salesRepId = 'rep_001';
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');
    const behaviorPatternData = {
      initialContactFrequency: 2.5,
      proposalSuccessRate: 0.65,
      followUpInterval: 3.2,
      customerResponseRate: 0.58,
    };
    const standardProcessDefinition = {
      initialContactMinFrequency: 2.0,
      proposalMinSuccessRate: 0.60,
      followUpMaxInterval: 4.0,
      customerResponseMinRate: 0.50,
    };
    const contractPerformanceData = null;

    expect(() =>
      calculateSalesCoachingJudgment({
        salesRepId,
        analysisStartDate,
        analysisEndDate,
        behaviorPatternData,
        standardProcessDefinition,
        contractPerformanceData,
      })
    ).toThrow(/成約実績/);
  });
});