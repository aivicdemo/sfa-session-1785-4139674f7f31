import { validateDataQualityBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前データ品質検証機能', () => {
  // SCEN-136
  test('学習データが最小要件を満たすがデータ品質が不良のとき推論実行が保留される', () => {
    const testDataset = {
      recordCount: 2000,
      requiredFieldsMissingRate: 0,
      completenessScore: 65,
      consistencyScore: 60,
      validityScore: 70,
      qualityThreshold: 80,
    };

    const result = validateDataQualityBeforeInference(testDataset);

    expect(result.status).toBe('PENDING_QUALITY_IMPROVEMENT');
    expect(result.message).toBe(
      'Data quality score 65% is below threshold 80%. Inference execution is suspended until data quality improves.'
    );
    expect(result.inferenceAllowed).toBe(false);
  });
});