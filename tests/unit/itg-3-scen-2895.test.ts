import { evaluateRecommendationCorrelation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2895: [edge] 推奨内容と成約実績の相関判定 - 相関係数が 0.7 未満のときに要検証と判定される', () => {
    const correlationCoefficient = 0.65;
    const correlationThreshold = 0.7;

    const result = evaluateRecommendationCorrelation({
      correlationCoefficient,
      correlationThreshold,
    });

    expect(result.status).toBe('要検証');
    expect(result.correlationCoefficient).toBe(0.65);
    expect(result.requiresReview).toBe(true);
    expect(result.reasonMessage).toContain('相関係数が閾値0.7未満のため、推奨パターンの妥当性再確認が必要です');
  });
});