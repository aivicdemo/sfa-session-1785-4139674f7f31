import { evaluateDetectionReasonAndPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-581
  test('根拠が空白の検出結果はエラーとして拒否される', () => {
    const detectionResultWithEmptyReason = {
      id: 'detection_001',
      reason: '',
      severity: 'high',
      isActionRequired: true,
      timestamp: '2024-01-15T11:00:00Z'
    };

    expect(() =>
      evaluateDetectionReasonAndPriority(detectionResultWithEmptyReason)
    ).toThrow(/根拠/);
  });
});