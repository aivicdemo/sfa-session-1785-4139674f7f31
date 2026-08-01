import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-463
  test('AIエージェント推論ログが1件の場合、その1件に基づいて推論精度が計算される', () => {
    const inferenceLog = {
      inferenceId: 'INFER-001',
      inferenceType: '顧客分類',
      inputData: '顧客A',
      inferenceResult: '高優先度',
      correctLabel: '高優先度',
      inferenceTimestamp: new Date('2024-01-15T10:30:00Z')
    };

    const result = calculateInferenceAccuracy([inferenceLog]);

    expect(result.accuracy).toBe(100.0);
  });
});