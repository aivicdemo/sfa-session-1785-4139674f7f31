import { validateAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-379
  test('推論精度が設定閾値直下のとき、閾値未達成判定が発生する', () => {
    const threshold_accuracy_percent = 80.0;
    const actual_accuracy_percent = 79.99;

    const validation_result = validateAccuracy(
      actual_accuracy_percent,
      threshold_accuracy_percent
    );

    expect(validation_result.isThresholdMet).toBe(false);
    expect(validation_result.accuracyScore).toBe(79.99);
    expect(validation_result.judgmentStatus).toBe('THRESHOLD_NOT_MET');
  });
});