import { evaluateDetectionResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-847: 問題検出結果の重要度・根拠・対応必要性判定機能 - 根拠信頼度が信頼性下限未満のとき根拠判定が不成立になる', () => {
    const confidenceThreshold = 0.5;
    const groundingConfidenceValue = 0.49;

    const detectionPayload = {
      detectionId: 'det-001',
      severity: 'high',
      groundingConfidence: groundingConfidenceValue,
      groundingText: 'Detected deviation from standard process step 2',
      actionableRecommendation: 'Review customer contact frequency',
    };

    const result = evaluateDetectionResult(detectionPayload, confidenceThreshold);

    expect(result.groundingJudgement).toBe('unestablished');
    expect(result.actionRequiredStatus).toBe('pending');
    expect(result.message).toMatch(/根拠不十分|insufficient/i);
  });
});