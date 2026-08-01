import { analyzeDeviationAndPerformance } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-190: [edge] 営業担当者行動パターン分析・改善指導対象判定機能 - 乖離度と成約実績の相関係数がちょうど0の場合、無相関として判定される
  test('相関係数が0のとき、判定結果に無相関と記録され、改善指導の対象外として判定される', () => {
    const deviationScores = [0, 5, 10];
    const performanceResults = [100, 100, 100];

    const result = analyzeDeviationAndPerformance(deviationScores, performanceResults);

    expect(result.correlationCoefficient).toBe(0);
    expect(result.correlationJudgment).toBe('無相関');
    expect(result.shouldReceiveImprovement).toBe(false);
  });
});