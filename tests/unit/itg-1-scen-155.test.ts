import { determineInferenceExecutabilityByDataQualityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行可否判定機能', () => {
  // SCEN-155: [edge] データ品質スコアが許容下限を直下で推論実行が保留される
  test('データ品質スコア59点（許容下限60点未満）で推論実行が保留される', () => {
    const dataQualityScore = 59;
    const minAcceptableScore = 60;

    const result = determineInferenceExecutabilityByDataQualityScore({
      dataQualityScore,
      minAcceptableScore,
    });

    expect(result.status).toBe('PENDING');
    expect(result.isExecutable).toBe(false);
    expect(result.requiresManualReview).toBe(true);
  });
});