import { evaluateDetectionResultCriticality } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-595
  test('[normal] 問題検出結果の重要度・対応必要性判定機能 - 検出結果にAIエージェント推論ログIDが含まれている場合判定対象として処理される', () => {
    const detectionResult = {
      aiAgentInferenceLogId: 'AIL-20240115-00001',
      detectionType: 'process_deviation',
      severity: 'high',
      timestamp: new Date('2024-01-15T11:00:00Z'),
      description: 'Process step deviation detected',
    };

    const result = evaluateDetectionResultCriticality(detectionResult);

    expect(result.isProcessingTarget).toBe(true);
    expect(result.severityScore).toBeGreaterThan(0);
    expect(result.requiresAction).toBe(true);
  });
});