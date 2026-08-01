import { calculatePriorityAndUrgency } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-609
  test('問題検出結果の重要度・対応必要性判定機能 - 検出結果IDが欠落している場合エラーとして拒否される', () => {
    const inputWithoutDetectionResultId = {
      detectionResultId: null,
      problemCategory: 'PROCESS_DEVIATION',
      impactScope: 'SINGLE_SALESPERSON',
      occurrenceFrequency: 3,
      affectedRecordsCount: 5,
      deviationSeverity: 0.45,
    };

    expect(() => calculatePriorityAndUrgency(inputWithoutDetectionResultId)).toThrow(/MISSING_DETECTION_RESULT_ID/);
  });
});