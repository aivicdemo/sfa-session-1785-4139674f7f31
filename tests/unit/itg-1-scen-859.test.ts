import { calculateCorrelationAndAnalyze } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-859
  test('営業プロセス標準書との乖離分析と成約実績の相関分析 - 相関係数が1に近い場合、強い正の相関として記録する', () => {
    const deviationScores = [10, 15, 20, 25, 30];
    const contractResults = [2, 3, 4, 5, 6];
    const datasetId = 'dataset-001';
    const formulaVersion = 'v1.0';
    const calculatedAt = new Date('2024-01-15T10:30:00Z');

    const result = calculateCorrelationAndAnalyze({
      deviationScores,
      contractResults,
      datasetId,
      formulaVersion,
      calculatedAt,
    });

    expect(result.correlationCoefficient).toBe(0.98);
    expect(result.correlationEvaluation).toBe('強い正の相関');
    expect(result.correlationStrengthLevel).toBe('HIGH');
    expect(result.usedDatasetId).toBe('dataset-001');
    expect(result.calculationFormulaVersion).toBe('v1.0');
    expect(result.calculationTimestamp).toEqual(new Date('2024-01-15T10:30:00Z'));
  });
});