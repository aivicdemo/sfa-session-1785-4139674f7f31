import { calculateCorrelationCoefficient } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-189
  test('乖離度と成約実績の相関係数が0を超える場合、正の相関として判定される', () => {
    // モックデータ準備：乖離度と成約実績の相関係数を0.15（0より大きい値）に設定
    const deviationScores = [
      { salesPersonId: 'SP001', processDeviation: 15, contractAchievement: 850000 },
      { salesPersonId: 'SP002', processDeviation: 12, contractAchievement: 920000 },
      { salesPersonId: 'SP003', processDeviation: 18, contractAchievement: 780000 },
      { salesPersonId: 'SP004', processDeviation: 10, contractAchievement: 950000 },
      { salesPersonId: 'SP005', processDeviation: 20, contractAchievement: 720000 },
    ];

    // 判定関数に相関係数0.15を入力して実行
    const correlationResult = calculateCorrelationCoefficient({
      deviationScores: deviationScores,
      correlationThreshold: 0,
    });

    // 返却される判定結果を検証
    expect(correlationResult.correlationCoefficient).toBe(0.15);
    expect(correlationResult.correlationClassification).toBe('正の相関あり');
    expect(correlationResult.improvementGuidanceGroup).toBe('グループB_正相関者向け指導');
    expect(correlationResult.isPositiveCorrelation).toBe(true);
  });
});