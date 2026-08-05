import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-246: 標準プロセス遵守度スコア計算機能 - 遵守度スコアがちょうど閾値100%のとき正常と判定される', () => {
    const totalScore = 100;
    const maxScore = 100;

    const result = calculateProcessComplianceScore({
      totalScore,
      maxScore,
    });

    expect(result.complianceScore).toBe(100.0);
    expect(result.compliancePercentage).toBe(100.0);
    expect(result.status).toBe('正常');
    expect(typeof result.complianceScore).toBe('number');
  });
});