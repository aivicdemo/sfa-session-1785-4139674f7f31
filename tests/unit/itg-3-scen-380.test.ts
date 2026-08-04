import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度検証 - 閾値判定', () => {
  // SCEN-380
  test('推論精度が設定閾値直上（80.01%）のとき、閾値達成判定が成功', () => {
    const inferenceAccuracyPercent = 80.01;
    const thresholdPercent = 80;
    const evaluationTimestamp = new Date('2024-11-15T14:30:00Z');

    const result = evaluateInferenceAccuracy({
      inferenceAccuracyPercent,
      thresholdPercent,
      evaluationTimestamp,
    });

    expect(result.judgementPassed).toBe(true);
    expect(result.achievedAccuracyPercent).toBe(80.01);
    expect(result.judgementStatus).toBe('適用可能');
    expect(result.judgementMessage).toContain('推論精度 80.01%');
    expect(result.judgementMessage).toContain('設定閾値 80%');
    expect(result.judgementLog).toEqual({
      accuracyPercent: 80.01,
      thresholdPercent: 80,
      recordedAt: '2024-11-15T14:30:00Z',
    });
  });
});