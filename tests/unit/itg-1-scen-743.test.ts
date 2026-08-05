import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-743
  test('顧客対応パターン分析結果が空配列のときエラーになる', () => {
    const customerPatternAnalysisResults: any[] = [];

    expect(() => {
      calculateInferenceAccuracyScore(customerPatternAnalysisResults);
    }).toThrow(/CustomerPatternAnalysisEmptyError/);
  });
});