import { calculateCorrelationAndJudgeSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-599: [normal] 問題検出結果の重要度・対応必要性判定機能 - 営業成約実績との相関度が低い検出結果は低い重要度に判定される
  test('相関係数が0.3以下の検出結果に対して重要度レベルがLowと判定される', () => {
    const detectionResult = {
      detectionId: 'DET-001',
      categoryId: 'CAT-LOW-FREQ',
      proposalCount: 15,
      closedCount: 1,
      description: '提案数が多いが成約に至らない',
    };

    const correlationData = {
      categoryId: 'CAT-LOW-FREQ',
      monthlyClosureRate: 0.08,
      detectionCorrelationCoefficient: 0.25,
      sampleSize: 12,
    };

    const result = calculateCorrelationAndJudgeSeverity(detectionResult, correlationData);

    expect(result.severityLevel).toBe('Low');
    expect(result.actionRequired).toBe(false);
    expect(result.correlationCoefficient).toBe(0.25);
  });
});